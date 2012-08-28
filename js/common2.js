$(function() {
    $.pushnav({onnavigation:onNavigation});


    function onNavigation($destDocument, $destElement, fromUrl, targetUrl, $fromId, $targetId) {

        console.log("=>", fromUrl, targetUrl, $fromId, $targetId);

        var $newContent = $destElement.find("#micrositeContent"),
            $newSubNav = $destElement.find("#subnav");

        if($targetId.attr("id") == "wrapper") {

            $("#subnav").replaceWith($newSubNav)
            $newSubNav.animate({"left":"0px"},{duration:500, easing: 'easeInOutSine'});

            fadeInOutContent($("#micrositeContent"),$newContent);

        } else if( $targetId.attr("class") == "swapcontent" && $fromId.attr("id") == "wrapper" ) {

            $("#subnav").animate({"left":"-50px"},{duration:500, easing: 'easeInOutSine', complete: function() {
                $(this).replaceWith($newSubNav);
            }});

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