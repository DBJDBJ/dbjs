/// <reference path="../../jq132-vsdoc.js" />
///
/// Dynamic configurable loader.
/// Usage :
/// <script src="http://dbj.org/6/dbj.ldr.js" _CFG_="dbj.lib.json" ></script>
/// Attrib _CFG_ must exist
/// Path to the cfg json is takend from the src attribute
/// json format is this :
/*
{  "dbj.lib.js" : null , "jquery.dbj.js" : null  }

After loading this json will be logged , changed like this

{  "dbj.lib.js" : "success" , "jquery.dbj.js" : "file not found"  }

this says that first file loaded OK, but second did not

*/
/*
* A technique for avoiding browsers' cross-domain restriction
* Allows you to request information cross-domain from client
* You request a script from a cross domain
* That service must respond in JSON wrapped in a function call you specify
*
window.myFunc = function ( data ) {
        alert('JSONP callback');
}
var script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Dog&callback=myFunc';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
*/
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LDR.JS(tm)
///
/// $Revision: 16 $$Date: 24/02/10 16:58 $
///
/// Dependencies : jQuery 1.3.2 or higher
(function(global, undefined) {

    if (window.dbj_loader_cache === undefined) {
        window.dbj_loader_cache = {};
    }

    var join = function() { return [].join.call(arguments, ''); },

    terror = function() { var s_ = [].join.call(arguments, ''); log_.call(window, s_); throw new Error(0xFFFF, "DBJ*Loader ERROR: " + s_); },
        dbj = dbj || (dbj = {}),
        STR_JQUERY_URL = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js",
        STR_APPLY = "apply",
        STR_ASYNC = "async",
        STR_CACHE = "cache",
        STR_CALL = "call",
        STR_CHAIN = "chain",
        STR_CHARSET = "charset",
        STR_CREATE_ELEMENT = "createElement",
        STR_GET_ELEMENTS_BY_TAG_NAME = "getElementsByTagName",
        STR_HREF = "href",
        STR_LENGTH = "length",
        STR_ON_LOAD = "onload",
        STR_ON_READY_STATE_CHANGE = "onreadystatechange",
        STR_PLUS = "+",
        STR_PUSH = "push",
        STR_READY_STATE = "readyState",
        STR_URL = "url",
        STR_SCRIPT = "script",
        STR_TYPE = "type",
        STR_CFG_ATT = "_CFG_", STR_PTH_ATT = "_PATH_",
        STR_CFG_READY = "_ONREADY_",
        STR_LOADED_SIGNAL = "LOADED",
        STR_DBJ_LOADER = "DBJ*Loader",
        STR_COLON_COLON = "::" ,
        STR_SPECIAL_CFG_ID = "dbj.lib.cfg",
        loadedCompleteRegExp = /loaded|complete/,
        slice = [].slice,
        head = document[STR_GET_ELEMENTS_BY_TAG_NAME]("head")[0] || document.documentElement;

    // Defer execution just enough for all browsers (especially Opera!)
    function delayed_call(func, self, time_out) {
        var tid = setTimeout(function() {
            clearTimeout(tid); delete tid;
            try {
                func[STR_APPLY](self || global, slice[STR_CALL](arguments, 2));
            } catch (x) {
                terror.call(global, " name: ", x, "", ", message: ", x.message);
            }
        }, time_out || 0);
    }

    // we do this log-method-quickie here so that we do not depend on some library
    // if firebug or other window.console is not present
    var log_ = (!console || !console.log) ? function() {
        delayed_call(function() {
            var s_ =  STR_DBJ_LOADER + STR_COLON_COLON + [].join.call(arguments, '');
            document.body.innerHTML += ("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + s_ + "</ul></li>").replace(/\n/g, "<br/>");
        }, this, 1);
    } : function() {
    var s_ = STR_DBJ_LOADER + STR_COLON_COLON + [].join.call(arguments, '');
        delayed_call(function() {
            console.log(s_);
        }, this, 1);
    };


    // for the time being this crazzy nugget is winning ...
    var loadScript = function(options, callback) {

        if (global.dbj_loader_cache[options[STR_URL]]) return;

        var script = document[STR_CREATE_ELEMENT](STR_SCRIPT), done = false;

        script[STR_ASYNC] = STR_ASYNC;
        script[STR_TYPE] = "text/javascript";

        if (options[STR_CHARSET]) {
            script[STR_CHARSET] = options[STR_CHARSET];
        }

        if (options["id"]) {
            script["id"] = options["id"];
        }

        script.src = options[STR_URL];

        // Attach handlers for all browsers
        script[STR_ON_LOAD] = script[STR_ON_READY_STATE_CHANGE] = function() {

            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                // Handle memory leak in IE
                script[STR_ON_LOAD] = script[STR_ON_READY_STATE_CHANGE] = null;

                global.dbj_loader_cache[this.src] = this.id || true;
                log_.call(global, script.src, " Loaded");

                head.removeChild(script);

                if ("function" === typeof callback) {
                    if (global.opera)
                        delayed_call(callback, global);
                    else
                        callback.call(global);
                }
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (jQuery #2709 and #4378).
        head.insertBefore(script, head.firstChild);
    };

    //--------------------------------------------------------------------------
    // this is present in ES5 as Object.keys()
    function keys(object) {
        var k = []; 
        if ("object" === typeof object)
        for (var name in object) {
            if (Object.prototype.hasOwnProperty.call(object, name))
                k.push(name);
        }
        return k;
    }

    // this is dbj's sequential recursive loader
    // it loads javascritps in sequence, vs. in parallel
    // when last one is done it calls the onready callback
    var loader = function(jQuery, CFG_PATH, CFG_FILE, callback, undefined) {
        jQuery.ajaxSetup({ async: false }); // CRUCIAL!
        $.getJSON(
        CFG_PATH + CFG_FILE,
        function(data, stat) {
            var key = keys(data);
            function inner_loader(j, key) {
                var js = key[j];
                if (!js) return;
                loadScript({ "url": CFG_PATH + js }, function() {
                    log_("Loaded:", CFG_PATH, js, " :status: ", stat);
                    if (j === (key.length - 1)) {
                        // log_("j: ", j, ", l: ", key.length - 1, ", time to call the final callback");
                        if ("function" === typeof callback) {
                            log_("Now calling ONREADY handler");
                            delayed_call(callback, window);
                            return;
                        }
                    } else {
                        inner_loader(j + 1, key);
                    }
                });
            }
            inner_loader(0, key); // start loading from the first one
        });
    };
    //
    var on_jq_ready = function() {
        /*
        jQuery(document.body).error(function(msg, url, line) {
        log_("DBJ*Loader XHR Error: ", msg, "url: ", url, line); return false;
        });
        jQuery(document.body).ajaxError(function(event, xhr, settings, thrownError) {
        log_("DBJ*Loader XHR Error requesting: ", settings.url, (thrownError ? ", message: " + thrownError.message : "")); return false;
        });
        */
        var $cfg = jQuery("script[" + STR_CFG_ATT + "][src]");
        if ($cfg.length < 1) {
            terror.call(global, "At least one script element must have valid both src and ", STR_CFG_ATT, " attributes");
        }
        $cfg.each(function() {
            try {
                var $this = jQuery(this),
                        CFG_FILE = $this.attr(STR_CFG_ATT),
                        CFG_PATH = $this.attr(STR_PTH_ATT), // try to use path attribute from the script element
                        path = $this.attr('src'),
                        CFG_ONREADY = $this.attr(STR_CFG_READY);

                if (top.dbj_was_here[path]) {
                    log_("Already done: ", path);
                    return;
                }
                top.dbj_was_here[path] = true;

                if (undefined === CFG_FILE)
                    terror.call(global, STR_CFG_ATT + " attribute is not defined?");
                if (CFG_PATH === undefined) {
                    // if not user defined make path to be the same as script src attribute path component
                    CFG_PATH = path.match(/^.*\//) ? "" + path.replace(/\\/g, "/").match(/^.*\//) : "./";
                }
                var defualt_onready = new Function(join(" console.log('no ready handler found for:", CFG_PATH, CFG_FILE, "')")),
                        on_ready;
                try {
                    on_ready = (new Function("return " + CFG_ONREADY))();

                    if ("function" !== typeof on_ready) {
                        log_.call(global, "User defined ready handler can not be used, because it is not a function");
                        on_ready = defualt_onready;
                    }
                    log_("Function : ", CFG_ONREADY, "(), is found to be user defined onready handler");
                } catch (x) {
                    log_.call(global, "ERROR while evaluating _ON_READY_ attribute. Default onready handler will be used.");
                    on_ready = defualt_onready;
                }
                loader(jQuery, CFG_PATH, CFG_FILE, on_ready);
            } catch (x) {
                log_.call(global, "ERRROR:\n" + x.message);
            }
        });
    };
    //
    top.dbj_was_here = [];
    loadScript({ "url": STR_JQUERY_URL }, on_jq_ready);
})(window);
    ////////////////////////////////////////////////////////////////////////////////////////