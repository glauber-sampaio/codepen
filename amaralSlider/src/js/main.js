

function Slider() {

	TweenLite.defaultEase = Expo.easeOut;

	this.init();

}

Slider.prototype = {

	init: function () {

		console.log('slider');

	}

}



window.Slider = new Slider();