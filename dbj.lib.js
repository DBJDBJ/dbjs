﻿/// <reference path="../../jq132-vsdoc.js" />
///
/// DBJ: "Infinitely well organized information leads to infinitely fragmented storage
/// of the same information. That is the attribute of our universe.
/// Goedels theorem is one proof."
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 24 $$Date: 9/03/10 18:19 $
///
/// Dependencies : none
(function(global, undefined) {
    //
    var  
    TOS = Object.prototype.toString,
    HOP = Object.prototype.hasOwnProperty,
    SLC = Array.prototype.slice,
    JON = Array.prototype.join,
    STT = window.setTimeout,
    CTT = window.clearTimeout;
    //
    var local = {
        "delay": function(func, self, time_out) {
            var tid = STT(function() {
                CTT(tid); delete tid;
                func.apply(self || global, SLC.call(arguments, 2));
            }, time_out || 0);
        },
        "isMSFT": (/*@cc_on!@*/false),
        "in_a_browser": "undefined" === typeof WScript,
        "string_indexing": "ABC"[0] === "A",
        "alert_": (function(browser_host) {
            return browser_host ? function(m_) { var tid = STT(function() { CTT(tid); global.alert("" + m_); }, 1); }
        : function(m_) { WScript.Echo("" + m_); }
        })("undefined" === typeof WScript),
        "konsole": {
            "cons": (function(browser_host) {
                return browser_host && global.console
                       ? global.console : { log: this.alert_, warn: this.alert_, error: this.alert_, group: this.empty, groupEnd: this.empty };
            })("undefined" === typeof WScript),
            bg: function(m_) { this.cons.group(m_ || "DBJ"); return this; },
            eg: function() { this.cons.groupEnd(); return this; },
            log: function(m_) { this.bg(); this.cons.log(m_ || "::"); this.eg(); return this; },
            warn: function(m_) { this.bg(); this.cons.warn(m_ || "::"); this.eg(); return this; },
            error: function(m_) { this.bg(); this.cons.error(m_ || "::"); this.eg(); return this; },
            terror: function(m_) { this.error(m_); throw "DBJS*ERROR! " + m_; return this; },
            not_implemented: function() { this.terror(" not implemented yet"); }
        }
    }; // local
    /// The DBJ library namespace.
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


        dbj.extend({
      "later": function(func, timeout) {
                /* execute a function bit latter, default timeout is 1 sec */
                var tid = setTimeout(function() {
                    clearTimeout(tid); tid = null; delete tid;
                    func.apply(this || top, [].slice.call(arguments, 2));
                }, timeout || 1000);
            },
        "konsole": local.konsole,
        "toString": function() { return "DBJ*JSFM(tm) " + this.version + " $Date: 9/03/10 18:19 $"; },
        "version": "1." + "$Revision: 24 $".match(/\d+/),
        "empty": function() { },
        // feature checks , specific for DBJS 
        "ftr": {
            "isMSFT": local.isMSFT,
            "in_a_browser": local.in_a_browser,
            "string_indexing": local.string_indexing
        }, // ftr
        "browser": { "support": { "orphan_css": true} },
        "decode": function(s, en) {
            // Encodes the basic 4 characters used to malform HTML in XSS hacks
            if ("String" === dbj.roleof(s) && s.length > 1) {
                en = en || true;
                // do we convert to numerical or html entity?
                if (en) {
                    s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                    s = s.replace(/\"/g, "&quot;");
                    s = s.replace(/</g, "&lt;");
                    s = s.replace(/>/g, "&gt;");
                } else {
                    s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                    s = s.replace(/\"/g, "&#34;");
                    s = s.replace(/</g, "&#60;");
                    s = s.replace(/>/g, "&#62;");
                }
                return s;
            } else {
                return "";
            }
        },
        "uid": function(uid_) {
            /* unique identifier generator, made of dbj.prefix and the timer id. */
            return this.prefix + (uid_ = global.setTimeout(function() { global.clearTimeout(uid_) }, 0));
        },
        "prefix": "dbj",
        "now": function() { /* In a getTime format */return +(new Date()); },
        "create": function(o) {
            ///<summary>
            /// inspired by: http://javascript.crockford.com/prototypal.html
            /// This 'works' for all cases.
            /// dbj.create({}) returns new object inherited from object argument
            /// dbj.create([]) returns new array  inhertied from array  argument
            /// all "illegal" calls returns object that has empty object as a parent
            ///</summary>
            function F() { }; F.prototype = o || {};
            return new F();
        },
        "json": {
            ok_string: (function() {
                var rx0 = /^[\],:{}\s]*$/,
                rx1 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                rx2 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                rx3 = /(?:^|:|,)(?:\s*\[)+/g;
                return function(data) {
                    return rx0.test(data.replace(rx1, "@").replace(rx2, "]").replace(rx3, ""));
                }
            } ())
        },
        "xml": {
            /// <summary>
            /// cross browser xml doc creation 
            /// </summary>
            "doc": (global.ActiveXObject === undefined) ?
                function() { return document.implementation.createDocument("", "", null); }
            :
                function() { return new global.ActiveXObject("MSXML2.DOMDocument"); }
        },
        "cond": function(v) {
            ///<summary>
            /// in javascript switch statement can not act as an rvalue
            /// so one can use the following dbj.cond() :
            /// dbj.cond() returns the value if x matches the case
            /// arguments case and value must be in pairs
            /// the last argument (if given) is the default value
            ///<code>
            /// dbj.cond( input, case1, value1, case2, value2, ..... , value_for_default )
            ///</code>
            /// example :
            ///<code>
            /// dbj.cond(2, 1, "blue", 2, "red", /*default is*/"green");
            ///</code>
            /// returns "red"
            ///</summary>
            var j = 1, L = arguments.length;
            ///allow users to change the condition operator used to match the value given
            ///default condition is 'equality', aka 'exact match'
            ///this method must return true or false
            for (; j < L; j += 2) {
                if (this.cond_condition(v, arguments[j])) return arguments[j + 1];
            }
            return (!arguments[j - 2]) ? undefined : arguments[j - 2];
        },
        "cond_condition": function(a, b) { return a === b; },
        /*
        return undefined on any object that is not "object" or "function"
        also ignore the possible prototype chain
        */
        "isEmpty": function(object) {
            if (typeof object !== 'object' && typeof object !== 'function') return;
            for (var name in object) {
                if (HOP.call(object, name)) {
                    return false;
                }
            }
            return true;
        },
        "isNative": (function() {
            var function_signature = function(f) {
                // signature of a method through string decomposition
                // returns: [ <method name> , <method body with '~' instead of name>]
                // DBJ.ORG 2009-2010
                var name = (f + "").match(/\w+/g)[1]; // name
                return [name, (f + "").replace(name, "~")]; // signature
            }, native_signature = function_signature(Function);
            return function(f) {
                if (!local.isMSFT && "function" !== typeof f) return; // undefined on bad argument
                // we can do this test only for non-msft hosts since in an IE window.alert() is object
                try {
                    var sig = function_signature(f); // make name,signature pair
                    return sig[1] === native_signature[1]; // compare the signatures
                } catch (x) {
                    return false;
                }
            }
        })()

    }); // eof dbj.extend() call

    //-----------------------------------------------------------------------------------------------------
    if (dbj.ftr.in_a_browser) // in a browser
    {
        // CSS properties on new elements still not attached to the document
        // check if CSS properties get/set is supported on newly created but still detached elements
        // check only for W3C compliant browsers
        if (typeof global.getComputedStyle === "function") {
            var btn = document.createElement("button");
            btn.style.color = "red";
            dbj.browser.support.orphan_css = ("" !== global.getComputedStyle(btn, null).getPropertyValue("color"));
            delete btn;
        }

        /*
        IMPORTANT: FireFox has a problem with nested closures
        */

        if ("object" === typeof window.JSON)
            try {
            JSON.parse("{ a : 1 }");
            dbj.json.nonstandard = true;
        } catch (x) {
            dbj.json.nonstandard = false;
        }

        // non-standard JSON stops here
        dbj.json.parse =
     (global.JSON && ("function" === typeof global.JSON.parse)) ?
           dbj.json.nonstandard ?
             function json_parse(data) {
                 if (!dbj.json.ok_string(data)) dbj.konsole.terror("Bad JSON string.");
                 return global.JSON.parse(data);
             }
          : // else 
             function json_parse(data) {
                 return global.JSON.parse(data);
             }
    : // else 
    function json_parse(data) {
        if (!dbj.json.ok_string(data)) dbj.konsole.terror("Bad JSON string.");
        return (new Function("return " + data))();
    }
    } // if in_a_browser
    //-----------------------------------------------------------------------------------------------------
    dbj["date"] = { "diff": function(date1, date2) {
        ///<summary>
        ///timespan of the difference of first date and second date
        ///returns: '{ "date1": date1, "date2": date2, "weeks": weeks, "days": days, "hours": hours, "mins": "mins", "secs": secs, "approx_years": years }'
        ///</summary>
        ///<returns type="object" />
        var diff = new Date();
        diff.setTime(Math.abs(date1.getTime() - date2.getTime()));
        var timediff = diff.getTime();
        var weeks = Math.floor(timediff / (1000 * 60 * 60 * 24 * 7));
        timediff -= weeks * (1000 * 60 * 60 * 24 * 7);
        var days = Math.floor(timediff / (1000 * 60 * 60 * 24));
        timediff -= days * (1000 * 60 * 60 * 24);
        var hours = Math.floor(timediff / (1000 * 60 * 60));
        timediff -= hours * (1000 * 60 * 60);
        var mins = Math.floor(timediff / (1000 * 60));
        timediff -= mins * (1000 * 60);
        var secs = Math.floor(timediff / 1000);
        timediff -= secs * 1000;
        var years = parseInt(weeks / 52);
        return { "date1": date1.getTime(), "date2": date2.getTime(), "weeks": weeks, "days": days, "hours": hours, "mins": "mins", "secs": secs, "approx_years": years };
    }
    }


})(this);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function(tos) {
var fs_ = tos.call(function() { }),  /* function signature */
    os_ = tos.call({});              /* object signature */
    dbj.isFunction = ("function" === (typeof window.open)) ? function(f) {
        ///<summary>
        /// isFunction V.5
        /// does not handle properly only one case and only in IE
        /// var singularity = { toString: undefined, valueOf : function(){return "function";}}
        ///</summary>
        return fs_ === tos.call(f);
    } :
    function(f) {
        // IE version is less trivial since in IE dom and browser methods are of a type "object"
        // "object" === typeof window.alert
        try {
            return /\bfunction\b/.test(f);
        } catch (x) {
            return false;
        }
    };

    dbj.isObject = ("function" === (typeof window.open)) ? function(x) {
        return (os_ === tos.call(x));
    } : function(x) {
        // In IE we have to take care of the dom and browser objects being of a
        // "object" type. So we have to check first (in IE only) dbj.isFunction(x)
        if (dbj.isFunction(x)) return false;
        return (os_ === tos.call(x));
    };

})(Object.prototype.toString);
//--------------------------------------------------------------------------------------------
// synchronous and asynchronous function callers
(function() {
    // arguments to array
    function a2a(A, start_index) {
        A = A || a2a.caller.arguments;
        return Array.prototype.slice.call(A, start_index || 0)
    };
    // synchro caller
    // function F () { alert( a2a() ); }
    // var retval = callA(F,1,2,3)
    dbj.sync = function(cb) {
        if ("function" !== typeof cb) dbj.konsole.terror("dbj.callS() first argument must be a function.");
        var args = a2a(arguments, 1);
        return cb.apply(this, args);
    }
    /*
    asynchronous caller
    function F () { alert( a2a() ); }
    callA(F,1,2,3)
    obviously there is no return value, use: dbj.async.retval 
    */
    dbj.async = function(cb) {
        var self = this, args = arguments, tid = window.setTimeout(function() {
            window.clearInterval(tid); tid = null; delete tid;
            dbj.async.retval = dbj.sync.apply(self, args);
        }, dbj.async.microseconds);
    }
    dbj.async.microseconds = 100;
    dbj.async.retval = undefined;
})();

//-----------------------------------------------------------------------------
// String additions
//-----------------------------------------------------------------------------
(function(undefined) {

    var STR_PAD_LEFT = 1, STR_PAD_RIGHT = 2, STR_PAD_BOTH = 3;

    function pad(str, opt) {

        var len = opt.len || 0, pad = opt.pad || ' ', dir = opt.dir || STR_PAD_RIGHT;

        if (len < str.length) return str;

        return dbj.cond(dir,
                STR_PAD_LEFT,
                function() {
                    return Array(len + 1 - str.length).join(pad) + str;
                },
                STR_PAD_BOTH,
                function() {
                    var right = Math.ceil((padlen = len - str.length) / 2);
                    var left = padlen - right;
                    return Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                },
        /* default is STR_PAD_RIGHT */
                function() {
                    return str + Array(len + 1 - str.length).join(pad);
                }
         )();
    }

    // System-wide string constants
    String.empty = "";
    String.space = " ";
    String.F = "function";
    String.U = "undefined";
    String.O = "object";
    String.S = "string";
    String.N = "number";
    String.NL = "\n";
    //@cc_on String.NL = "\r\n";
    String.T = "\t";
    String.R = "\r";

    if (String.F !== typeof "".minus)
        String.prototype.minus = function(what_) {
            ///<summary>
            /// "ABCBDBEB".minus("B"), returns : "ACDE"
            /// Argument is optional, and by default is one empty space
            /// So: "A B C".minus(), returns "ABC"
            /// argument can be an regular expression
            /// reg.exp. given does not require 'g' or 'm' modifier
            /// if argument is not found in the original, the original is returned
            ///</summary>
            return (this.split(what_ || String.space)).join(String.empty);
        }

    if ("function" !== typeof "".trim) {
        ///<summary>
        // String.trim() ES5
        /// due to the bug in IE where "\u00A0" is not covered by \s
        /// we have to explicitly add it to the regexp
        ///</summary>
        var Ltrim = /^[\s\u00A0]+/, Rtrim = /[\s\u00A0]+$/ ;
        String.prototype.trim = function() {
            return this.replace(Ltrim, String.empty).replace(Rtrim, String.empty );
        }
    }

    if (String.F !== typeof "".reverse)
        String.prototype.reverse = function() {
            ///<summary>
            ///String.reverse() not in ECMA5
            ///</summary>
            return this.split(String.empty).reverse().join(String.empty);
        }
    if (String.F !== typeof "".lpad)
        String.prototype.lpad = function(max_, pad_char) {
            ///<summary>
            /// left-pad n, max_ times with the c character
            /// if user defined pad char is not given, single space is default
            ///</summary>
            return pad(this, { len: max_, pad: pad_char, dir: STR_PAD_LEFT });
        }
    if (String.F !== typeof "".rpad)
        String.prototype.rpad = function(max_, pad_char) {
            ///<summary>
            /// right-pad n, max_ times with the c character
            /// if user defined pad char is not given, single space is default
            ///</summary>
            return pad(this, { len: max_, pad: pad_char, dir: STR_PAD_RIGHT });
        }
    // center pad
    if (String.F !== typeof "".cpad)
        String.prototype.cpad = function(max_, pad_char) {
            ///<summary>
            /// center-pad n, max_ times with the c character
            /// if user defined pad char is not given, single space is default
            ///</summary>
            return pad(this, { len: max_, pad: pad_char, dir: STR_PAD_BOTH });
        }
    if (String.F !== typeof "".lcut)
        String.prototype.lcut = function(l, c) {
            ///<summary>
            /// cut from left to size l. pad on left if smaller
            ///</summary>
    return this.length < l ? this.lpad(l, c) : this.slice(this.length - l);
        }
    if (String.F !== typeof "".rcut)
        String.prototype.rcut = function(l, c) {
            ///<summary>
            ///cut from right to size l. pad on right if smaller
            ///</summary>
    return this.length < l ? this.rpad(l, c) : this.substr(0, l);
        }

    if (String.F !== typeof "".wrap)
        String.prototype.wrap = function(l, r) {
            ///<summary>
            ///Wrap with l-eft and r-ight.
            ///Both are optional.
            ///</summary>
            return (l || String.empty) + this + (r || String.empty);
        }

    if (String.F != typeof String.has)
        String.prototype.has = function(c) { return this.indexOf(c) > -1; };
    ///<summary>
    ///return true if char c found in this string
    ///signals only the first instance found
    ///</summary>

    //
    // .net string.format like function
    // usage:   "{0} means 'zero'".format("nula") 
    // returns: "nula means 'zero'"
    // place holders must be in a range 0-99.
    // if no argument given for the placeholder, 
    // no replacement will be done, so
    // "oops {99}".format("!")
    // returns the input
    // same placeholders will be all replaced 
    // with the same argument :
    // "oops {0}{0}".format("!","?")
    // returns "oops !!"
    //
    if (String.F != typeof String.format)
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/\{(\d|\d\d)\}/g, function($0) {
                var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
            }
     );
        }


})();


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
(function(tos, window, undefined ) {
    dbj.classof = function(o) {
    ///<summary>
    /// as far as I know this works properly everywhere but in IE
    /// 'even' for the likes of top.alert()
    ///</summary>
    return tos.call(o);
    }

    /*@cc_on
    @if (1==1)
    // IE only version, overwrites the previous version
    var rxo = /\bObject\b/, rxf = /\bfunction\b/,
    u = tos.call(undefined),
    n = tos.call(null);

    dbj.classof = function(o) {
    ///<summary>
    /// The controversial type alert === "object", in IE has born the
    /// following controversial classof() function
    /// it is based on object decomposition, so it might not work in some browsers
    /// although there is a very smal probability of that
    ///</summary>
    if (o === undefined) return u;
        if (o === null) return n;
        var descriptor = tos.call(o);
        try {
            // non-objects are properly described in IE 
            if (!rxo.test(descriptor))
                return descriptor;
            // decompose objects
            var ret = (o + "").match(/\w+/g);
            return rxf.test(ret[0]) ? "[object Function]" : "[" + ret[0] + " " + ret[1] + "]";
        } catch (x) {
            // illegal object literals can provoke decomposition exception
            return descriptor;
        }
    }
    @end
    @*/
})(Object.prototype.toString, window );

