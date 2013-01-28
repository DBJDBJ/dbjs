
///
/// MIT,GPL (c) 2009-2010 by DBJ.ORG
/// DBJ.HDR.JS(tm)
///
/// Standard javascript intro into my development and testing pages
///
/// $Revision: 13 $$Date: 10/29/11 09:09 $
///

/*
if using IE <= 8 include this file on the top of your html page
as it will provoke inclusion of firebug-lite
*/
if (! window.console )
    document.write(
'<!--[if lte IE 8]>' +
'<script type="text/javascript" src="https://getfirebug.com/firebug-lite.js"><' + '/script>' +
'<![endif]-->'
);

   if (!top.dbj_)
       (function () {

   		top.dbj_ =
  
        /*
		
		Example of using crazyLoader and try_n_times, for very simple but still effective
		loading od js files

		NOTE: try_n_times will try 10 x 10 uSec or until the callback given returns true

		// obtain jquery
        dbj_.crazyLoader("http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js");
        dbj_.try_n_times(function () { return "object" === typeof window.jQuery; });

		//obtain JSON
        if ( ! window.JSON ) {
        dbj_.crazyLoader('http://dbj.org/4/json2.js');
        dbj_.try_n_times(function () { return 'object' === typeof window.JSON; });
        }

		// obtain something else 
        dbj_.crazyLoader('dbj.lib.js'); 
        dbj_.try_n_times(function () { return 'object' === typeof window.dbj; });
		
		NOTE: above is the simplest form of usage which is not very robuts since next script 
		load attempt immediately happens without waiting for previous script load
		Much beet pattern is to use the callback to load the next script when 
		the previous test is satisfied 

		// obtain jquery and JSON after jquery is loaded
		function json_loader () {
			if ( ! window.JSON ) {
			dbj_.crazyLoader('http://dbj.org/4/json2.js');
			dbj_.try_n_times(function () { return 'object' === typeof window.JSON; });
			}
		}
		// try jQuery loading
        dbj_.crazyLoader("http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js");
        dbj_.try_n_times(function () { 
				var condition = "object" === typeof window.jQuery; 
					if ( condition ) json_loader() ;
				return condition ;
		});

		NOTE: in any case your in-page scripts will start immediately after above,
		so it is best not to have them, but group them in function to be called if and when
		all you need is loaded ...

		NOTE: the key : while all of the above is happening your page will load and show itself, 
		sometimes *much* quicker than having normal script includes, anywhere in the page.

        */

   	} ());