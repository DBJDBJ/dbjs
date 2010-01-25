/// <reference path="../../jq132-vsdoc.js" />
///
/// DBJ: "Infinitely well organized information leads to infinitely fragmented storage
/// of the same information. That is the attribute of our universe.
/// Goedels theorem is one proof."
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 8 $$Date: 25/01/10 13:24 $
///
/// Dependencies : jQuery 1.3.2 or higher
(function($, window, undefined) {
/// <summary>
/// The DBJ library namespace.
/// dbj = top.dbj
/// </summary>

    var 
    // Map over dbj in case of overwrite
	_dbj = dbj = top.dbj = window.dbj = { toString: function() { return "DBJ*JSLib(tm) " + dbj.version + " $Date: 25/01/10 13:24 $"; } };
    dbj.version = "1." + "$Revision: 8 $".match(/\d+/)
    empty = function() { };

    // Dean Edwards obfuscated example : isMSIE = eval("false;/*@cc_on@if(@\x5fwin32)isMSIE=true@end@*/");
    // DBJ simple solution
    dbj.isMSIE = false;
    //@cc_on    dbj.isMSIE = true;

    //-----------------------------------------------------------------------------------------------------
    var w_stat = function ( m_ ) { if ( window ) window.status = m_ ; }
    dbj.konsole = {
    cons: !!window.console ? window.console : { log: w_stat, warn: w_stat, error: w_stat, group: empty , groupEnd: empty  },
        bg: function(m_) { this.cons.group(m_ || "DBJ"); return this; },
        eg: function() { this.cons.groupEnd(); return this; },
        log: function(m_) { this.bg(); this.cons.log(m_ || "::"); this.eg(); return this; },
        warn: function(m_) { this.bg(); this.cons.warn(m_ || "::"); this.eg(); return this; },
        error: function(m_) { this.bg(); this.cons.error(m_ || "::"); this.eg(); return this; },
        terror: function(m_) { this.error(m_); throw "DBJS*Lib ERROR! " + m_; return this; }
    };


    dbj.create = function(o) {
        ///<summary>
        /// inspired by: http://javascript.crockford.com/prototypal.html
        /// This 'works' for all cases.
        /// dbj.create({}) returns new object inherited from object argument
        /// dbj.create([]) returns new array  inhertied from array  argument
        /// all "illegal" calls returns object that has empty object as a parent
        ///</summary>
        function F() { }; F.prototype = o || {};
        return new F();
    };

    //-------------------------------------------------------------------------------------
    dbj.json = {};
    var         rx0 = /^[\],:{}\s]*$/,
                rx1 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                rx2 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                rx3 = /(?:^|:|,)(?:\s*\[)+/g;
    dbj.json.ok_string = function(data) {
        return rx0.test(data.replace(rx1, "@").replace(rx2, "]").replace(rx3, ""));
    }

    dbj.json.nonstandard = function() {
        try { JSON.parse("{ a : 1 }"); return true; } catch (x) { return false; }
    } ();

    // non-standard JSON stops here
    dbj.json.parse =
 (window.JSON && ("function" === typeof window.JSON.parse)) ?
       dbj.json.nonstandard ?
         function json_parse(data) {
             if (!dbj.json.ok_string(data)) dbj.konsole.terror("Bad JSON string.");
             return window.JSON.parse(data);
         }
      : // else 
         function json_parse(data) {
             return window.JSON.parse(data);
         }
: // else 
function json_parse(data) {
         if (!dbj.json.ok_string(data)) dbj.konsole.terror("Bad JSON string.");
    return (new Function("return " + data))();
}
;
    //-------------------------------------------------------------------------------------

    dbj.decode = function(H) {
        /// <summary>
        /// quick-and-not-so-dirty html decoder
        /// </summary>
        ///	<param name="H" type="String">
        /// html string to be decoded
        /// </param>
        H = H || "";
        if (H.length < 1) return H;
        return H.replace(/./mg, function(ch) {
            if (ch === '<') return "&lt;";
            if (ch === '>') return "&gt;";
            if (ch === '&') return "&amp;";
            if (ch === '"') return "&quot;";
            if (ch === "'") return "&quot;";
            return ch;
        });
    }
    dbj.uid = function(uid_) {
        /// <summary>
        /// unique identifier generator, made of dbj.prefix and the timer id.
        /// </summary>
        return dbj.prefix + (uid_ = setTimeout(function() { clearTimeout(uid_) }, 0));
    }
    dbj.prefix = "dbj";
    /// <summary>
    /// aka: 'dbj'
    /// </summary>
    dbj.now = function() { return +(new Date()); }
    /// <summary>
    /// In a getTime format
    /// </summary>

    dbj.reveal = function(O, drill) {
        /// <summary>
        /// More revealing than JSON.stringify()
        /// </summary>
        ///	<param name="O" type="object">
        ///	Reveal properties and methods of this object
        ///	</param>
        var left_brace = (dbj.role.name(O) === "Array" ? "[" : "{"), rigt_brace = (left_brace === "[" ? "]" : "}"), r = left_brace;
        for (var E in O) {
            if (O.hasOwnProperty === "function" && (false === O.hasOwnProperty(E) && !drill)) continue; // do not process inherited properties
            if ("object" != typeof O[E]) {
                if ("string" == typeof (O[E]))
                    r += " " + E + ": '" + O[E] + "',";
                else
                    r += " " + E + ": " + O[E] + ",";
            } else {
                if (null == O[E])
                    r += " " + E + ": " + O[E] + ",";
                else
                    r += " " + E + ": " + (drill !== null ? dbj.reveal(O[E]) : O[E]) + ",";
            }
        }

        return (r + rigt_brace).replace("," + rigt_brace, " " + rigt_brace);

    }

    dbj.xml = {
        /// <summary>
        /// cross browser xml doc creation 
        /// </summary>
        doc: (document.implementation && "function" === typeof document.implementation.createDocument) ?
                function () { return document.implementation.createDocument("", "", null); }
            :
                function () { return new ActiveXObject("MSXML2.DOMDocument");} 
    }

    /*
    goog.object.forEach = function(obj, f, opt_obj) { 
    for (var key in obj) { 
    if (obj.hasOwnProperty(key)) { 
    f.call(opt_obj, obj[key], key, obj); 
    } 
    } 
    }; 
    */
    dbj.each = function(OBJ, CB) {
        ///<summary>
        /// iterate over an object and call a callback: CB( prop_name , prop_value )
        /// where CB this will be the OBJ, so that: this[prop_name] === prope_value
        /// on each property which is "his own" or on any
        /// property if method hasOwnProperty is not present
        /// this should work in many cases even if Object.prototype is abused
        /// the only 100% fool proof way is to do this, is:
        /// for (var k in Object.prototype) delete Object.prototype[k];
        /// before this lib is declared or, perhaps, even periodicaly
        ///</summary>
        if (("Function" !== roleof(CB)) || (!OBJ)) return;
        for (var j in OBJ)
            if (OBJ.hasOwnProperty(j))
            CB.call(OBJ, j, OBJ[j]);
    }

    dbj.date_diff = function(date1, date2) {
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

    dbj.cond = function(v) {
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
        for (; j < L; j += 2) {
            if (dbj.cond.cond(v, arguments[j])) return arguments[j + 1];
        }
        return (!arguments[j - 2]) ? undefined : arguments[j - 2];
    }
    dbj.cond.cond = function(a, b) {
        ///<summary>
        ///allow users to change the condition operator used to match the value given
        ///default condition is 'equality', aka 'exact match'
        ///this method must return true or false
        ///</summary>
        return (a) === (b);
    }

})(jQuery, window);
/* EOF 'function ()' enclosure */

(function (global) {
dbj.f_sig = function ( f )
{
    // signature of a method through string decomposition
    // returns: [ <method name> , <method body with '~' instead of name>]
    // DBJ.ORG 2009
    var name = (f + "").match(/\w+/g)[1]; // name
 return [ name ,(f+ "").replace( name, "~")]; // signature
}
var native_signature = dbj.f_sig( Function )
dbj.isNative = function ( f ) 
{
 try {
    var sig = dbj.f_sig(f) ; // make name,signature pair
        return sig[1] === native_signature[1] ; // compare the signatures
 } catch(x) {
        return false ;
 }
}
})(window);

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
    dbj.callS = function(cb) {
        if ("function" !== typeof cb) dbj.konsole.terror("dbj.callS() first argument must be a function.");
        var args = a2a(arguments, 1);
        return cb.apply(this, args);
    }
    /*
    asynchronous caller
    function F () { alert( a2a() ); }
    callA(F,1,2,3)
    obviously there is no return value, use: dbj.callA.retval 
    */
    dbj.callA = function(cb) {
        var self = this, args = arguments, tid = window.setTimeout(function() {
            window.clearInterval(tid); tid = null; delete tid;
            dbj.callA.retval = dbj.callS.apply(self,args);
        },  dbj.callA.microseconds);
    }
    dbj.callA.microseconds = 100;
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
            /// Argument is optional, by default is is one empty space
            /// myText.minus(), returns myText without spaces
            /// argument can be an regular expression
            /// reg.exp. given does not require 'g' or 'm' modifier
            /// if argument is not found in the original, the original is returned
            ///</summary>
            return (this.split(what_ || String.space)).join(String.empty);
        }

    if (String.F !== typeof "".trim) {
        ///<summary>
        // String.trim() ES5
        /// due to the bug in IE where "\u00A0" is not covered by \s
        /// we have to explicitly add it to the regexp
        ///</summary>
        var Ltrim = /^[\s\u00A0]+/, Rtrim = /[\s\u00A00]+$/ ;
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
            /// cut to size. pad on right if smaller
            ///</summary>
            return this.length < l ? this.rpad(l, c) : this.substr(0, l);
        }
    if (String.F !== typeof "".rcut)
        String.prototype.rcut = function(l, c) {
            ///<summary>
            ///cut to size. pad on left if smaller
            ///</summary>
            return this.length < l ? this.lpad(l, c) : this.substr(0, l);
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
                var idx = 1 * $0.match(/\d+/)[0]; return args[idx] ? args[idx] : (args[idx] === "" ? "" : $0);
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

//
// browser feature checks , specific for DBJs only
//
(function() {
    dbj.browser = { support: {
        // CSS properties on new elements still not attached to the document
        // works in IE
        css_on_newborns: true
    }
    };
    // check if CSS properties get/set is supported on newly created but still detached elements
    // check W3C compliant browsers
    if (window.getComputedStyle !== undefined) {
        var btn = document.createElement("button");
        btn.style.color = "red";
        dbj.browser.support.orphan_css = ("" !== window.getComputedStyle(btn, null).getPropertyValue("color"));
        delete btn;
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
            return ( four() +
             four() + "-" + four() + "-" + four() + "-" + four() + "-" + four() + four() + four());
        };

        /*
This will work outside of browsers
    var x_ = null;
        dbj.GUID = function(empty_) {
        try {
        x_ = x_ || new ActiveXObject("Scriptlet.TypeLib");
        return empty_ ? empty : (x_.GUID);
        }
        catch (e) {
        dbj.konsole.warn("error creating dbj.GUID : " + e.message);
        return empty_ ? empty : make();
        }
        }
        */
dbj.GUID = function ( null_ ) { return null_ ? empty : make(); }

})();

//-----------------------------------------------------------------------------------------------------
// Each dbj jquery plugin is to be declared in the "dbj" plugin "namespace" :
// $.NS("dbj" { p1 : function (){}, p2 : function () {} }) ; // etc ...
// And then latter called like this :
// $.dbj("p1", a1,a2 ) // a1 and a2 are arguments for plugin dbj.p1
(function($, window, undefined) {

    $.NS = function(ns, functions)
    ///<summary>
    /// This is seen elsewhere on the net. An little namespace mechanism. Example:
    /// You create your plugin inside your namespace like this:
    /// $.NS("Z", { x: function() { return "jQuery:" + this.jquery + ", from X"; } });
    /// above creates or uses namespace 'Z'. and adds a plugin 'x' to it
    /// you call it like this, (with arguments or not) :
    /// $().Z("x",1,2,3)
    ///</summary>
    {
        $.fn[ns] = $.fn[ns] || function(cb) {
            cb = $.fn[ns][cb || ""];
            var retval;
            if ("function" !== typeof cb) {
                dbj.konsole.terror("$()." + ns + "() requires callaback or its name as first argument");
            }
            try {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                retval = cb.apply(this, args);
            } catch (x) {
            dbj.konsole.terror("Error in $()." + ns + "() plugin: " + x.message);
            }
            return retval || this;
        };

        for (var fn in functions)
            $.fn[ns][fn] = functions[fn];
    };

})(jQuery, window );


///<reference path="dbj.lib.js" />
