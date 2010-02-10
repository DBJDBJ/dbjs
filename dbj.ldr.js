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
/// $Revision: 5 $$Date: 10/02/10 12:09 $
///
/// Dependencies : jQuery 1.3.2 or higher
    (function(undefined) {

        // we do this log-method-quickie here so that we do not depend on some library
        var log_ = (!top.window.console || !top.window.console.log) ? function() {
            document.body.innerHTML += ("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + [].join.call(arguments, '') + "</ul></li>").replace(/\n/g, "<br/>");
        } : function() {
            top.window.console.log([].join.call(arguments, ''));
        };

        var dbj = window.dbj || (window.dbj = {});
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
	            loadedCompleteRegExp = /loaded|complete/,
	            slice = [].slice,
	            head = document[STR_GET_ELEMENTS_BY_TAG_NAME]("head")[0] || document.documentElement;

        // Defer execution just enough for all browsers (especially Opera!)
        function later(func, self) {
            var tid = setTimeout(function() {
                clearTimeout(tid); delete tid;
                func[STR_APPLY](self || window, slice[STR_CALL](arguments, 2));
            }, 0);
        }

        dbj.loadScript = function(options, callback) {

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

                    log_(script.src, " Loaded");

                    head.removeChild(script);

                    if ("function" === typeof callback) {
                        if (window.opera)
                            later(callback);
                        else
                            callback();
                    }
                }
            };
            // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
            // This arises when a base node is used (jQuery #2709 and #4378).
            head.insertBefore(script, head.firstChild);
        };

        dbj.loadStyleSheet = function(options, callback) {

            var link = document[STR_CREATE_ELEMENT]("link"),
			title = options.title || "";

            link.rel = "stylesheet";
            link.type = "text/css";
            link.media = options.media || "screen";
            link[STR_HREF] = options[STR_URL];

            if (options[STR_CHARSET]) {
                link[STR_CHARSET] = options[STR_CHARSET];
            }

            // Attach handlers for all browsers
            link[STR_ON_LOAD] = link[STR_ON_READY_STATE_CHANGE] = function() {

                if (!(readyState = link[STR_READY_STATE]) || loadedCompleteRegExp.test(readyState)) {

                    // Handle memory leak in IE
                    link[STR_ON_LOAD] = link[STR_ON_READY_STATE_CHANGE] = null;

                    log_(link.href, " Loaded");

                    if ("function" === typeof callback) {
                        if (window.opera)
                            later(callback);
                        else
                            callback();
                    }
                }
            };
            // Add it to the doc
            head.appendChild(link);
        };

    var cfg_att = "_CFG_", pth_att = "_PATH_", loaded_signal = "LOADED",
    loader = function(window, $, LOG_METHOD, callback, undefined) {
        $cfg = $("script[" + cfg_att + "][src]");
        if ($cfg.length < 1) {
            throw new Error(0xFF, "At least one script element must have valid both src and " + cfg_att + " attributes");
        }
        var CFG_FILE = $cfg.attr(cfg_att);
        if (undefined === typeof CFG_FILE)
            throw new Error(0xFF, cfg_att + " attribute is not defined?");
        var CFG_PATH = $cfg.attr(pth_att);
        if (CFG_PATH === undefined) {
            // make path to be the same as script src attribute path component
            var path = $cfg.attr('src');
            CFG_PATH = path.match(/^.*\//) ? "" + path.replace(/\\/g, "/").match(/^.*\//) : "./";
        }
        var cfg_json = {};
        jQuery.ajaxSetup({ async: false }); // CRUCIAL!
        $.getJSON(
        CFG_PATH + CFG_FILE,
        function(data, stat) {
            // data will be a jsonObj
            // stat will be one of the following values: 
            // "timeout","error","notmodified","success","parsererror"
            // this; is the options for this ajax request
            cfg_json = data;
            for (var js in cfg_json) {
                if (js === loaded_signal) {
                    callback();
                        LOG_METHOD("DONE, status: " + stat );
                } else
                    $.getScript(CFG_PATH + js, function(data, stat) {
                        // save the status for this file
                        cfg_json[js] = stat;
                        LOG_METHOD("Loaded:" + CFG_PATH + js + " :status: " + stat );
                    });
            }
        });
    };

        try {
            dbj.loadScript({ "url": "http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js" },
        function() {
            //
            $(document.body).error(function(msg, url, line) {
                log_("DBJ*Loader Error: ", msg, "url: " + url, line);
                return false;
            });

            $(document.body).ajaxError(function(event, xhr, settings, thrownError) {
                log_("DBJ*Loader Ajax Error requesting: " + settings.url + (thrownError ? ", message: " + thrownError.message : ""));
                return false;
            });
            loader(window, jQuery, log_, dbj.loaded || function() { });
        });
        } catch (x) {
            log_("ERRROR:\n" + x.message);
        }

    })();