//-----------------------------------------------------------------------------
//
(function() {
///<summary>
///usefull regular expressions
///</summary>
/*
The following table lists frequently used special characters and their Unicode value.

Category	        Unicode value	        Name	Format name
White space values	
                    \u0009	Tab	            <TAB>
 	                \u000B	Vertical Tab	<VT>
 	                \u000C	Form Feed	    <FF>
 	                \u0020	Space	        <SP>
Line terminator values	
                    \u000A	Line Feed	    <LF>
 	                \u000D	Carriage Return	<CR>
Additional Unicode escape sequence values	
                    \u0008	Backspace	    <BS>
 	                \u0009	Horizontal Tab	<HT>
 	                \u0022	Double Quote	 "
 	                \u0027	Single Quote	'
 	                \u005C	Backslash	\
*/
dbj.rx = {
catch_all: [
///<summary>
///catch-all regular expressions
///</summary>
       (new RegExp).compile(".|\\n+", "mg"),
///<summary>
///this one is apparently correct and slow
///</summary>
       (new RegExp).compile("[\\w\\W].*?", "mg")
///<summary>
///this one is apparently unbelievably fast, and correct
///</summary>
       ],
c_style_comments : (new RegExp).compile("(\\/\\*)(.*?)(\\*\\/)","mg"),
///<summary>
/// match /* */ comments
///</summary>
slashslash_comments : (new RegExp).compile("(\\/\\/)(.*?)($)","mg"),
///<summary>
/// match // comments
///</summary>
source_junk: (new RegExp).compile("\\t+|\\s*","mg"),
///<summary>
/// match \t, and \s , but NOT \n or \r !
///</summary>
new_line: (new RegExp).compile("\\n+|\\r+","mg")
///<summary>
/// match ONLY \n or \r
///</summary>
}

})();


