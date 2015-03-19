(function () {

	'use strict';

    /*---------------*/

    if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = (function() {
	        return window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	        	window.oRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            function(callback, element) {
	                window.setTimeout(callback, 1000 / 60);
	        	};
	    })();
	}

    // from http://stackoverflow.com/a/11381730/989439
	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	// from http://stackoverflow.com/a/6466243/2011404
	function pad (str, max) {
	  	str = str.toString();
	  	return str.length < max ? pad("0" + str, max) : str;
	}

	function css(element, property) {
		var _property = window.getComputedStyle(element, null).getPropertyValue(property);
		if(_property.indexOf('px') != -1) { return parseInt(_property); }
		else { return _property; }
	}

	function Slice (elements) {
		return Array.prototype.slice.call(elements);
	}

	TweenLite.defaultEase = Expo.easeOut;

	/*---------------*/

	function TSlider () {
		console.log('fine!');
		this._init();
	}


	TSlider.prototype = {

		_init: function() {

			this.isFF = !!navigator.userAgent.match(/firefox/i);
			// Check if it's mobile or click
			this.evttype = mobilecheck() ? 'touchstart' : 'click';
			// Slider global element
			this.Slider = document.getElementById('slider');
			// Images total count
			this.imagesCount = Slice(this.Slider.querySelectorAll('img')).length;
			// Slideshow interval
			this.sldInterval = 6000;
			// Control if it's animating
			this.isAnimating = false;
			// Current slide
			this.current = 0;
			// Minimum scale
			this.minScale = 0.7;

			/* Let's do the magic! */
			this._createSlider();

		},

		/* --------------- */

		_createSlider: function () {

			var self = this;

			this.originalImgsEl = Slice(this.Slider.querySelectorAll('img'));
			this.images = [];

			/* Creating 'mainImages' element to receive the copy of all images */
			var _mainImagesEl = document.createElement('div');
			classie.addClass(_mainImagesEl, 'mainImages');
			this.Slider.appendChild(_mainImagesEl);

			/* Creating 'backgroundImages' element to receive the copy of all images */
			var _backgroundImagesEl = document.createElement('div');
			classie.addClass(_backgroundImagesEl, 'backgroundImages');
			this.Slider.appendChild(_backgroundImagesEl);

			/* Creating 'navigation' element */
			var _navigationEl = document.createElement('div');
			classie.addClass(_navigationEl, 'navigation');
			this.Slider.appendChild(_navigationEl);
			
			/* Final main elements */
			this.mainImages = this.Slider.querySelector('.mainImages');
			this.backgroundImages = this.Slider.querySelector('.backgroundImages');
			this.navigation = this.Slider.querySelector('.navigation');

			this.navigation.innerHTML = '<ul></ul>';

			/* Copying the images attributes */
			this.originalImgsEl.forEach(function (el, i) {

				var src = el.attributes.src.nodeValue;
				var alt = el.attributes.alt.nodeValue;
				var dataUrl = el.dataset.url;

				self.images.push({
					src: src, alt: alt, url: dataUrl, index: i
				});

				self.Slider.removeChild(el);

			});

			/* Creating the 'mainImages' elements */

			for( var i=0; i < this.images.length; i++ ) {

				var obj = this.images[i];
				this._createNewImgs(obj);
				this._createNavigation(obj);

			}

			this.sld = Slice(this.Slider.querySelectorAll('.mi__img'));
			this.bgSld = Slice(this.Slider.querySelectorAll('.bi__imgCont'));
			this.navItens = Slice(this.navigation.querySelectorAll('li'));

			/* Positioning all slides */
			this._firstPosition();

		},

		_createNewImgs: function (obj) {

			var _miImgEl = document.createElement('div');
			var _biContImgEl = document.createElement('div');

			classie.addClass(_miImgEl, 'mi__img');
			classie.addClass(_biContImgEl, 'bi__imgCont');

			_miImgEl.style.background = 'url('+ obj.src +') no-repeat center center';
			_miImgEl.style.backgroundSize = 'cover';
			_miImgEl.style.zIndex = (this.imagesCount - (obj.index + 1));
			_biContImgEl.innerHTML = '<div class="bi__imgCont-img bi-'+ obj.index +'" />';

			this.mainImages.appendChild(_miImgEl);
			this.backgroundImages.appendChild(_biContImgEl);

			var bgImageSrc = obj.src.split('.jpg')[0];
			var bi = this.backgroundImages.querySelector('.bi__imgCont .bi-' + obj.index);
			
			bi.style.background = 'url('+ bgImageSrc +'-blur.jpg) no-repeat center top';
			bi.style.backgroundSize = 'cover';
			this.backgroundImages.style.display = "none";

			//classie(this.Slider.querySelectorAll('.mi__img')[this.current], 'active-slide');

		},

		_createNavigation: function (obj) {

			var ul = this.navigation.querySelector('ul');
			var _li = document.createElement('li');
			var a, liInfo, mask;
			
			// Putting zero before number
			var number = pad((obj.index+1), 2);
			
			// For each item...
			classie.addClass(_li, 'navItem-' + obj.index);
			_li.innerHTML = '<a href=""></a><div class="li__info"></div><div class="li__info-mask"><div class="mask__infoContainer"></div></div><div class="li__hoverLine"><div class="l"></div></div>';
			ul.appendChild(_li);

			// New elements
			a = ul.querySelector('.navItem-' + obj.index + ' a');
			liInfo = ul.querySelector('.navItem-' + obj.index + ' .li__info');
			mask = ul.querySelector('.navItem-' + obj.index + ' .mask__infoContainer');

			// Setting links href attr
			a.setAttribute('href', obj.url);
			
			// Inner texts
			var info = '<h5>'+number+'</h5><h4>'+obj.alt+'</h4>'; 
			liInfo.innerHTML = info;
			mask.innerHTML = info;

			// Setting width for mask according to 'li' size.
			// This the the final computed style of li
			mask.style.width = css(_li, 'width') + "px";
			if(this.isFF) {
				mask.style.width = (css(_li, 'width')+5) + "px";
			}

		},

		_firstPosition: function () {

			var self = this;

			TweenMax.set(this.navigation, { opacity: 0, y: 25 });

			// Front images
			this.sld.forEach(function (el, i) {
				classie.addClass(el, 'sld-' + i);
				if( i===0 ) {
					// The first image will have the 'fade-in' animation
					TweenMax.set(el, { scale: 1.3, opacity: 0 });
				}
				else {
					// Other images will have the default position
					TweenMax.set(el, { scale: self.minScale, y: -window.innerHeight });
				}
			});	

			// Blur images (background)
			this.bgSld.forEach(function (el, i) {
				
				classie.addClass(el, 'bg-' + i);
				TweenMax.set(el.querySelector('.bi__imgCont-img'), { scale: 1.35, y: 80 });
				el.style.zIndex = 0;

				if( i === self.current ) {
					TweenMax.set(el.querySelector('.bi__imgCont-img'), { scale: 1.5, y: 0 });
					el.style.zIndex = (self.current + 2);
				}

				if( i === (self.current + 1)) {
					el.style.zIndex = (self.current + 1);
				}

			});

			/*classie.addClass(self.sld[self.current], 'active-slide');
			classie.addClass(self.navItens[self.current], 'active');*/

			// Must wait everything in their right place before start
			setTimeout(function () { self._enterAnimation() } , 1200);

		},

		_enterAnimation: function () {

			var self = this;
			var t = new TimelineMax({ 
				paused: true,
				onComplete: function () {
					self._startSlider();
					self.backgroundImages.style.display = "block";
				}
			});

			t.to(self.sld[self.current], 2.5, { scale: 1, opacity: 1 });
			t.to(self.navigation, 1.2, { opacity: 1, y: 0 }, 0.8);

			t.restart();

		},

		/* --------------- */
		/*
		
			Lógica:
			1) Primeiro slide aparece.
			2) Apareceu? Começou contagem.
			3) Acabou contagem, transiciona.
			4) Acabou transição? Aparece novo slide.

		*/

		_startSlider: function() {

			var self = this;
			var currSlide = this.sld[this.current];
			var currNavItem = this.navItens[this.current];
			var currBgSlide = this.bgSld[this.current];
			var currBgSldImage = currBgSlide.querySelector('.bi__imgCont-img');

			console.log('Começa contagem do slide ' + this.current + '.');

			animateCurrNavItem(currNavItem);
			classie.addClass(currSlide, 'active-slide');

			/*++++*/

			function animateCurrNavItem (el) {
				
				classie.addClass(el, 'active');
				el.querySelector('.li__info').style.opacity = 0.3;
				el.querySelector('.li__info-mask').style.opacity = 1;

				TweenMax.to(el.querySelector('.li__info-mask'), self.sldInterval/1000, {
					width: '100%', ease: Linear.easeNone,
					onComplete: function () {
						console.log('Agora, aciona as transições.');
						slidesTransitions();
					}
				});

			}

			function slidesTransitions () {

				var nextIndex = self.current < self.imagesCount - 1 ? ++self.current : 0;
				
				classie.removeClass(currSlide, 'active-slide');
				classie.removeClass(currNavItem, 'active');

				TweenMax.set(currBgSlide, { top: 0, bottom: 'inherit' });

				// Reset navigation item
				currNavItem.querySelector('.li__info').style.opacity = 0.7;
				TweenMax.to(currNavItem.querySelector('.li__info-mask'), 0.5, {
					opacity: 0,
					onComplete: function () {
						currNavItem.querySelector('.li__info-mask').style.width = "0%";
					}
				});

				// Move images
				var tm = new TimelineMax({ 
					onComplete: function () {
						
						console.log('Transição de slides terminado.');
						TweenMax.killTweensOf(currSlide, currBgSlide);

						// Moving up the last image
						TweenMax.set(currSlide, { scale: self.minScale, y: -window.innerHeight });

						// Reseting last background image
						TweenMax.set(currBgSlide, { height: '100%', top: 'inherit', bottom: 0 });
						TweenMax.set(currBgSldImage, { scale: 1.35, y: 80 });
						currBgSlide.style.zIndex = 0;

						// New z-index value for next background images
						self.bgSld[nextIndex].style.zIndex = 2;
						
						if((nextIndex+1) >= self.imagesCount) { self.bgSld[0].style.zIndex = 1; }
						else { self.bgSld[nextIndex+1].style.zIndex = 1; }
						//console.log(self.bgSld[nextIndex+1], ' : ', nextIndex+1);

						// Reinitialize the slider
						self.current = nextIndex;
						self._startSlider();

					}
				});

				// Current elements animations
				tm.to(currSlide, 1.5, { scale: 0.8 });
				tm.to(currBgSldImage, 1.2, { scale: 1.35 }, 0.15);
				tm.to(currSlide, 1.2, { y: window.innerHeight }, 0.8);
				tm.to(currBgSlide, 1.2, { height: '0%' }, 0.8);

				// Next elements animations
				tm.to(self.sld[nextIndex], 1.2, { y: 0 }, 0.8);
				tm.to(self.sld[nextIndex], 1.5, { scale: 1 }, 1.8);
				tm.to(self.bgSld[nextIndex].querySelector('.bi__imgCont-img'), 1.5, { y: 0 }, 1);
				tm.to(self.bgSld[nextIndex].querySelector('.bi__imgCont-img'), 1.5, { scale: 1.5 }, 1.8);

			}

		}

	}


	/*---------------*/

	var s = new TSlider;

})();