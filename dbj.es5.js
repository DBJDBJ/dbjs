///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 5 $$Date: 25/02/10 14:06 $
///
/// Dependencies : dbj.lib.js
/*
IMPORTANT! ES5 default call context is null, not global object any more ! Example :
function es5 () { return this === null; }  // true
*/
(function(window, dbj, undefined) {

    var TOS_ = Object.prototype.toString,
        HOP_ = Object.prototype.hasOwnProperty;
    // global helpers
    if ("function" !== typeof window.roleof) {
        window.roleof = function(o) { return TOS_.call(o).match(/\w+/g)[1]; }
    }
    if ("function" !== typeof window.isArray) {
        window.isArray = typeof Array.isArray !== "function"
            ? function(x) { return TOS_.call(x) === "[object Array]"; }
            : Array.isArray;
    }
    if ("function" !== typeof window.isObject ) {
        window.isObject = function(x) { return TOS_.call(x) === "[object Object]"; }
    }

    dbj.string_as_array = "1"[0] === "1";

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }
            for (var i = fromIndex, L = this.length; i < L; i++) {
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
            obj = obj || null; /* defualt call context is null in ES5 */
            for (var i = 0; i < l; i++) {
                f.call(obj, this[i], i, this);
            }
        };
    }

    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(f, obj) {
            var l = this.length; // must be fixed during loop... see docs
            obj = obj || null; /* defualt call context is null in ES5 */
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
            obj = obj || null; /* defualt call context is null in ES5 */
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
            obj = obj || null; /* defualt call context is null in ES5 */
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
            obj = obj || null; /* defualt call context is null in ES5 */
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
        Array.indexOf = function(obj, elt, from) {
            if ("String" === roleof(obj)) return obj.indexOf(elt, from);
            return Array.prototype.indexOf.call(obj, elt, from);
        }
    }
    // Generic variant
    if ("function" !== Array.lastIndexOf) {
        Array.lastIndexOf = function(obj, elt) {
            if ("String" === roleof(obj)) return obj.lastIndexOf(elt);
            return Array.prototype.lastIndexOf.call(obj, elt);
        }
    }
    // Generic variant
    if ("function" !== Array.forEach) {
        Array.forEach = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.forEach.call(obj, fun);
        }
    }

    //[].filter 
    // Generic variant
    if ("function" !== Array.filter) {
        Array.filter = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.filter.call(obj, fun);
        }
    }
    // every() Generic variant
    if ("function" !== Array.every) {
        Array.every = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.every.call(obj, fun);
        }
    }

    // map() Generic variant
    if ("function" !== Array.map) {
        Array.map = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.map.call(obj, fun);
        }
    }
    // some() 
    if ("function" !== Array.some) {
        Array.some = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
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
    
    -------------------------------------------------------------------------------------
    */

    if ("function" !== Object.keys)
        Object.keys = function(object, own) {
            var k = [];
            if (own) {
                for (key in object) {
                    if (HOP_.call(object, key))
                        k[k.length] = key;
                }
            } else {
                for (key in object) k[k.length] = key;
            }
            return k;
        }

    // following two adapterts are used for dbj.forEach
    var make_keys_callback = function(object, callback) {
        var object_ = object;
        return function(key, index, keys_array) {
            /* this callback is called on keys of object_ */
            return callback.call(object_, object_[key], key, object_);
            /* callback arguments are given and ordered by ES5 convention */
        }
    }, make_args_callback = function(callback, args) {
        /* returned callback arguments are given and ordered by ES5 convention */
        return function(value, name, object) {
            return callback.apply(value, args);
        }
    };

    dbj.forEach = function(object, callback, args, own) {
        var Type = TOS_.call(object);

        if (isArray(args)) callback = make_args_callback(callback, args);

        if (isArray(object))
            return object.forEach(callback);
        if ("[object Object]" === Type)
            return (Object.keys(object, own)).forEach(make_keys_callback(object, callback));
        if ("[object String]" === Type)
            return (object.split("")).forEach(callback);

        throw "dbj.forEach() can iterate only over arrays, strings and objects. object argument is found to be: " + roleof(object);
    }
    /*
    Args example : suppose you want to pass arguments object or array of arguments to the callback
        //
        var result = ["non standard callback results"],
        obj = { a: 1, b: 2, c: 3 },
        non_standard_callback = function(a, b, c) { result.push(new Array(this, a, b, c)); return true; }
        dbj.forEach(obj, non_standard_callback, ["A", "B", "C"]);
        alert(result.join("\n"));
        //
    */
    dbj.reveal = function(O, drill) {
        /// <summary>
        /// More revealing than JSON.stringify()
        /// </summary>
        ///	<param name="O" type="object">
        ///	Reveal properties and methods of this object
        ///	</param>
        var left_brace, rigt_brace, r;

        // ES5 way : callback.call(thisp, this[i], i, this);
        var callbackO = function(value, name, obj) {
            if (!HOP_.call(obj, name)) return; // do not process inherited properties
            r += (" " + name + ": " + (drill && isObject(obj[name]) ? dbj.reveal(obj[name], drill) : obj[name]) + ",");
        },
          callbackA = function(value, name, obj) {
        r += (" " + (drill && isObject(obj[name]) ? dbj.reveal(obj[name], drill) : obj[name]) + ",");
          }

        if (isArray(O)) {
            left_brace = "[", rigt_brace = "]", r = left_brace;
            O.forEach(callbackA);
        }
        else if (isObject(O)) {
            left_brace = "{", rigt_brace = "}", r = left_brace;
            dbj.forEach(O, callbackO);
        } else {
            left_brace = "", rigt_brace = "", r = left_brace;
            r += (O + ",");
        }

        return (r + rigt_brace).replace("," + rigt_brace, " " + rigt_brace);
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////    
})(window, window.dbj || (window.dbj = {}));