//-------------------------------------------------------------------------------------------------------
(function() {
    ///<summary>
    ///Terminology is important. W3C term "Class" is unfortunately selected. 
    ///There is no OO Class in JavaScript. It is a prototype based language.
    ///Therefore, I will use the term: "role" instead of "class", to name JavaScript types. 
    ///Object.prototype.toString.call(o) returns what W3C call "Class".
    ///I shall call it:"type descriptor"
    ///It's format I shall define as :  "[ object " + <role name> + "]"
    ///Example:  "[object Error]"
    ///"role names" are in essence names of all javascript global objects
    ///This will help us understand what is the type name and what is the role.
    ///Example: [] is an "object" whose role is to be an "Array".
    ///There is no "roleof" operator in javascript. I shall be so bold 
    ///to implement the closest approximation to it.
    ///I shall encapsulate the implementation in one global object.
    /// Note: There are 3 kinds of objects: JavaScript, Browser and DOM objects
    ///</summary>
    var globals = [
	        new Array, new Boolean, new Date, new Error, new Function, Math,
	        new Number, new Object, new RegExp, new String
       ];
    if ("object" === typeof Arguments) // ECMA5 Arguments object
        globals[globals.length] = Arguments;

    if ("object" === typeof JSON) // add JSON if exist as inbuilt object
        globals[globals.length] = JSON;

    dbj.role = {
        name: function(o) {
            ///<summary>
            /// NOTE: for DOM objects function bellow will return "object"
            ///       in IE. example: window.alert returns "object"
            ///</summary>
            return Object.prototype.toString.call(o).match(/\w+/g)[1];
        },
        names: {
        ///<summary>
        /// distinctive role names, and their unique role id's
        /// { "Array" : 0, ... }
        ///</summary>
    }
};
// 
window.roleof = dbj.roleof = dbj.role.name ;
//
/// generate dbj.role.names object, with distinctive role names
/// and their type ID's
var name_ = "";
for (var j = 0; j < globals.length; j++) {
    name_ = dbj.role.name(globals[j]);
    dbj.role.names[name_] = j;
};

/// generate dbj.role.is<role name>() checks
/// we compare role id's bellow, not names
/// so we compare numbers, not strings
for (var j in dbj.role.names) {
    dbj.role["is" + j] = Function(
              "o",
              "return dbj.role.names[dbj.role.name(o)] === dbj.role.names['" + j + "'];");
};
})();

//-----------------------------------------------------------------------------------------------------
(function() {
    var empty = "00000000-0000-0000-0000-000000000000",
        four = function() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase(); },
    // 'fake' GUID for browser hosts
        make = function() {
            return (four() +
             four() + "-" + four() + "-" + four() + "-" + four() + "-" + four() + four() + four());
        };

    if (! dbj.ftr.in_a_browser) {
        var x_ = null;
        dbj.GUID = function(empty_) {
        //   This will work outside of browsers only
        try {
        x_ = x_ || new ActiveXObject("Scriptlet.TypeLib");
        return empty_ ? empty : (x_.GUID);
        }
        catch (e) {
        dbj.konsole.warn("error creating dbj.GUID : " + e.message);
        return empty_ ? empty : make();
        }
        }
    }
    else {
        dbj.GUID = function(null_) { return null_ ? empty : make(); }
    }

})();
///<reference path="dbj.lib.js" />