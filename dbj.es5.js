///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 1 $$Date: 10/02/10 2:05 $
///
/// Dependencies : dbj.lib.js
(function( window, dbj, undefined) {
/*
  The DBJ ES5 emulations
*/
//-------------------------------------------------------------------------------------
// BEGIN : ES5 compatibility
// This algorithms are the ones used in Firefox and SpiderMonkey.
if ("function" !== Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0, from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}
/* 
GENERICS : array generics can be applied to every object that has a length property
But in case of host where string does not allow for indexing this is a bit tricky
*/
if ("function" !== Array.indexOf) {
    if (!dbj.ftr.string_indexing) {
        Array.indexOf = function(obj, elt, from) {
            if ("object" === typeof obj)
                return Array.prototype.indexOf.call(obj, elt, from);
            else
                if ("string" === typeof obj)
                return obj.indexOf(elt, from);
            else
                return -1;
        }
    } else { // more conformant hosts
        Array.indexOf = function(obj, elt, from) {
            return Array.prototype.indexOf.call(obj, elt, from);
        }
    }
}
// This algorithm is exactly the one used in Firefox and SpiderMonkey.
if ("function" !== Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(elt /*, from*/) {
        var len = this.length, from = Number(arguments[1]);
        if (isNaN(from)) {
            from = len - 1;
        }
        else {
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) from += len;
            else if (from >= len) from = len - 1;
        }

        for (; from > -1; from--) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}
// Generic variant
if ("function" !== Array.lastIndexOf) {
    if (dbj.ftr.string_indexing) {
        Array.lastIndexOf = function(obj, elt) {
            return Array.prototype.lastIndexOf.call(obj, elt);
        }
    } else {
        if ("object" === typeof obj)
            return Array.prototype.lastIndexOf.call(obj, elt, from);
        else
            if ("string" === typeof obj)
            return obj.lastIndexOf(elt, from);
        else
            return -1;
    }
}
// This algorithm is exactly the one used in Firefox and SpiderMonkey.
if ("function" !== typeof Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp*/) {
        if (typeof fun != "function") dbj.konsole.terror("[].forEach : callback not a function");
        var len = this.length >>> 0, thisp = arguments[1];
        for (var i = 0, val; i < len; i++) {
            if (i in this) {
                val = this[i]; // in case fun mutates this  
                fun.call(thisp, val, i, this);
            }
        }
    };
}
// Generic variant
if ("function" !== Array.forEach) {
    if (dbj.ftr.string_indexing) {
        Array.forEach = function(obj, fun) {
            return Array.prototype.forEach.call(obj, fun);
        }
    } else {
        if ("string" === typeof obj) obj = obj.split("");
        if ("object" === typeof obj)
            return Array.prototype.forEach.call(obj, elt, from);
        else
            return -1;
    }
}

//[].filter 
// This algorithm is exactly the one used in Firefox and SpiderMonkey.
if ("function" !== typeof Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp*/) {
        if (typeof fun != "function") dbj.konsole.terror("[].filter : callback not a function");
        var len = this.length >>> 0, res = [], thisp = arguments[1];
        for (var i = 0, val; i < len; i++) {
            if (i in this) {
                val = this[i]; // in case fun mutates this  
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }
        return res;
    };
}
// Generic variant
if ("function" !== Array.filter) {
    Array.filter = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.filter.call(obj, fun);
    }
}
// This algorithm is exactly the one used in Firefox and SpiderMonkey.
if ("function" !== Array.prototype.every) {
    Array.prototype.every = function(fun /*, thisp*/) {
        if (typeof fun != "function") dbj.konsole.terror("[].every : callback is not a function");
        var len = this.length >>> 0, thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this && !fun.call(thisp, this[i], i, this))
                return false;
        }
        return true;
    };
}
// Generic variant
if ("function" !== Array.every) {
    Array.every = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.every.call(obj, fun);
    }
}

// This algorithm is exactly the one used in Firefox and SpiderMonkey.
if ("function" !== Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        if (typeof fun != "function") dbj.konsole.terror("[].map : callback is not a function");
        var len = this.length >>> 0, res = new Array(len), thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }
        return res;
    };
}
// Generic variant
if ("function" !== Array.map) {
    Array.map = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.map.call(obj, fun);
    }
}
// This algorithm is exactly the one used in Firefox and SpiderMonkey.
if ("function" !== Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisp*/) {
        if (typeof fun != "function") dbj.konsole.terror("[].some : callback is not a function");
        var i = 0, len = this.length >>> 0, thisp = arguments[1];
        for (; i < len; i++) {
            if (i in this && fun.call(thisp, this[i], i, this))
                return true;
        }
        return false;
    };
}
if ("function" !== Array.some) {
    Array.some = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.some.call(obj, fun);
    }
}
/* reduce    
Summary         Apply a function against an accumulator and each value of the array (from left-to-right) 
as to reduce it to a single value.
Syntax
var result = array.reduce(callback[, initialValue]);
Parameters
callback        Function to execute on each value in the array.
initialValue    Object to use as the first argument to the first call of the callback.
*/
if ("function" !== Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        if (typeof fun != "function") dbj.konsole.terror("[].reduce : callback is not a function");
        var len = this.length >>> 0;

        if (len === 0 && arguments.length == 1)
            dbj.konsole.terror("[].reduce : no value to return if no initial value and an empty array");

        var i = 0;
        if (arguments.length >= 2) { var rv = arguments[1]; }
        else {
            do {
                if (i in this) { rv = this[i++]; break; }
                if (++i >= len)
                    dbj.konsole.terror("[].reduce : array contains no values, no initial value to return");
            }
            while (true);
        }
        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }
        return rv;
    };
}
/* ES5 Examples
REDUCE Examples
Example: Sum up all values within an array

var total = [0, 1, 2, 3].reduce(function(a, b){ return a + b; });  
// total == 6  

Example: Flatten an array of arrays
var flattened = [[0,1], [2,3], [4,5]].reduce(function(a,b) {  
return a.concat(b);  
}, []);  
// flattened is [0, 1, 2, 3, 4, 5]  

Example: Filtering out all small values
The following example uses filter to create a filtered array that has all elements with values less than 10 removed.

function isBigEnough(element, index, array) {  
return (element >= 10);  
}  
var filtered = [12, 5, 8, 130, 44].filter(isBigEnough); 
*/
// END : ES5 compatibility
//-------------------------------------------------------------------------------------

})(this, dbj );

