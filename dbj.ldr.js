/// <reference path="../../jq132-vsdoc.js" />
///
/// Dynamic configurable loader.
/// Config file is one json object where keys are js files, and values will
/// be status for each file installation/download
/// Before this loader gets loaded this global var must be defined (example) :
/// var _LOADER_CFG_ = {p:"../lib/dbj/", f:"dbj.lib.json"}
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LDR.JS(tm)
///
/// $Revision: 1 $$Date: 11/01/10 16:00 $
///
/// Dependencies : jQuery 1.3.2 or higher

(function() {

    var loader = function($, LOG_METHOD) {
        var window = this, undefined, LOG_METHOD = LOG_METHOD || top.alert,
    cfg_att = "_CFG_", pth_att = "_PATH_";
        // on jQuery ready
        $(function() {
            //
            $(window).error(function(msg, url, line) {
                LOG_METHOD("Error: " + msg + String.NL + url + String.NL + line);
            });

            $(window).ajaxError(function(event, xhr, settings, thrownError) {
                LOG_METHOD("Ajax Error requesting: " + settings.url + (thrownError ? ", message: " + thrownError.message : ""));
                return false;
            });
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
                CFG_PATH = "" + path.replace(/\\/g, "/").match(/^.*\//);
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
                $.getScript(CFG_PATH + js, function(data, stat) {
                    // data should be javascript
                    // this; is the options for this ajax request
                    cfg_json[js] = stat;
                    LOG_METHOD("Loading:" + js + " :status: " + stat);
                });
            }
        });
            LOG_METHOD(JSON.stringify(cfg_json));
        });
        //
    };

    // we do this log-method-quickie here so that we do not depend on some library
    var log_ = function() {
        if (!top.window.console || !top.window.console.log) {
            $(document.body).prepend(("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + [].join.call(arguments, '') + "</ul></li>").replace(/\n/g, "<br/>"));
        } else {
            top.window.console.log([].join.call(arguments, ''));
        }
    }

    var guid = "__jquery_132_" + (+new Date());
    try {
        var tid = setInterval(function() {
            if ("undefined" !== typeof jQuery) {
                clearInterval(tid);
                log_("Loaded jQuery from : " + document.getElementById(guid).src);
                loader(jQuery, log_);
            } else {
                if (null === document.getElementById(guid)) {
                    var head = document.getElementsByTagName("head")[0];
                    var jq = document.createElement("script");
                    jq.id = guid;
                    jq.type = "text/javascript";
                    jq.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js";
                    head.appendChild(jq);
                }
            }
        }, 1);
    } catch (x) {
        log_("ERRROR:\n" + x.message);
    }

})();