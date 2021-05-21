
const scrollTimeSec = 1;
const scrollTimeMillis = scrollTimeSec * 1000;

var scrollingImages = {};

function registerImageScroll(scrollID, numImgs) {
	scrollingImages[scrollID] = {
		num: numImgs,
		currentIndex: 0,
		lastStart: 0
	};
}
