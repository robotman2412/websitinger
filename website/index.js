
var maxPXWidth = 1000;
var sidebarPXRequired = 350;
var sidebarPXWidth = 300;
var outerContent;
var leftOuterContent;
var rightOuterContent;
var innerContent;
var leftInnerContent;
var rightInnerContent;
var leftEnabled = false;

function loaded() {
	outerContent = document.getElementById("outer_content");
	contentBackground = document.getElementById("content_background");
	leftOuterContent = document.getElementById("left_outer_content");
	rightOuterContent = document.getElementById("right_outer_content");
	innerContent = document.getElementById("inner_content");
	leftInnerContent = document.getElementById("left_inner_content");
	rightInnerContent = document.getElementById("right_inner_content");
	
	setInterval(function() {
		var space = Math.max(0, window.innerWidth - maxPXWidth);
		if (space == 0) {
			leftOuterContent.style.visibility = "hidden";
			outerContent.style.left = 0;
			outerContent.style.right = 0;
			contentBackground.style.left = 0;
			contentBackground.style.right = 0;
		}
		else if (space > sidebarPXRequired && leftEnabled) {
			leftOuterContent.style.visibility = "visible";
			var offs = sidebarPXWidth / 2;
			outerContent.style.left = space / 2 + offs + "px";
			outerContent.style.right = space / 2 - offs + "px";
			contentBackground.style.left = space / 2 + offs + "px";
			contentBackground.style.right = space / 2 - offs + "px";
		}
		else
		{
			leftOuterContent.style.visibility = "hidden";
			outerContent.style.left = space / 2 + "px";
			outerContent.style.right = space / 2 + "px";
			contentBackground.style.left = space / 2 + "px";
			contentBackground.style.right = space / 2 + "px";
		}
		var large = document.getElementById("enlarge_image");
		if (large) {
			var toobig = large.width >= window.innerWidth * 0.79 || large.height >= window.innerHeight * 0.79;
			if (toobig) {
				large.setAttribute("class", "img-large-toolarge");
			}
			else
			{
				large.setAttribute("class", "img-large");
			}
		}
	}, 5);
	
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
					enlargeImage(elem.getAttribute("src"));
					break;
				}
			}
		}
	}
}

function enlargeImage(href) {
	var ins = "<div id=\"enlarge_outer\" onclick=\"clearEnlarge()\" class=\"img-large-backgnd\"><div class=\"img-large-inner\">"
				 +"<img onclick=\"event.stopPropagation()\" src=\"" + href + "\" id=\"enlarge_image\" class=\"img-large\">"
			 +"</div></div>";
	document.getElementById("template_builder").innerHTML += ins;
	document.body.appendChild(document.getElementById("enlarge_outer"));
}

function clearEnlarge() {
	var large = document.getElementById("enlarge_outer");
	if (large) {
		large.setAttribute("class", "img-large-backgnd-away");
		setTimeout(function() {
			var remove = document.getElementById("enlarge_outer");
			remove.parentNode.removeChild(remove);
		}, 1000);
	}
}
