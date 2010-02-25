
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LOG.JS(tm)
///
/// $Revision: 1 $$Date: 11/01/10 16:00 $
///
/// depends on : http://dbj.org/4/fblight

document.write(
"<!---- for IE use FireBug Light ----->" + 
"<!--[if IE]>" + 
'<link href="http://dbj.org/4/fblight/fbl.css" rel="stylesheet" type="text/css" />' + 
'<script src="http://dbj.org/4/fblight/fbl.js" type="text/javascript"><'+'/script>' + 
'<script type="text/javascript" >' +
"   onload = function () { var tid = setTimeout( function () { if (window.firebug) {" + 
"        clearTimeout(tid); delete tid; " +
"        firebug.env.debug = false;  /*open minimized*/" + 
"        firebug.env.detectFirebug;  /*do not initialize if Firebug is active */" + 
"    }}, 1000 ); }" + 
" <"+"/script>" + 
"<![endif]-->"
);

