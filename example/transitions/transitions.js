(function ($) {

	$.pushnav({defaultTarget:"#wrapper"});
	$.pushnav
		.attach("#nav a", "#wrapper")
		.attach("#subnav a", "#wrapper")
		.transition('', '', adjustMainMenu)
		.transition('things', 'home', fromThingsToHome)
		.transition('thing', 'home', fromThingsToHome)
		.transition('', '', fadeInOut);

	/**
	 * On transitions, reset the currently active menu item in the main navigation
	 * @param transition
	 */
	function adjustMainMenu(transition) {
		var category = transition.newContentRaw.find("[data-pushnav-htmltag='body']").data("category");
        if (category) {
			$("#nav li").removeClass("active");
			$("#nav li[data-category='" + category + "']").addClass("active");
		}
	}

	/**
	 * Transition to fade out the old content and fade in
	 * the new content
	 * @param transition
	 * @return {Boolean}
	 */
	function fadeInOut(transition) {
        console.log("transition",$(transition.target));
		transition.target.fadeOut(200, function () {
			transition.newContent
				.hide()
				.replaceAll(transition.target)
				.fadeIn(400);
		});
		return false;
	}

	/**
	 * Transition similar to fadeInOut, but also collapses the
	 * sub navigation panel with a drawer style animation
	 * @param transition
	 * @return {Boolean}
	 */
	function fromThingsToHome(transition) {
        console.log("fromThingsToHome");
		$("#subnav").animate({
			"width":0
		}, 300);
		$("#micrositeContent").fadeOut(300, function () {
			transition.newContent
				.find("#micrositeContent")
				.hide()
				.replaceAll(this)
				.fadeIn(300);
		});
		return false;
	}

})(jQuery);