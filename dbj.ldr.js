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
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LDR.JS(tm)
///
/// $Revision: 12 $$Date: 17/02/10 1:18 $
///
/// Dependencies : jQuery 1.3.2 or higher
(function(global, undefined) {

    if (global.dbj_loader_cache === undefined) {
        global.dbj_loader_cache = {};
    }

    var join = function() { return [].join.call(arguments, ''); },

    // we do this log-method-quickie here so that we do not depend on some library
    // if firebug or other window.console is not present
    log_ = (!global.console || !global.console.log) ? function() {
        document.body.innerHTML += ("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + [].join.call(arguments, '') + "</ul></li>").replace(/\n/g, "<br/>");
    } : function() {
        global.console.log([].join.call(arguments, ''));
    },
    terror = function() { var s_ = [].join.call(arguments, ''); log_(s_); throw new Error(0xFFFF, "DBJ*Loader ERROR: " + s_); },
        dbj = global.dbj || (global.dbj = {}),
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
                terror(" name: ", x, "", ", message: ", x.message);
            }
        }, time_out || 0);
    }

    dbj.loadScript = function(options, callback) {

        if (global.dbj_loader_cache[options[STR_URL]]) return;

        var script = document[STR_CREATE_ELEMENT](STR_SCRIPT), done = false;

        script[STR_ASYNC] = STR_ASYNC;
        script[STR_TYPE] = "text/javascript";

        if (options[STR_CHARSET]) {
            script[STR_CHARSET] = options[STR_CHARSET];
        }

        script.src = options[STR_URL];

        // Attach handlers for all browsers
        script[STR_ON_LOAD] = script[STR_ON_READY_STATE_CHANGE] = function() {

            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                // Handle memory leak in IE
                script[STR_ON_LOAD] = script[STR_ON_READY_STATE_CHANGE] = null;

                global.dbj_loader_cache[this.src] = true;
                log_(script.src, " Loaded");

                head.removeChild(script);

                if ("function" === typeof callback)
                // {
                //  if (global.opera)
                    delayed_call(callback);
                //else
                //  callback();
                //}
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (jQuery #2709 and #4378).
        head.insertBefore(script, head.firstChild);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var loader = function(jQuery, CFG_PATH, CFG_FILE, callback, undefined) {
        jQuery.ajaxSetup({ async: false }); // CRUCIAL!
        $.getJSON(
        CFG_PATH + CFG_FILE,
        function(data, stat) {
            // data will be a jsonObj
            // stat will be one of the following values: 
            // "timeout","error","notmodified","success","parsererror"
            // this; is the options for this ajax request
            for (var js in data) {
                if (global.dbj_loader_cache[CFG_PATH + js]) continue;
                $.getScript(CFG_PATH + js, function(data, stat) {
                    // save the status for this file
                    global.dbj_loader_cache[CFG_PATH + js] = stat;
                    log_("Loaded:", CFG_PATH, js, " :status: ", stat);
                });
            }
            log_("DONE, status: ", stat);
            if ("function" === typeof callback) {
                log_("Will be calling onready handler function");
                $(callback);
            }
        });
    };
    //
    var on_jq_ready = function() {
        jQuery(function($) {
                //
                jQuery(document.body).error(function(msg, url, line) {
                    log_("DBJ*Loader XHR Error: ", msg, "url: ", url, line); return false;
                });
                jQuery(document.body).ajaxError(function(event, xhr, settings, thrownError) {
                    log_("DBJ*Loader XHR Error requesting: ", settings.url, (thrownError ? ", message: " + thrownError.message : "")); return false;
                });

                var $cfg = jQuery("script[" + STR_CFG_ATT + "][src]");
                if ($cfg.length < 1) {
                    terror("At least one script element must have valid both src and ", STR_CFG_ATT, " attributes");
                }

                $cfg.each(function() {
                try {
                    var $this = jQuery(this),
                        CFG_FILE = $this.attr(STR_CFG_ATT),
                        CFG_PATH = $this.attr(STR_PTH_ATT), // try to use path attribute from the script element
                        path = $this.attr('src');
                    if (undefined === CFG_FILE)
                        terror(STR_CFG_ATT + " attribute is not defined?");
                    if (CFG_PATH === undefined) {
                        // make path to be the same as script src attribute path component
                        CFG_PATH = path.match(/^.*\//) ? "" + path.replace(/\\/g, "/").match(/^.*\//) : "./";
                    }
                    var defualt_onready = new Function(join(" console.log('no ready handler defined for:", CFG_PATH, CFG_FILE, "')")),
                        on_ready;
                    try {
                        on_ready = (new Function("return " + $this.attr(STR_CFG_READY)))();

                        if ("function" !== typeof on_ready) {
                            log_("User defined ready handler can not be used, because it is not a function");
                            on_ready = defualt_onready;
                        }
                    } catch (x) {
                        log_("ERROR while evaluating _ON_READY_ attribute. Default onready handler will be used.");
                        on_ready = defualt_onready;
                    }
                        loader(jQuery, CFG_PATH, CFG_FILE, on_ready);
                    } catch (x) {
                        log_("ERRROR:\n" + x.message);
                    }
                });
        });
    };
    //
    top.dbj_was_here = false;
    if (false === top.dbj_was_here) {
        top.dbj_was_here = true;
        dbj.loadScript({ "url": STR_JQUERY_URL }, on_jq_ready);
    }
})(window);
    ////////////////////////////////////////////////////////////////////////////////////////