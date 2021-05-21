
let defaultFontSize = 16;
let pageHeaderOffset = defaultFontSize * 1.34;
var templateBuilderElem;
var pageHeaderElem;
var backgroundElem;
var lastTop;
var lastHeaderTop;
var isEnlarged = false;

function loaded() {
	setInterval(srollHandler, 10);
	
	backgroundElem = document.getElementById("outer_content");
	templateBuilderElem = document.getElementById("template_builder");
	pageHeaderElem = document.getElementById("page_header_wrapper");
	
	document.onkeydown = function(event) {
		if (event.key === "Escape") {
			clearEnlarge();
		}
	}
	
	document.onmousedown = function(event) {
		var elem = event.path[0];
		if (elem.nodeName === "IMG" || elem.nodeName === "IMAGE") {
			for (i = 0; i < elem.classList.length; i++) {
				if (elem.classList[i] === "may-big") {
					enlargeImage(elem.getAttribute("src"), elem.getAttribute("alt"));
					break;
				}
			}
		}
		else if (elem.nodeName === "CANVAS") {
			for (i = 0; i < elem.classList.length; i++) {
				if (elem.classList[i] === "may-big") {
					enlargeImage(elem.toDataURL("image/png", 1.0), "Generated image.");
					break;
				}
			}
		}
	}
}

function srollHandler() {
	var top = backgroundElem.scrollTop;
	var headerTop = Math.max(0, pageHeaderOffset - top);
	if (top != lastTop) {
		lastTop = top;
		var offs = top * -0.2;
		backgroundElem.style["background-position"] = "50% " + offs + "px";
	}
	if (headerTop != lastHeaderTop) {
		lastHeaderTop = headerTop;
		pageHeaderElem.style.top = headerTop + "px";
	}
}

function enlargeImage(imageSrc, imageAlt) {
	if (isEnlarged) {
		console.warn("enlargeImage() called when an image is already enlarged!");
		return;
	}
	isEnlarged = true;
	var content =
		'<div id="large_image" class="img-large" onclick="clearEnlarge()">'+
			'<div class="img-large-wrapper">'+
				'<div class="img-large-clear" onclick="clearEnlarge();event.stopPropagation()">'+
					'<img class="img-large-clear-ico" src="/special/layouttest/close.png">'+
				'</div>'+
				'<img class="img-large-img" onclick="event.stopPropagation()" src="' + imageSrc + '" alt="' + imageAlt + '">'+
				'<p style="margin:0;" onclick="event.stopPropagation()">' + imageAlt + '</p>'+
			'</div>'+
		'</div>';
	templateBuilderElem.innerHTML += content;
	var enlargeElem = document.getElementById("large_image");
	backgroundElem.appendChild(enlargeElem);
}

function clearEnlarge() {
	var enlargeElem = document.getElementById("large_image");
	enlargeElem.style.animation = "img-large-fade-out 0.5s linear";
	setTimeout(() => {
		enlargeElem.parentNode.removeChild(enlargeElem);
		isEnlarged = false;
	}, 250);
}




