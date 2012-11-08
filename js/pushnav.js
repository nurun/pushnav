//********************************************************************************//
// @author : Julie Cardinal
//           Mathieu Sylvain
// @version : 1.0
// @Description: This plugin swap the actual content with new content provided by ajax
//               and override the browser history with pushState(or with hashtag for older browsers)

//*******************************************************************************//

(function($) {


    var settings = {
        defaultTarget: ".pushnav-defaulttarget",
        stopImmediatePropagation: false,
        disableNotModern: false,
        debug: false
    };



    var isModern = isSupportPushState(),
        History = window.History,
        oldStateUrl,
        fromId,
        fromUrl,
        $from,
        transitions = [];



    $.pushnav = function (opts) {
        $.extend(settings, opts);
        if(!settings.disableNotModern) {
            fromUrl = window.location.href;
            init();
        }
    };

    /***********************************************************************************
     * TRANSITIONS
     **********************************************************************************/


    $.pushnav.transition = function (from, to, handler) {
        var trans = new Transition(from, to, handler);
        transitions.push(trans);
        return $.pushnav;
    };

    $.pushnav.attach = function (links, target) {

        $("body").delegate(links,"click", function (e) {
            ajaxLinksOnClick(e, target);
        });
        return $.pushnav;
    };

    function Transition(from, to, handler) {
        this.from = from;
        this.to = to;
        this.handler = handler;
        this.transit = function (transition) {
            return this.handler(transition);
        };
        this.test = function (transition) {
            var isOk = true;
            var to = transition.newContentRaw.find(".document-body").data("section");
            var from = $("body").data("section");
            if (this.to && this.to !== to) isOk = false;
            if (this.from && this.from !== from) isOk = false;
            return isOk;
        }
    }


    /**
     * Fallback transition which simply swap the old and next
     * content without any animation
     * @param transition
     */
    var swapTransition = new Transition('', '', function swapTransition(transition) {
        transition.target.replaceWith(transition.newContent);
        return false;
    });

    /***********************************************************************************
     * DATA MODEL OBJECT
     **********************************************************************************/
    // Log Initial State
    if(settings.debug) {
        var State = History.getState();
        History.log('initial:', State.data, State.title, State.url);
    }


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


    function createEvents() {

        $(window).bind('statechange',function(){
            var State = History.getState();
            if(settings.debug) History.log('statechange:', State.data, State.title, State.url);

            // Verify if the new state url is different than the last one
            // (ex: first: product-section.html and the second trigger : product-section.html?expander1=true
            //      We don't want reload the page because it's just new query                               )

            var target= State.data.target,
                url= State.url,
                urlClean =  getUrlToClean(State.url),
                oldUrlClean = getUrlToClean(oldStateUrl);   // Remove the query argument;

            if (oldUrlClean !== urlClean) {
                if($(State.data.target).length > 0) {
                    target= State.data.target;
                } else {
                    target = settings.defaultTarget;
                }
                onStateChange(url,target);
            }

        });

        $(window).bind("anchorchange", function(event, params) {
            var State = History.getState();
            if(settings.debug)  History.log('Hash change:', State.data, State.title, State.url);

            var newUrl;

            if(!isModern) {
                newUrl=  getUrlParams(State.url) ? getUrlParams(State.url).swaptarget : null;
            } else {
                newUrl=  getUrlToClean(State.url);
            }

            var oldUrlClean = getUrlToClean(oldStateUrl);

            if(newUrl && newUrl != oldUrlClean) {
                onStateChange(newUrl,settings.defaultTarget);
            }

        });
    }


    /***********************************************************************************
     * FUNCTIONNAL
     **********************************************************************************/

    function init() {
        oldStateUrl = History.getState().url;
        $("body").delegate("click", "[data-ajax-target]", ajaxLinksOnClick);
        createEvents();
        reEnhanceAjaxLink(window.location.href);
    }

    function ajaxLinksOnClick(evt, target) {
        evt.preventDefault();
        if (settings.stopImmediatePropagation) evt.stopImmediatePropagation();
        var $current =  $(evt.currentTarget),
            url = $current.attr("href"),
            target = target || $current.attr("data-ajax-target") ;

        if($(target).length > 0) {
            oldStateUrl = History.getState().url;
            History.pushState({target:target,type:"pushnav"}, null, url);
        } else {
            if(settings.debug) History.log("Pushnav: This target isn' valid, please enter valid one" + target );
        }
    }

    function onStateChange(url,target) {
        $(window).trigger("state_change.pushnav");
        loadNewContent({url:url, target:target});
        oldStateUrl = url;
    }

    function reEnhanceAjaxLink(currentPageUrl) {


        /*$.each(attachEls, function(index,value) {
         $(value).each(function(index,value){
         var $this = $(this),
         oldHref = $(this).attr("href");
         $this.attr("href",addQueryInURL(oldHref,{isAjax:true}));
         });
         });*/


        $("a[data-ajax-target]").each(function(index,value){
            var $this = $(this),
                oldHref = $(this).attr("href");
            $this.attr("href",addQueryInURL(oldHref,{isAjax:true}));
        });


        // Fix For IE7, it replaces relative path to absolute.
        // We want to be sure that the anchor link target the current page
        // that we loaded not the first one.
        if(!isModern) {
            $("a[data-pushnav-ieanchor]").each(function(index,value) {
                var $this = $(this),
                    url = getHash($this.attr("href"));

                $this.attr('href',url).removeAttr("data-pushnav-ieanchor");
            });
        }
        // END FIX


        $("a[href^='#']").each(function(index,value) {
            var $this = $(this),
                currentUrl = getUrlToClean(currentPageUrl),
                queries = isModern ? {isAjax:false} : {isAjax:false,swaptarget:currentUrl},
                oldHref = $(this).attr("href").replace("#",""),
                newUrl;

            newUrl = oldHref != "" ? "#"+ addQueryInURL(oldHref,queries) :  "#"+ getQueryString(queries) ;
            $this.attr("href",newUrl);
        });
    }

    function loadNewContent(opts) {

        $.ajax({
            url: opts.url,
            dataType: "html",
            beforeSend: function(xhr) {
                $("body").addClass("pushNav-loading");
            },
            success: function(data) {
                $("body").removeClass("pushNav-loading");
                data = $("<div>"+getDocumentHtml(data,opts.url)+"</div>");
                opts.data = data;
                handleNewContent(opts);
            }, error: function(/*jqXHR, textStatus, errorThrown*/) {
                $("body").css("cursor", "");

                if(settings.debug) History.log("Pushnav :: The content content could not be downloaded");
            }
        });
    }


    function handleNewContent(opts) {

        var i,
            result,
            tempTransitions = transitions.slice(),
            transition,
            transitionState,
            $elem = $(opts.target),
            targetWithoutPrefix = opts.target.substr(1,opts.target.length),
            $data = $(opts.data).hasClass(targetWithoutPrefix) || $(opts.data).is("[id='"+targetWithoutPrefix+"']") ? $(opts.data) : $(opts.data).find(opts.target);

        tempTransitions.push(swapTransition);

        transitionState = {
            "from": $from,
            "newContentRaw": opts.data,
            "newContent": $data,
            "fromUrl": fromUrl,
            "toUrl": opts.url,
            "fromId": fromId,
            "target": $elem
        };

        for (i = 0; i < tempTransitions.length; i++) {
            transition = tempTransitions[i];
            if (transition.test(transitionState)) {
                result = transition.transit(transitionState);
                if (result === false) break;
            }
        }

        var to = transitionState.newContentRaw.find(".document-body").data("section");
        $("body").data("section", to);
        $("body").attr("data-section", to);

        fromUrl = opts.url;
        fromId = $data;
        $from = opts.data;

        $(window).trigger("content_change.pushnav");
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

    function getHash(url) {
        var urlObj = $.url.parse(url),
            urlAnchor = "#" + urlObj.anchor;
        return urlAnchor;
    }


    /**
     * Replace # by / and remove query or everything begin with /
     * @param hash {String}
     * @return {String}
     */
    function getHashToClean(hash) {
        var hash = hash.replace("#","/").replace(/\?.*/,'');
        return hash;
    }

    /**
     * Convert Object to QueryString
     * Ex: var queries= {isAjax:true, swaptarget: "/product-solution.html"}
     *     Return: ?isAjax=true&swaptarget=/product-solution.html
     * @param query{Object}:
     * @return {String}
     */
    function getQueryString(query) {
        var queryString = "?",
            loopIndex=0;

        $.each(query,function(index,value) {
            if(loopIndex!=0) {
                queryString+="&";
            }
            queryString+=index+"="+value;
            loopIndex++;
        });

        return encodeURI(queryString);
    }


    function addQueryInURL(url,query) {
        var urlParsed = $.url.parse(url),
            newQuery = new Params (urlParsed);

        $.each(query,function(queryName,queryValue) {
            newQuery.params[queryName] = queryValue;
        });

        $.extend(urlParsed,newQuery);
        var newObjUrl = new UrlBuild(urlParsed);
        return $.url.build(newObjUrl);
    }

    /**
     * Detect if the browser support or not the HTML5 history
     * @return {Boolean}
     */
    function isSupportPushState() {
        return !!(window.history && window.history.pushState);
    }


    /**
     * Return all params from a url
     * @param url{String}: Url that contains Param
     * @return {String}
     */
    function getUrlParams(url) {
        return $.url.parse(url).params;
    }

    /**
     * converts the HTML String in a format that can be converted into jQuery
     * @param html
     * @return {String}
     */
    function getDocumentHtml(html,url){
        // Prepare
        var result = String(html)
            .replace(/<\!DOCTYPE[^>]*>/i, '')
            .replace(/<(html|head|body|title|meta)([\s\>])/gi,'<div class="document-$1"$2')
            .replace(/<\/(html|head|body|title|meta)\>/gi,'</div>');

        // Fix For IE7, it replaces relative path to absolute.
        // We want to be sure that the anchor link target the current page
        // that we loaded not the first one.

        if(! isModern) result = result.replace(/<(a(.*?)href=["'](#[^"']+)["'])([\s\>])/gi,'<a data-pushnav-ieanchor="true" $2href="'+url+'$3"$4');

        // Return
        return result;
    }

})(jQuery);




