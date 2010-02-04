﻿/// <reference path="../../jq132-vsdoc.js" />
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
/// $Revision: 2 $$Date: 4/02/10 17:26 $
///
/// Dependencies : jQuery 1.3.2 or higher

(function() {

    var insert_script = function(id_, data) {
        if (!data) return data;
        var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

        script.type = "text/javascript";
        script.id = id_ ? id_ + "_script" : (+new Date) + "_script";

        //if (jQuery.support.scriptEval) {
        //  script.appendChild(document.createTextNode(data));
        //} else {
        script.text = data;
        //}

        // Use insertBefore instead of appendChild to circumvent an IE6 bug.
        // This arises when a base node is used (#2709).
        head.insertBefore(script, head.firstChild);
        head.removeChild(script);
    };


    if (typeof require === "undefined") {
        var default_url = "http://dbj.org";
        // (C) WebReflection - Mit Style License
        var require = (function(context, Function) {
            var require_ = function(namespace, url) {
                url = url || default_url;
                if (!cache[namespace]) {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.send(null);
                    insert_script(namespace, xhr.responseText);
                    cache[namespace] = true;
                }
                return true;
            };
            var XMLHttpRequest = this.XMLHttpRequest || function() {
                return new ActiveXObject("Microsoft.XMLHTTP");
            };
            var cache = {};
            var hasOwnProperty = cache.hasOwnProperty;
            return require_;
        })(this, this.Function);
    }


    var cfg_att = "_CFG_", pth_att = "_PATH_";

    var loader = function(window, $, LOG_METHOD, undefined) {
        debugger;
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
            CFG_PATH =  path.match(/^.*\//) ? "" + path.replace(/\\/g, "/").match(/^.*\//) : "./" ;
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
                    LOG_METHOD("Loading:" + CFG_PATH + js + " :status: " + stat );
                });
            }
        });
        LOG_METHOD(JSON.stringify(cfg_json));
        //
    };

    // we do this log-method-quickie here so that we do not depend on some library
    var log_ = (!top.window.console || !top.window.console.log) ? function() {
        $(document.body).prepend(("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + [].join.call(arguments, '') + "</ul></li>").replace(/\n/g, "<br/>"));
    } : function() {
        top.window.console.log([].join.call(arguments, ''));
    }


    try {
        var dumsy = require("jquery", "http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js");
        // log_("Loaded jQuery from : " + document.getElementById(guid).src);
        jQuery(function() {
            //
            $(window).error(function(msg, url, line) {
                log_("Error: ", msg, "url: " + url, line);
            });

            $(window).ajaxError(function(event, xhr, settings, thrownError) {
                log_("Ajax Error requesting: " + settings.url + (thrownError ? ", message: " + thrownError.message : ""));
                return false;
            });
            loader(window, jQuery, log_);
        });
    } catch (x) {
        log_("ERRROR:\n" + x.message);
    }

})();