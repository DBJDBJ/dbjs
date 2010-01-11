/// <reference path="../../jq132-vsdoc.js" />
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LOG.JS(tm)
///
/// $Revision: 1 $$Date: 11/01/10 16:00 $
///
/// Dependencies : jQuery 1.3.2 or higher
(function($, dbj) {

//TODO: find some jquery logging pluging... for IE
dbj.log = function() {
    if (!top.window.console || !top.window.console.log ) {
        $(document.body).prepend(("<ul style='font:8px/1.5 verdana,tahoma,arial; color:black; background:white;'><li>" + [].join.call(arguments, '') + "</ul></li>").replace(/\n/g, "<br/>"));
    } else {
        top.window.console.log([].join.call(arguments, ''));
    }
}

})(jQuery, top.dbj);

/*
Or just use this bellow!

<!--[if IE]>
<p>Firebug&trade;Lite : Click on it or drag and drop the link bellow to the Links Toolbar</p>
<p>
<a href="javascript:var%20firebug=document.createElement('script');firebug.setAttribute('src','http://dbj.org/4/fblight/fbl.js');document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init();}else{setTimeout(arguments.callee);}})();void(firebug);">
<img src="http://themeforest.s3.amazonaws.com/45_firefox/firebug.jpg" alt="Firebug Lite" title="Click for Firebug Lite. Or drag and drop this link onto the links toolbar." style="width:48px;height:48px;border-width:0px;" />
</a>
</p>
<![endif]-->
*/