///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 2 $$Date: 17/02/10 18:13 $
///
/// Dependencies : dbj.lib.js
(function(window, dbj, undefined) {
// http: //erik.eae.net/playground/arrayextras/arrayextras.js
// Mozilla 1.8 has support for indexOf, lastIndexOf, forEach, filter, map, some, every
// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i < this.length; i++) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = this.length - 1;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i >= 0; i--) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}


// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(f, obj) {
        var l = this.length; // must be fixed during loop... see docs
        for (var i = 0; i < l; i++) {
            f.call(obj, this[i], i, this);
        }
    };
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(f, obj) {
        var l = this.length; // must be fixed during loop... see docs
        var res = [];
        for (var i = 0; i < l; i++) {
            if (f.call(obj, this[i], i, this)) {
                res.push(this[i]);
            }
        }
        return res;
    };
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:map
if (!Array.prototype.map) {
    Array.prototype.map = function(f, obj) {
        var l = this.length; // must be fixed during loop... see docs
        var res = [];
        for (var i = 0; i < l; i++) {
            res.push(f.call(obj, this[i], i, this));
        }
        return res;
    };
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:some
if (!Array.prototype.some) {
    Array.prototype.some = function(f, obj) {
        var l = this.length; // must be fixed during loop... see docs
        for (var i = 0; i < l; i++) {
            if (f.call(obj, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
if (!Array.prototype.every) {
    Array.prototype.every = function(f, obj) {
        var l = this.length; // must be fixed during loop... see docs
        for (var i = 0; i < l; i++) {
            if (!f.call(obj, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}

Array.prototype.contains = function(obj) {
    return this.indexOf(obj) != -1;
};

Array.prototype.copy = function(obj) {
    return this.concat();
};

Array.prototype.insertAt = function(obj, i) {
    this.splice(i, 0, obj);
};

Array.prototype.insertBefore = function(obj, obj2) {
    var i = this.indexOf(obj2);
    if (i == -1)
        this.push(obj);
    else
        this.splice(i, 0, obj);
};

Array.prototype.removeAt = function(i) {
    this.splice(i, 1);
};

Array.prototype.remove = function(obj) {
    var i = this.indexOf(obj);
    if (i != -1)
        this.splice(i, 1);
};

//-------------------------------------------------------------------------------------
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
// Generic variant
if ("function" !== Array.filter) {
    Array.filter = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.filter.call(obj, fun);
    }
}
// every() Generic variant
if ("function" !== Array.every) {
    Array.every = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.every.call(obj, fun);
    }
}

// map() Generic variant
if ("function" !== Array.map) {
    Array.map = function(obj, fun) {
        if ("string" === typeof obj) obj = obj.split("");
        return Array.prototype.map.call(obj, fun);
    }
}
// some() 
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

})(window, window.dbj );

