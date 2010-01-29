//
// DBJ each
//
        /*@cc_on
        @set @DEBUG=(1===1)
        @*/    
        (function(toString, undefined) {

            var ft = [      //     0 | 1        T | F   case "D": args==true  && isObj==true, 
               ["A", "B"],  //  0: A | B     T: A | B   case "C": args==true  && isObj==false
               ["C", "D"]   //  -----+--     -----+--   case "B": args==false && isObj==true
            ];              //  1: C | D     F: C | D   case "A": args==false && isObj==false
            
            ft[1][1] = /* case "D": args==true && isObj==true */
           function (callback, object, args) {
               for (var name in object) {
                   if (object.hasOwnProperty(name) // Ticket #5499
                       && callback.apply(object[name], args) === false) break; 
               }
               return object;
           }
            ft[1][0] =  /* case "C" : args==true && isObj==false */
            function(callback, object, args, i) {
                i = object.length; while ( (i--) && (callback.apply(object[i], args) === false)) ;
                return object;
            }

            ft[0][1] = /* case "B" : args==false && isObj==true */
            function(callback, object) {
                for (var name in object) {
                    if (object.hasOwnProperty(name) // Ticket #5499
                        && callback.call(object[name], name, object[name]) === false) break; 
                }
                return object;
            }
            ft[0][0] = /* case "A" : args==false && isObj==false */
            function(callback, object, i) {
                i = object.length; 
                while ( (i--) && (callback.call(object[i], i, object[i]) !== false)) ; 
                return object;
            }
            //
            var fun_sig = toString.call(function() { });
            //
            window.optimized_each = function(object, callback, args) {
                // var isObj = object.length === undefined || (toString.call(object) === "[object Function]");
/*@cc_on
@if (@DEBUG)
            try {
@end
@*/
                return ft
                [0 + (!!args)]
                [0 + (object.length === undefined || (toString.call(object) === fun_sig ))]
                (callback, object, args);
/*@cc_on
@if (@DEBUG)
            } catch (x) {
                if (confirm("" + x + "\n\nDebug?")) debugger;
            }
@end
@*/
          }
      })(Object.prototype.toString);
 (function(toString, undefined) {
     //------------------------------------------------------------------------------------------
     // DBJ first each optimization
     var fsig = toString.call(function() { });
     window.each140 = function(object, callback, args) {
         var name,
			length = object.length,
            isObj = length === undefined || (toString.call(object) === fsig );
         if (args) {
             if (isObj) {
                 for (name in object) {
                     if (object.hasOwnProperty(name)) { // Ticket #5499
                         if (callback.apply(object[name], args) === false) {
                             break;
                         }
                     }
                 }
             } else {
                 // #5496
                 var i = length; while (i--) {
                     if (callback.apply(object[i], args) === false) {
                         break;
                     }
                 }
             }

             // A special, fast, case for the most common use of each
         } else {
             if (isObj) {
                 for (name in object) {
                     if (object.hasOwnProperty(name)) { // Ticket #5499
                         if (callback.call(object[name], name, object[name]) === false) {
                             break;
                         }
                     }
                 }
             } else {
                 // #5496
                 var i = length; while (i--) {
                     if (callback.call(object[i], i, object[i]) === false) break;
                 }
             }
         }
         return object;
     };
     // -------------------------------------------------------------------------------------------
     // each 1.2.6
     //
     // from jQuery 1.2.6
     window.each126 = function(object, callback, args) {
         var name, i = 0, length = object.length;

         if (args) {
             if (length == undefined) {
                 for (name in object)
                     if (callback.apply(object[name], args) === false)
                     break;
             } else
                 for (; i < length; )
                 if (callback.apply(object[i++], args) === false)
                 break;

             // A special, fast, case for the most common use of each
         } else {
             if (length == undefined) {
                 for (name in object)
                     if (callback.call(object[name], name, object[name]) === false)
                     break;
             } else
                 for (var value = object[0];
					i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
         }

         return object;
     };
     // original each as in jQuery 1.3.2
     // args is for internal usage only
     window.each132 = function(object, callback, args) {
         var name, i = 0, length = object.length;

         if (args) {
             if (length === undefined) {
                 for (name in object)
                     if (callback.apply(object[name], args) === false)
                     break;
             } else
                 for (; i < length; )
                 if (callback.apply(object[i++], args) === false)
                 break;

             // A special, fast, case for the most common use of each
         } else {
             if (length === undefined) {
                 for (name in object)
                     if (callback.call(object[name], name, object[name]) === false)
                     break;
             } else
                 for (var value = object[0];
					i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
         }

         return object;
     };

 })(Object.prototype.toString);
