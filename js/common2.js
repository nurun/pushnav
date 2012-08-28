$(function() {
    $.pushnav({onnavigation:onNavigation});


    function onNavigation($fromDestDocument, $destDocument, $destElement, fromUrl, targetUrl, $fromId, $targetId) {

        var $newContent = $destElement.find("#micrositeContent"),
            $newSubNav = $destElement.find("#subnav");

        // Use only one time when we get on the website
        if(!$fromId) {
            if($targetId.attr("id") == "wrapper") {
               // Subnav
               handleSubNav($("#subnav"),$newSubNav);
               // Content
               fadeInOutContent($("#micrositeContent"),$newContent);
            }
        }

        // Always pass here after the first run.
        if($fromId && $targetId) {
            if( $fromId.attr("id") == "wrapper" && $targetId.attr("class") == "swapcontent" ||
                $fromId.attr("id") == "wrapper" && $targetId.attr("id") == "wrapper" ||
                $fromId.attr("class") == "swapcontent" && $targetId.attr("id") == "wrapper" ) {

                // We get the oldSrc not modified by the pushnav plugin
                if($fromDestDocument) {
                    var $subNav =  $fromDestDocument.find("#subnav");
                    handleSubNav($("#subnav"), $newSubNav, $subNav);
                }
                fadeInOutContent($("#micrositeContent"),$newContent);
            }
        }

    }

    /**
     * Handle if we have to display or not the subnav
     * @param $oldSubnav
     * @param $newSubNav
     */
    function handleSubNav($oldSubnav, $newSubNav, $oldSubnavOrigin) {
        var $oldChildren = $oldSubnav.children();
            $newChildren = $newSubNav.children(),
            $newSubNavClone = $newSubNav.clone(true);

        // Verify if the oldSubnav (with origin src, because the subnav in the dom is modified by pushnav)
        // is similar than the new subnav.
        if(!$oldSubnavOrigin || $oldSubnavOrigin[0].outerHTML != $newSubNav[0].outerHTML) {

            // We already have subnav in the screen, and the new subnav have children;
            if($oldChildren.length > 0 && $newChildren.length > 0 ) {
                $oldChildren.animate({"opacity":0},{duration:500, easing: 'easeInOutSine', complete: function(){
                   $newSubNavClone.css("opacity", "0");
                   $(this).removeAttr("opacity").replaceWith($newSubNavClone);
                   $newSubNavClone.animate({"opacity":1},{duration:500, easing: 'easeInOutSine', complete: function(){
                        $(this).removeAttr("opacity");
                    }});
                }});
            }
            // We have subnav in the screen but the new subnav have no children
            else if($oldChildren.length > 0 && $newChildren.length <= 0 ) {
                $oldSubnav.animate({"left":"-50px"},{duration:500, easing: 'easeInOutSine', complete: function() {
                    $(this).replaceWith($newSubNavClone);
                }});
            }
            // We have no children in the old subnav but the new subnav have children
            else if($oldChildren.length <= 0 && $newChildren.length > 0 ) {
                $oldSubnav.replaceWith($newSubNavClone);
                $newSubNavClone.css("left","-50px").animate({"left":"0px"},{duration:500, easing: 'easeInOutSine'});
            }

        }
    }


    /**
     * Transition between the old content and the new content
     * @param $old
     * @param $new
     */
    function fadeInOutContent($old, $new) {
        $old.animate({"opacity":0},{duration:500, easing: 'easeInOutSine', complete: function(){
            $new = $new.clone(true);
            $new.css("opacity", "0");
            $(this).replaceWith($new);
            $new.animate({"opacity":1},{duration:500, easing: 'easeInOutSine'});
        }});
    }

    /***********************************************************************************
     * Utils
     **********************************************************************************/



});