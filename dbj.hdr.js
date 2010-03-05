
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.HDR.JS(tm)
///
/// Standard javascript intro into my development and testing pages
///
/// $Revision: 2 $$Date: 5/03/10 16:31 $
///
(function() {

    window.dbj || (window.dbj = {});

    if ("function" !== typeof dbj.extend)
        dbj.extend = function() {
            var options, src, copy;
            for (var i = 0, length = arguments.length; i < length; i++) {
                if (!(options = arguments[i])) continue;

                for (var name in options) {
                    copy = options[name];
                    // Prevent never-ending loop
                    if (dbj === copy) continue;
                    // Don't bring in undefined values
                    if (copy !== undefined) dbj[name] = copy;
                }
            }
            return dbj;
        };

    dbj.extend(
        {
            later: function(func, timeout) {
                /* execute a function bit latter, default timeout is 1 sec */
                var tid = setTimeout(function() {
                    clearTimeout(tid); tid = null; delete tid;
                    func.apply(this || top, [].slice.call(arguments, 2));
                }, timeout || 1000);
            }
    , summa: (function() {
        /* help summarizing or averaging values saved in this cache of named arrays of numerical values 
        internal obj_ is object where each property is an array
        */
        var obj_ = {},
    sum_ = function(arr) { var l = arr.length, sum = 0; while (l--) { sum += arr[l]; }; return sum; },
    avg_ = function(arr) { return sum_(arr) / arr.length; };

        return {
            /* interface */
            add: function(k, v) {
                v = v - 0;
                if (!isArray(obj_[k]))
                    obj_[k] = [v];
                else
                    obj_[k].push(v);
                return v;
            },
            sum: function(k) { return sum_(obj_[k] || []); },
            avg: function(k) { return avg_(obj_[k]); },
            all: function(k) { return obj_[k] || [] }
        };
    } ()),
            harvester: function(frm_id, defaults) {
                /*
                use this function to harvest form values on inputs named in its "defaults" argument
                example call :
                var harvest = harvester("myForm", { "name" : "Default", "age" : 22, "sex" : "male" } );
                look for inputs name, age and sex in the form "myForm". if input value is null use the
                values given in the argument.
                */
            var $frm = jQuery("#" + frm_id, document.object), $input, 
                getval = function(id_) {
                        $input = $frm.find("input#" + id_);
                        return ($input.val() || defaults[id_]);
                };
                for (name in defaults) { defaults[name] = getval(name); }
                return defaults;
            },
            round: function(original_number, decimals) {
            /* quick number rounder */
                var V1 = original_number * Math.pow(10, decimals), V2 = Math.round(V1);
                return V2 / Math.pow(10, decimals);
            },
            crazyLoader: function() {
            /* just slap the script tag in the page wherever that might be */
                for (var i = 0, L = arguments.length; i < L; i++) {
                    document.write("<script type='text/javascript' src='" + arguments[i] + "' ></" + "script>");
                }
            }, try_n_times: function(callback, times_, delay_) {
                /*
                try N times with delay between, break if callback returns ! false
                defualts:    no of times : 10     uSec between times : 1 
                */
                var tid, times = times_ || 10, delay = delay_ || 1;
                function _internal() {
                    if (tid) clearInterval(tid); tid = null;
                    if ((times_--) < 1) {
                        return;
                    }
                    if (false === callback()) {
                        return tid = setInterval(_internal, delay);
                    }
                    return;
                }
                return _internal();
            }
        });

    /// depends on : http://dbj.org/4/fblight
    if (!window.console) {
        document.write(
            '<link href="http://dbj.org/4/fblight/fbl.css" rel="stylesheet" type="text/css" />' +
            '<script src="http://dbj.org/4/fblight/fbl.js" type="text/javascript"><' + '/script>'
        );

        dbj.try_n_times(function() {
            if (!window.firebug) {
                return false; // proceed trying
            }
            firebug.env.debug = false;
            firebug.env.detectFirebug = true;
            return true; // break and stop
        });
    }

    /*
    if (!window.firebug) {
    var tid,
    init_firebug = function() {
    if (tid) { clearTimeout(tid); tid = null; }
    if (!window.firebug) {
    return tid = setTimeout(init_firebug, 100);
    }
    firebug.env.debug = false;
    firebug.env.detectFirebug = true;
    };
    init_firebug();
    }
    */



    if ("object" !== typeof window.jQuery)
    { dbj.crazyLoader("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"); }

    if ("object" !== typeof window.JSON)
    { dbj.crazyLoader('http://dbj.org/4/json2.js'); }


} ());