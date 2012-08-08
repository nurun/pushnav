//********************************************************************************//
// @author : Julie Cardinal
// @version : 1.0
// @Description: This plugin swap the actual content with new content provided by ajax
//               and override the browser history with pushState(or with hashtag for older browsers)

//*******************************************************************************//

(function($) {


    var isModern = isSupportPushState(),            // Allows to know if we're in a Browser that support pushState or not
        History = window.History,
        State = History.getState(),
        oldStateUrl,
        oldHash;


    /***********************************************************************************
     * DATA MODEL OBJECT
     **********************************************************************************/
        // Log Initial State
        History.log('initial:', State.data, State.title, State.url);


    function UrlBuild (data) {
        this.protocol= data.protocol || "";
        this.username= data.username || "";
        this.host= data.host || "";
        this.path= data.path || "";
        this.params= data.params || "";
        this.anchor= data.anchor || "";
    }

    function Params(data) {
        this.params = data.params || {};
    }


    /***********************************************************************************
     * EVENTS
     **********************************************************************************/


    $(window).bind('statechange',function(){
        console.log("statechange");

        var State = History.getState(); // Note: We are using History.getState() instead of event.state
            History.log('statechange:', State.data, State.title, State.url);

        // Verify if the new state url is different than the last one
        // (ex: first: product-section.html and the second trigger : product-section.html?expander1=true
        //      We don't want reload the page because it's just new query                               )
        var type = State.data.type,
            target= State.data.target,
            url= State.url,
            urlClean =  getUrlToClean(State.url),
            oldUrlClean = getUrlToClean(oldStateUrl);   // Remove the query argument;

        if (oldUrlClean !== urlClean) {
            if($(State.data.target).length > 0) {
                target= State.data.target;
            } else {
                target = ".swapcontent";
            }
            loadNewContent({url:url,target:target});
            oldStateUrl = urlClean;
            oldHash=null;
        }

    });

    $(window).bind("anchorchange", function(event, params) {
        History.log('Hash change:', State.data, State.title, State.url);
        var newUrl;
            // We only need to target for not modern browser
        if(!isModern) {
            newUrl=  getUrlParams(History.getState().url) ? getUrlParams(History.getState().url).swaptarget : null;
        } else {
            newUrl=  getUrlToClean(History.getState().url);
        }

        var oldUrlClean = getUrlToClean(oldStateUrl);

        if(newUrl && newUrl != oldUrlClean) {
            loadNewContent({url:newUrl, target:".swapcontent"});
            oldStateUrl = newUrl;
        }

    });


    /***********************************************************************************
     * FUNCTIONNAL
     **********************************************************************************/

    function init() {

        oldStateUrl = History.getState().url;

        $("body").delegate("[data-ajax-target]", "click", function(evt) {
            var $current =  $(evt.currentTarget),
                url = $current.attr("href"),
                target = $current.attr("data-ajax-target") ;

            if($(target).length > 0) {
                oldStateUrl = History.getState().url;
                History.pushState({target:target,type:"swapcontent"}, null, url);
            } else {
                console.log("SwapContent: This target isn' valid, please enter valid one" + target );
            }

            evt.preventDefault();
        });

        reEnhanceAjaxLink(window.location.href);
    }


    function reEnhanceAjaxLink(currentPageUrl) {

        $("a[data-ajax-target]").each(function(index,value){
            var $this = $(this),
                oldHref = $(this).attr("href");
            $this.attr("href",addQueryInURL(oldHref,"isAjax",true));
        });

        if(!isModern) {
            //TODO:
            // Need to check if they have ? already;
              $("a[href^='#']").each(function(index,value){
                 var $this = $(this),
                 oldHref = $(this).attr("href");
                 $this.attr("href",oldHref + "?swaptarget="+ getUrlToClean(currentPageUrl));
             });
        }

    }

    function loadNewContent(opts) {
        $.ajax({
            url: opts.url,
            dataType: "html",
            success: function(data) {
                data = $("<div>"+getDocumentHtml(data)+"</div>");
                opts.data = data;
                handleNewContent(opts);
            }, error: function(jqXHR, textStatus, errorThrown) {
                console.log("error");
            }
        });
    }


    function handleNewContent(opts) {
        var $elem = $(opts.target),
            targetWithoutPrefix = opts.target.substr(1,opts.target.length);
        $data = $(opts.data).hasClass(targetWithoutPrefix) || $(opts.data).is("[id='"+targetWithoutPrefix+"']") ? $(opts.data) : $(opts.data).find(opts.target);

        $elem.replaceWith($data);

        $(window).trigger("swapcontent_change");
        reEnhanceAjaxLink(opts.url);
    }



    /***********************************************************************************
     * GETTER
     **********************************************************************************/

    function getUrlToClean(url) {
        var urlObj = $.url.parse(url),
            urlHtml = urlObj.path;
        return urlHtml;
    }

    function getHashToClean(hash) {
        var hash = hash.replace("#","/").replace(/\?.*/,'');
        return hash;
    }


    function addQueryInURL(url,queryName, queryValue) {
        var urlParsed = $.url.parse(url),
            query = new Params (urlParsed);

        query.params[queryName] = queryValue;

        $.extend(urlParsed,query);
        var newObjUrl = new UrlBuild(urlParsed);
        return $.url.build(newObjUrl);
    }

    function isSupportPushState() {
        return !!(window.history && window.history.pushState);
    }


    function getUrlParams(url) {
        return $.url.parse(url).params;
    }

    function getDocumentHtml(html){
        // Prepare
        var result = String(html)
                .replace(/<\!DOCTYPE[^>]*>/i, '')
                .replace(/<(html|head|body|title|meta)([\s\>])/gi,'<div class="document-$1"$2')
                .replace(/<\/(html|head|body|title|meta)\>/gi,'</div>')
            ;

        // Return
        return result;
    }


    init();

})(jQuery);




