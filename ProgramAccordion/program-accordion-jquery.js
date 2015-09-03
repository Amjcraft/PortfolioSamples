jQuery(document).ready(function($){
	$('.accordion > li > .sub-accordion').hide();
 
	$('.accordion li > h3').click(function () {
		$(this).parent().find(".sub-accordion").slideToggle("slow");
		$(this).parent().toggleClass("accordion-active");
	})
	
	$('.btn-detail-toggle').click(function () {
		$(this).parents('li').children('.course-details').slideToggle("slow");
	})
});