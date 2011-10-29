
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
        {
        	later: function (func, timeout) {
        		/* execute function a bit latter, default timeout is 1 sec */
        		var args = [].slice.call(arguments, 2);
        		tid = setTimeout(function () {
        			clearTimeout(tid); tid = null; delete tid;
        			func.apply(this || top, args);
        		}, timeout || 1000);
        	}
    , summa: (function () {
    	/* help summarizing or averaging values saved in this cache of named arrays of numerical values 
    	internal obj_ is object where each property is an array
    	*/
    	var obj_ = {},
    sum_ = function (arr) { var l = arr.length, sum = 0; while (l--) { sum += arr[l]; }; return sum; },
    avg_ = function (arr) { return sum_(arr) / arr.length; };

    	return {
    		/* interface */
    		add: function (k, v) {
    			v = v - 0;
    			if (!isArray(obj_[k]))
    				obj_[k] = [v];
    			else
    				obj_[k].push(v);
    			return v;
    		},
    		sum: function (k) { return sum_(obj_[k] || []); },
    		avg: function (k) { return avg_(obj_[k] || []); },
    		all: function (k) { return obj_[k] || [] },
    		rst: function () { obj_ = {}; return this; }
    	};
    } ()),
        	harvester: function (frm_id, defaults) {
        		/*
        		use this function to harvest form values on inputs named in its "defaults" argument
        		example call :
        		var harvest = harvester("myForm", { "name" : "Default", "age" : 22, "sex" : "male" } );
        		look for inputs name, age and sex in the form "myForm". if input value is null use the
        		values given in the argument.
        		*/
        		var $frm = jQuery("#" + frm_id, document.object), $input,
                getval = function (id_) {
                	$input = $frm.find("input#" + id_);
                	return ($input.val() || defaults[id_]);
                };
        		for (name in defaults) { defaults[name] = getval(name); }
        		return defaults;
        	},
        	round: function (original_number, decimals) {
        		/* quick number rounder */
        		var V1 = original_number * Math.pow(10, decimals), V2 = Math.round(V1);
        		return V2 / Math.pow(10, decimals);
        	},
        	crazyLoader: function () {
        		/* 
        		just slap the script tag(s) in the page wherever that might be 
				do not use script onload event or anything simillar
        		*/
        		for (var i = 0, L = arguments.length; i < L; i++) {
        			document.write("<script type='text/javascript' src='" + arguments[i] + "' ></" + "script>");
        		}
        	}, try_n_times: function (callback, times_, delay_) {
        		/*
        		try N times with delay between, 
        		break if callback returns true
        		defaults:    
        		no of times : 10     
        		uSec in between : 10 
        		*/
        		var tid, times = times_ || 10, delay = delay_ || 10;
        		function _internal() {
        			if (tid) clearInterval(tid); tid = null;
        			if ((times_--) < 1) {
        				return false; // whatever we waited for did not happen
        			}
        			if (false === callback()) {
        				return tid = setInterval(_internal, delay);
        			}
        			return true; // whatever we waited for did happen
        		}
        		return _internal();
        	},
        	table: function (host, id, klass, undefined) {
        		/*
        		very simple and effective table 'writer'

				// all the arguments are optional
        		var tabla = dbj_.table(your_host_dom_element, "your_table_id", "your_css_class_name");

        		tabla.hdr("ID", "Name", "Average Rating");  // defines table of 3 columns
        		tabla.caption("Waiting for " + query[1]);

        		tabla.row(1,"Bob",3.5); // proceed with number of columns
        		tabla.row(2,"DBJ",2.5); // 

        		// optional: style the table made
        		$(tabla.uid()).dataTable(); // apply 'dataTable' jQuery plugin 

        		*/
        		host || (host = document.body);
        		id || (id = "dbj_table_" + (0 + new Date));
        		klass || (klass = "dbj_table");
        		var 
				slice = Array.prototype.slice,
        		/* attach to table if exist */
				$existing = $("#" + id),
				table = $existing[0] ? $existing : jQuery("<table id='{0}' class='{1}'><caption></caption><thead></thead><tbody></tbody>".format(id, klass)).appendTo(host),
                $table = jQuery(table[0], host), colcount = null;
        		delete table;

        		/* 
        		first row added defines number of columns 
        		latter can make row with different number; the table will be jaddged
        		*/
        		function to_row(row_, header) {
        			if (jQuery.isArray(row_)) {
        				if (!colcount) colcount = row_.length;
        				var td = header ? "TH" : "TD", wid = Math.round(100 / colcount);
        				td += " width='{0}%' ".format(wid);
        				row_ = row_.join("</{0}><{0}>".format(td));
        				return "<tr><{0}>{1}</{0}></tr>".format(td, row_);
        			}
        			else {
        				throw "to_row() first argument must be array";
        			}
        		}
        		return {
        			hdr: function () {
        				$table.find("thead").append(to_row(slice.call(arguments), true)); return this;
        			},
        			row: function () {
        				$table.find("tbody").append(to_row(slice.call(arguments))); return this;
        				return this;
        			},
        			caption: function (caption) {
        				$table.find("caption").html(caption || "Caption"); return this;
        			},
        			err: function () {
        				$table.find("tbody").append(to_row(
                        "<span style='color:#cc0000;'>" + slice.call(arguments).join(" ")) + "</span>"
                        );
        				return this;
        			},
        			uid: function () { return id; }
        		}
        	}
        	//-----------------------------------------------------------------------------------------------
        };

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