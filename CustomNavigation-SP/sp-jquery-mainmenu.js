$(function () {
    //BindTopNav();
    /*end responsive combo nav*/

   
	var navItems = [];
	
	 /*For Mobile Dimensions*/
	function getOrientation(){
		return Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
	};
	function getMobileWidth(){
		return getOrientation() == "landscape" ? $(window).height() : $(window).width();
	};
	function getMobileHeight(){
		return getOrientation() == "landscape" ? $(window).width() : $(window).height();
	};
	
	// Listen for resize changes
    $(window).on("resize.teexNav", function() {
        var screenWidth = getMobileWidth();

        if (screenWidth <= 992){
            BindTopNav();
            return;
        }
        if (screenWidth < 1200){
            ResetTopNav();
            return;
        }
        ResetTopNav();
        return;
    });


    // Listen for orientation changes
    $(window).on("orientationchange.teexNav", function() {
        var screenWidth = getMobileWidth();
        if (screenWidth <= 992){
            BindTopNav();
            return;
        }
       ResetTopNav();
        return;
    })
    

	
    function IntBinding(){
        var screenWidth = getMobileWidth();
        if (screenWidth <= 992) {
            BindTopNav();
            return;
        }
        if (screenWidth < 1200){
            ResetTopNav();
            return;
        }
        ResetTopNav();
        return;
    }
	
	
	
	function RebindSPEvents() {
		var navigation = $('.MainNavigationMenu ul.level1');
				navigation.find('li').each(function () {
					Sys.WebForms.Menu._domHelper.addEvent(this, 'mouseover', Sys.WebForms.MenuItem._onmouseover);
					Sys.WebForms.Menu._domHelper.addEvent(this, 'mouseout', Sys.WebForms.MenuItem._onmouseout);
				})
	}

  

	function BindTopNav() {
		/*grab top nav SP generated list*/
		var navigation = $('.MainNavigationMenu ul.level1');
		navigation.hide();
		if (navigation.length > 0) {
			/*loop through every nav item that has dynamic children*/
			navigation.find('li').each(function () {
				Sys.WebForms.Menu._domHelper.removeEvent(this, 'mouseover', Sys.WebForms.MenuItem._onmouseover);
				Sys.WebForms.Menu._domHelper.removeEvent(this, 'mouseout', Sys.WebForms.MenuItem._onmouseout);
				navItems.push($(this).children('a').text().toLowerCase());
			});
			
			if($('.level1 .has-popup a').lenght() != 0){
				var newlink = $('<a></a>');
				newlink.href = $('.level1 .has-popup a').href();
				newlink.href = $('.level1 .has-popup a').text();
			}
		   
			
			
			navigation.find('li.has-popup').each(function () {
				$(this).bind('click', function (e) {
					$(this).children('a').toggleClass('highlighted');
					$(this).children('ul').toggle();
					TogglePosition($(this).children('ul'));
				}); 
			});

		}
		SetActiveSiteLink();
	}

	function ResetTopNav() {
		var navigation = $('.MainNavigationMenu ul.level1');
		$('ul.level1').show();
		if (navigation.length > 0) {
			/*loop through every nav item that has dynamic children*/
			RebindSPEvents();

			navigation.find('li.has-popup').each(function () {
				$(this).unbind('click', function (e) {
					$(this).children('a').toggleClass('highlighted');
					$(this).children('ul').toggle();
					TogglePosition($(this).children('ul'));
				});
			});


		}
	}

	function MainThirdTierHeight(list) {
		var $ul = $('.MainNavigationMenu ul.level3');

			var cumulativeHeight = 0;
			$.each($(list).find('ul.level3 li'), function (index, val) {
				cumulativeHeight += $(this).outerHeight(true);
			})
			$(list).height(cumulativeHeight);
	}

	/*triggered when a nav link is hovered*/
	String.prototype.capitalizeFirstLetter = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}


	function SetActiveSiteLink() {
		var pathArray = window.location.pathname.split('/'),
			currentItem = pathArray[1],
			$activeLink = $('.active-link');
		 
		if ($activeLink.length == 0) {
			$activeLink = $('<span class="active-link"><i class="fa fa-bars"></i></span>');
			if (navItems.indexOf(currentItem) != -1) {
				$activeLink.prepend(currentItem.capitalizeFirstLetter());
			}

			$('.MainNavigationMenu').prepend(function () {
				return $activeLink.bind('click', function (e) { $('.MainNavigationMenu ul.level1').slideToggle({'duration': 200, 'easing': 'linear'}) });
			})
		}   
	}


	function TogglePosition($this) {
		if ($this.css('position') == 'absolute') {
			$this.css('position', 'inherit');
			return;
		}
		$this.css('position', 'absolute');
		return;
	}	

	IntBinding();
	
});