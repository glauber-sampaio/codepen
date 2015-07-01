

function Slider() {

	TweenLite.defaultEase = Expo.easeOut;

	this.init();

}

Slider.prototype = {

	delta: 0,
	scrollThreshold: 5,
	animating: false,

	init: function () {

		var self = this;

		this.Content = document.querySelector('#content');
		this.sliderFrame = document.querySelector('.slider-frame');
		this.sliderCaptions = document.querySelector('.slider-captions');
		this.sliderControl = document.querySelector('.slider-control');
		this.activeElements = {};

		this.drawCaptions();
		this.drawControl();
		this.slidersInitPosition();
		this.scrolling();

		setTimeout(function () {

			self.activeCaptionAnimationIn();
			self.activeSliderAnimationIn();
			self.updateActiveNav();

		}, 1000);

	},

	drawCaptions: function () {

		var self = this;
		var captionItem = this.sliderCaptions.querySelectorAll('.caption-item');

		Array.prototype.slice.call(captionItem).forEach(
			function (el, i) {

				// Cloning text group to create the outlined group
				el.classList.add('js-cap-' + i);

				var mainTextGroup = el.querySelector('.text-group');
				var outlinedTxtGroup = mainTextGroup.cloneNode(true);

				outlinedTxtGroup.classList.remove('black');
				outlinedTxtGroup.classList.add('outline');

				Array.prototype.slice.call(outlinedTxtGroup.querySelectorAll('.text-wrapper p')).forEach(
					function (p) {
						p.classList.remove('black');
						p.classList.add('outline');
					}
				)

				el.appendChild(outlinedTxtGroup);

				// center vertically

				var textGroupH = window.getComputedStyle(mainTextGroup, null).getPropertyValue('height');

				el.style.height = textGroupH;
				el.style.top = "50%";
				el.style.marginTop = -(parseInt(textGroupH) / 2) + 'px';

				// first item

				if(classie.has(el, 'js-cap-0')) {
					el.classList.add('active-caption');
					self.activeElements.caption = el;
					return;
				}

				el.classList.add('hiden-caption');

			}
		);

	},

	drawControl: function () {

		var slidesLength = this.sliderFrame.querySelectorAll('.slider').length;
		var btnEl = document.createElement('div');

		btnEl.classList.add('btn');
		btnEl.innerHTML = '<div class="line"></div>';

		for( var i = 0; i < slidesLength; i++ ) {

			var _newBtn = btnEl.cloneNode(true);
			this.sliderControl.appendChild(_newBtn);

		}

		this.sliderControl.style.opacity = 1;

	},

	slidersInitPosition: function () {

		var self = this;

		Array.prototype.slice.call(this.sliderFrame.querySelectorAll('.slider')).forEach(
			function (slider, i) {

				var image = slider.querySelector('.slider--image');

				image.style.transform = "rotate3d(0, 0, 1, -10deg) translate3d(0, " + (window.innerHeight * 2) + "px, 0)";

				if(i == 0) {
					slider.classList.add('active-slider');
					self.activeElements.slide = {
						el: slider, index: i
					};
				}

			}
		);

		this.sliderFrame.querySelector('.slider-frame--slides').style.opacity = 1;

	},

	activeSliderAnimationIn: function () {

		var activeSlider = this.sliderFrame.querySelector('.active-slider');

		TweenMax.to(activeSlider.querySelector('.slider--image'), 1, {
			transform: 'rotate3d(0, 0, 1, 0deg) translate3d(0, 0, 0)',
			delay: 0.4
		});

	},

	currSliderAnimationOut: function (index) {

		var currSlider = Array.prototype.slice.call(this.sliderFrame.querySelector('.slider-frame--slides').children)[index],
			_image = currSlider.querySelector('.slider--image'),
			tm = new TimelineMax({ onComplete: resetSliderPosition });

		//currSlider.style.overflow = 'hidden';

		TweenMax.killTweensOf(_image);

		tm.to(_image, 0.8, { scale: 0.8 });
		tm.to(_image, 1, { y: -window.innerHeight });

		function resetSliderPosition() {

			// _image.style.transform = "rotate3d(0, 0, 1, -10deg) translate3d(0, " + (window.innerHeight * 2) + "px, 0)";
			// currSlider.style.overflow = 'visible';

		}

	},

	activeCaptionAnimationIn: function () {

		var activeCaption = document.querySelector('.slider-captions .active-caption'),
			textGroupBlack = activeCaption.querySelector('.text-group.black'),
			textGroupOutline = activeCaption.querySelector('.text-group.outline');

		console.log(activeCaption);

		if(classie.has(activeCaption, 'hiden-caption')) {
			activeCaption.classList.remove('hiden-caption');
		}

		TweenMax.staggerTo(textGroupOutline.children, 3, { width: '100%', delay: 1, onComplete: hideGroupOutline }, 0.2);
		TweenMax.staggerTo(textGroupBlack.children, 2, { width: '100%', delay: 1.3 }, 0.2);

		function hideGroupOutline() {
			TweenMax.to(textGroupOutline, 1, { opacity: 0 });
		}

	},

	currCaptionAnimationOut: function (index) {

		var self = this,
			currCaption = document.querySelector('.js-cap-' + index),
			textGroupBlack = currCaption.querySelector('.text-group.black'),
			textGroupOutline = currCaption.querySelector('.text-group.outline');

		TweenMax.staggerTo(textGroupOutline.children, 1, { width: '0%', onComplete: hideGroupOutline }, 0.2);
		TweenMax.staggerTo(textGroupBlack.children, 0.5, { width: '0%', delay: 0.2 }, 0.2);

		function hideGroupOutline() {
			TweenMax.to(textGroupOutline, 1, { opacity: 0 });
			currCaption.classList.add('hiden-caption');
		}

	},

	updateActiveNav: function () {

		var activeSlideIndex = this.activeElements.slide.index;
		var navButton = this.sliderControl.querySelectorAll('.btn')[activeSlideIndex];
		
		if(this.sliderControl.querySelector('.active')) {

			this.sliderControl.querySelector('.active').classList.remove('active');
			navButton.classList.add('active');
			return;

		}

		navButton.classList.add('active');

	},

	scrolling: function () {

		var self = this;

		window.addEventListener('mousewheel', function (event) {
			
			if( event.detail < 0 || event.wheelDelta > 0 ) {

				// prev
				self.delta--;
				(Math.abs(self.delta) >= self.scrollThreshold) && self.prevSlide();

			} else {

				// next
				self.delta++;
				(self.delta >= self.scrollThreshold) && self.nextSlide();

			}

			return false;

		});

	},

	nextSlide: function () {

		var self = this,
			_sliderFrameChildren = Array.prototype.slice.call(this.sliderFrame.querySelector('.slider-frame--slides').children),
			
			activeSld = this.activeElements.slide.el,
			currSldIndex = this.activeElements.slide.index,
			nextSld = activeSld.nextElementSibling,
			//nextCaption = this.activeElements.caption.nextElementSibling;
			nextCaption = document.querySelector('.js-cap-' + (currSldIndex + 1));

		console.log('CURR SLD INDEX', currSldIndex);
		console.log(nextCaption);

		if(!this.animating) {

			this.animating = true;

			activeSld.querySelector('.slider--shadow').style.display = 'block';
			activeSld.classList.remove('active-slider');
			nextSld.classList.add('active-slider');

			this.activeElements.caption.classList.remove('active-caption');
			nextCaption.classList.add('active-caption');

			this.activeElements.slide = {
				el : nextSld,
				index: _sliderFrameChildren.indexOf(document.getElementsByClassName('active-slider')[0])
			}

			this.currSliderAnimationOut(currSldIndex);
			this.currCaptionAnimationOut(currSldIndex);
			
			setTimeout(function () {

				self.activeCaptionAnimationIn();
				self.activeSliderAnimationIn();
				self.updateActiveNav();
				self.animating = false;

			}, 400);

		}		

	},

	prevSlide: function () {

		console.log('prev');

	}

}

window.Slider = new Slider();