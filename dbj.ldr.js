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
/// $Revision: 7 $$Date: 12/02/10 14:40 $
///
/// Dependencies : jQuery 1.3.2 or higher
(function(global, undefined) {

    if (global.dbj_loader_cache === undefined) {
        global.dbj_loader_cache = {};
    }

    // we do this log-method-quickie here so that we do not depend on some library
    var log_ = (!global.console || !global.console.log) ? function() {
        document.body.innerHTML += ("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + [].join.call(arguments, '') + "</ul></li>").replace(/\n/g, "<br/>");
    } : function() {
        global.console.log([].join.call(arguments, ''));
    };

    var dbj = global.dbj || (global.dbj = {}),
        STR_JQUERY_URL = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js",
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
    function delayed_call(func, self) {
        var tid = setTimeout(function() {
            clearTimeout(tid); delete tid;
            func[STR_APPLY](self || global, slice[STR_CALL](arguments, 2));
        }, 0);
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

                if ("function" === typeof callback) {
                    if (global.opera)
                        delayed_call(callback);
                    else
                        callback();
                }
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
            callback();
            log_("DONE, status: ", stat);
        });
    };

    try {
        dbj.loadScript({ "url": STR_JQUERY_URL },
        function() {
            //
            jQuery(document).error(function(msg, url, line) {
                log_("DBJ*Loader Error: ", msg, "url: " + url, line); return false;
            });
            jQuery(document).ajaxError(function(event, xhr, settings, thrownError) {
                log_("DBJ*Loader Ajax Error requesting: " + settings.url + (thrownError ? ", message: " + thrownError.message : "")); return false;
            });

            var $cfg = jQuery("script[" + STR_CFG_ATT + "][src]");
            if ($cfg.length < 1) {
                throw new Error(0xFF, "At least one script element must have valid both src and " + STR_CFG_ATT + " attributes");
            }


            $cfg.each(function() {
                var $this = jQuery(this),
                CFG_FILE = $this.attr(STR_CFG_ATT);
                if (undefined === typeof CFG_FILE)
                    throw new Error(0xFF, STR_CFG_ATT + " attribute is not defined?");
                var CFG_PATH = $this.attr(STR_PTH_ATT); // try to use path attribute from the script element
                if (CFG_PATH === undefined) {
                    // make path to be the same as script src attribute path component
                    var path = $this.attr('src');
                    CFG_PATH = path.match(/^.*\//) ? "" + path.replace(/\\/g, "/").match(/^.*\//) : "./";
                }
                var ready_handler = new Function( "return " + ($this.attr(STR_CFG_READY) || " log_('no ready handler defined')" )) ;

                loader(jQuery, CFG_PATH, CFG_FILE, ready_handler );

            });
        });
    } catch (x) {
        log_("ERRROR:\n" + x.message);
        document.writeln(x + "\n\n" + x.message + "\n\nDBJ*Loader has failed, there is no point of going further");
    }


})(window || {});
    ////////////////////////////////////////////////////////////////////////////////////////