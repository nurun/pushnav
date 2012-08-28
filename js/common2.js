$(function() {
    $.pushnav({onnavigation:onNavigation});


    function onNavigation($destDocument, $destElement, fromUrl, targetUrl, $fromId, $targetId) {

        console.log("=>",$fromId, $targetId);

        var $newContent = $destElement.find("#micrositeContent"),
            $newSubNav = $destElement.find("#subnav");


        // Switch Between a SubSection Content to the Main Section content
        if ($fromId && $targetId && $fromId.attr("id")== "micrositeContent" && $targetId.attr("id") == "wrapper" ) {
            console.log("Transition #1", parseFloat($("#subnav").css("left")), $destElement, parseFloat($newSubNav.css("left")) );
                $("#subnav").replaceWith($newSubNav);
                $newSubNav.css("left","-50px").animate({"left":"0px"},{duration:500, easing: 'easeInOutSine'});
            fadeInOutContent($("#micrositeContent"),$newContent);
        }

        // Switch Between Section Content a submenu visible to Generic Section without subnav
       else if( $fromId && $targetId && $fromId.attr("id") == "wrapper" && $targetId.attr("class") == "swapcontent" && parseFloat($("#subnav").css("left")) >= 0) {
            console.log("Transition #2");
            $("#subnav").animate({"left":"-50px"},{duration:500, easing: 'easeInOutSine', complete: function() {
                console.log("$newSubNav", $newSubNav);
                $(this).replaceWith($newSubNav);
            }});

            fadeInOutContent($("#micrositeContent"),$newContent);
        }

        else if ($fromId && $targetId && $fromId.attr("id") == "micrositeContent" && $targetId.attr("class") == "swapcontent") {
            console.log("Transition #3");
            fadeInOutContent($("#micrositeContent"),$newContent);
        }

        // Switch Between the Main Section content to SubSection content or
        // Switch Between the SubSection content to another SubSection content
        else if ($fromId && $targetId && ( $fromId.attr("id") == "wrapper" && $targetId.attr("id") == "micrositeContent") || ( $targetId.attr("id") == "micrositeContent")) {
            console.log("Transition #4");
            fadeInOutContent($("#micrositeContent"),$destElement);

        } else if($fromId && $targetId &&  ( $fromId.attr("id") == "wrapper" && $targetId.attr("class") == "swapcontent") && parseFloat($("#subnav").css("left")) >= 0) {
            fadeInOutContent($("#micrositeContent"),$newContent);
        }
        // Switch Between SubSection content to the Main Section content when we enter in the website (no fromId)
        else if ($targetId && $targetId.attr("id") == "wrapper" && parseFloat($("#subnav").css("left")) >= 0){
            console.log("Transition #5");
            fadeInOutContent($("#micrositeContent"),$newContent);
        }

        else if ($targetId && $targetId.attr("id") == "wrapper") {
            console.log("Transition #6");
            $("#subnav").replaceWith($newSubNav);
            $newSubNav.css("left","-50px").animate({"left":"0px"},{duration:500, easing: 'easeInOutSine'});

            fadeInOutContent($("#micrositeContent"),$newContent);

        }
    }

    function fadeInOutContent($old, $new) {
        $old.animate({"opacity":0},{duration:500, easing: 'easeInOutSine', complete: function(){
            $new.css("opacity", "0");
            $(this).replaceWith($new);
            $new.animate({"opacity":1},{duration:500, easing: 'easeInOutSine'});
        }});
    }

});