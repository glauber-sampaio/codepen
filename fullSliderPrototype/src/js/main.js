(function(window, TweenMax){

	'use strict';

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];

	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    	window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    	window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
        	                       || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);

		lastTime = currTime + timeToCall;
		return id;

    };
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
    };

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

	TweenMax.defaultEase = Expo.easeOut;

	function TSlider () {
		
		console.log('fine!');
		this._init();	

	}


	TSlider.prototype = {

		_init: function () {

			this.ww = window.innerWidth;
			this.wh = window.innerHeight;
			this.html = document.documentElement;
			// Check if it's mobile or click
			this.evttype = mobilecheck() ? 'touchstart' : 'click';
			// Slider global element
			this.Slider = document.getElementById('slider');
			// Images total count
			this.imagesCount = Array.prototype.slice.call(this.Slider.querySelectorAll('img')).length;
			// Slideshow interval
			this.sldInterval = 6000;
			// Control if it's animating
			this.isAnimating = false;
			// Current slide
			this.current = 0;
			// Minimum scale
			this.minScale = 0.7;

			/* Generate images wrapper */
			this._createSlider();

		},

		_createSlider: function () {

			var self = this;

			this.originalImgsEl = Array.prototype.slice.call(this.Slider.querySelectorAll('img'));
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

			//console.log(images);
			//console.log(this.mainImages);

			/* Creating the 'mainImages' elements */

			for( var i=0; i < this.images.length; i++ ) {

				var obj = this.images[i];
				this._createNewImgs(obj);
				this._createNavigation(obj);

			}

			this.sld = Array.prototype.slice.call(this.Slider.querySelectorAll('.mi__img'));
			this.bgSld = Array.prototype.slice.call(this.Slider.querySelectorAll('.bi__imgCont'));
			this.navItens = Array.prototype.slice.call(this.navigation.querySelectorAll('li'));

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
			_biContImgEl.innerHTML = '<div class="bi__imgCont-img bi-'+ (obj.index + 1) +'" />';
			_biContImgEl.style.zIndex = (this.imagesCount - (obj.index + 1));

			this.mainImages.appendChild(_miImgEl);
			this.backgroundImages.appendChild(_biContImgEl);

			var bi = this.backgroundImages.querySelector('.bi__imgCont .bi-' + (obj.index + 1));
			bi.style.background = 'url('+ obj.src +') no-repeat center top';
			bi.style.backgroundSize = 'cover';

			//classie(this.Slider.querySelectorAll('.mi__img')[this.current], 'active-slide');

		},

		_createNavigation: function (obj) {

			var ul = this.navigation.querySelector('ul');
			var _li = document.createElement('li');
			var number = pad((obj.index+1), 2);
			var info = '<h5>'+number+'</h5><h4>'+obj.alt+'</h4>'; 
			
			classie.addClass(_li, 'navItem-' + (obj.index + 1));
			_li.innerHTML = '<a href=""></a><div class="li__info"></div><div class="li__info-mask"><div class="mask__infoContainer"></div></div><div class="li__hoverLine"><div class="l"></div></div>';

			ul.appendChild(_li);
			ul.querySelector('.navItem-' + (obj.index + 1) + ' a').setAttribute('href', obj.url);
			ul.querySelector('.navItem-' + (obj.index + 1) + ' .li__info').innerHTML = info;
			ul.querySelector('.navItem-' + (obj.index + 1) + ' .mask__infoContainer').innerHTML = info;

		},

		_firstPosition: function () {
			
			var self = this;

			TweenMax.set(this.navigation, { opacity: 0, y: 25 });
			
			this.backgroundImages.style.display = "none";
			/*this.bgSld.forEach(function (el, i) {
				
				var _img = el.querySelector('.bi__imgCont-img');
				TweenMax.set(_img, { scale: 1.8, y: 50 });

				if(i != 0) {
					//TweenMax.set(el, { height: '0%', top: 'inherit', bottom: 0 });
				}

			});*/

			this.sld.forEach(function (el, i) {

				classie.addClass(el, 'sld-' + i);

				if(i === 0) { TweenMax.set(el, { scale: 1.3, opacity: 0 }); }
				else { TweenMax.set(el, { scale: self.minScale, y: -window.innerHeight }); }

			});

			setTimeout(function () {

				TweenMax.to(self.sld[0], 2.5, { scale: 1, opacity: 1, ease: Expo.easeOut });
				TweenMax.to(self.navigation, 1.2, { opacity: 1, y: 0, delay: 0.6, ease: Expo.easeOut });

				classie.addClass(self.sld[self.current], 'active-slide');
				classie.addClass(self.navItens[self.current], 'active');

				/* After all elements positioned, start slideshow. */
				self._startSlider();

			}, 1200);

			setTimeout(function () {

				//self.backgroundImages.style.display = "block";

			}, 2500);

		},

		_navigate: function (dir, pos) {

			if(this.isAnimating) {
				return false;
			}

			this.isAnimating = true;

			var self = this;
			var currSlide = this.sld[this.current];
			var currBGSlide = this.bgSld[this.current];


			if( pos !== undefined ) {
				this.current = pos;
			}
			else if( dir === 'next' ) {
				
				this.current = this.current < this.imagesCount - 1 ? ++this.current : 0;

			}
			else if ( dir === 'prev' ) {
				
				this.current = this.current > 0 ? --this.current : this.imagesCount - 1;

			}

			/* Reset last slide */
			this._resetLastSlide(currSlide, currBGSlide);

			/* Animate current slide */
			var nextSlide = this.sld[this.current];
			var nextBGSlide = this.bgSld[this.current];

			this._animateNextSlide(nextSlide, nextBGSlide);

		},

		_resetLastSlide: function (currSld, currBGSld) {

			classie.removeClass(currSld, 'active-slide');
			this.isAnimating = false;

			function n () {

				/* 'mi__img' element – front image */
				TweenMax.to(currSld, 1.5, { scale: 0.8, ease: Expo.easeOut });
				TweenMax.to(currSld, 0.8, { y: window.innerHeight, ease: Expo.easeOut, delay: 1.4, 
					onComplete: function () {
						TweenMax.set(currSld, { scale: self.minScale, y: -window.innerHeight });
					}
				});

				/* 'bi__imgCont' element – background image */
				//TweenMax.to(currBGSld.querySelector('.bi__imgCont-img'), 2, { scale: 1.8, ease: Expo.easeOut });
				//TweenMax.to(currBGSld, 1.2, { height: '0%', ease: Expo.easeOut, delay: 0.5 });
				
			}

			requestAnimationFrame(n, currSld);

		},

		_animateNextSlide: function (nxtSld, nxtBGSld) {

			var self = this;
			var idx = nxtSld.classList[1].split('sld-')[1];

			classie.addClass(nxtSld, 'active-slide');

			function n () {

				/* 'mi__img' element – front image */
				TweenMax.to(nxtSld, 0.8, { y: 0, ease: Expo.easeOut, delay: 1.6 });
				TweenMax.to(nxtSld, 1.5, { scale: 1, ease: Expo.easeOut, delay: 2 });

				/* 'bi__imgCont' element – background image */
				//TweenMax.to(nxtBGSld.querySelector('.bi__imgCont-img'), 2, { y: 0, ease: Expo.easeOut, delay: 0.8 });
				//TweenMax.to(nxtBGSld.querySelector('.bi__imgCont-img'), 2, { scale: 2, ease: Expo.easeOut, delay: 1 });

				/* 'navigation' li */
				self._animateNavigation(idx);				

			}

			requestAnimationFrame(n, nxtSld);

		},

		_animateNavigation: function (idx) {

			var self = this;
			var el = this.navItens[idx];
			var mask = el.querySelector('.li__info-mask');

			classie.removeClass(this.navigation.querySelector('li.active'), 'active');
			classie.addClass(el, 'active');

			TweenMax.to(mask, 5, { width: '100%' });

		},

		_startSlider: function () {

			var self = this;
			this.slideshow = setTimeout(function () {

				self._navigate('next');
				self._startSlider();

			}, this.sldInterval);

		}

	}

	window.TSlider = TSlider;

})(window, TweenMax);