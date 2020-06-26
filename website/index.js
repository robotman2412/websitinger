
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
var templateBuilder;

function loaded() {
	
	outerContent = document.getElementById("outer_content");
	contentBackground = document.getElementById("content_background");
	leftOuterContent = document.getElementById("left_outer_content");
	rightOuterContent = document.getElementById("right_outer_content");
	innerContent = document.getElementById("inner_content");
	leftInnerContent = document.getElementById("left_inner_content");
	rightInnerContent = document.getElementById("right_inner_content");
	templateBuilder = document.getElementById("template_builder");
	
	setInterval(function() {
		var altfooter;
		if (isUserMobile) {
			altfooter = innerContent.getBoundingClientRect().height < window.innerHeight - 280;
		}
		else
		{
			altfooter = innerContent.getBoundingClientRect().height < window.innerHeight - 260;
		}
		var footer = document.getElementById("footer_outer");
		if (altfooter) {
			footer.setAttribute("class", "footer-o alt");
			footer.style.top = "";
		}
		else
		{
			footer.setAttribute("class", "footer-o");
			footer.style.top = innerContent.getBoundingClientRect().height + 75 + "px";
		}
		var space = Math.max(0, window.innerWidth - maxPXWidth);
		if (space == 0) {
			leftOuterContent.style.visibility = "hidden";
			outerContent.style.left = 0;
			outerContent.style.right = 0;
			contentBackground.style.left = 0;
			contentBackground.style.right = 0;
			footer.style.left = "0";
		}
		else if (space > sidebarPXRequired && leftEnabled) {
			leftOuterContent.style.visibility = "visible";
			var offs = sidebarPXWidth / 2;
			outerContent.style.left = space / 2 + offs + "px";
			outerContent.style.right = space / 2 - offs + "px";
			contentBackground.style.left = space / 2 + offs + "px";
			contentBackground.style.right = space / 2 - offs + "px";
			if (altfooter) {
				footer.style.left = sidebarPXWidth + "px";
			}
			else
			{
				footer.style.left = "0";
			}
		}
		else
		{
			leftOuterContent.style.visibility = "hidden";
			outerContent.style.left = space / 2 + "px";
			outerContent.style.right = space / 2 + "px";
			contentBackground.style.left = space / 2 + "px";
			contentBackground.style.right = space / 2 + "px";
			footer.style.left = "0";
		}
		var large = document.getElementById("enlarge_image");
		if (large) {
			var toobig;
			if (isUserMobile) {
				toobig = large.width >= window.innerWidth || large.height >= window.innerHeight * 0.79;
			}
			else
			{
				toobig = large.width >= window.innerWidth * 0.79 || large.height >= window.innerHeight * 0.79;
			}
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
	
	searchTemplates();
	
}

function enlargeImage(href) {
	var ins = "<div id=\"enlarge_outer\" onclick=\"clearEnlarge()\" class=\"img-large-backgnd\"><div class=\"img-large-inner\">"
				 +"<img onclick=\"event.stopPropagation()\" src=\"" + href + "\" id=\"enlarge_image\" class=\"img-large\">"
			 +"</div></div>";
	templateBuilder.innerHTML += ins;
	document.body.appendChild(templateBuilder.firstChild);
}

function clearEnlarge() {
	var large = document.getElementById("enlarge_outer");
	if (large) {
		large.setAttribute("class", "img-large-backgnd-away");
		setTimeout(function() {
			var remove = document.getElementById("enlarge_outer");
			remove.parentNode.removeChild(remove);
		}, 500);
	}
}

function searchTemplates() {
	var toReplace = document.getElementsByTagName("X-INCL");
	for (i = 0; i < toReplace.length; i++) {
		buildTemplate(toReplace[i]);
	}
}

function buildTemplate(elem) {
	var type = elem.getAttribute("type");
	var template = templates[type];
	var index = 0;
	var offset;
	templateBuilder.innerHTML += template.replace(/{{[^}]+}}}?/g, function (e) {
		const copySimple = /^copy\([^)]+\)$/g;
		const copyAdvanced = /^copy\([^)]+\).+$/g;
		var usefullstuff = e.substring(2, e.length - 2);
		if (usefullstuff === "innerHTML") {
			return elem.innerHTML;
		}
		else if (copySimple.test(usefullstuff)) {
			var toCopy = usefullstuff.substring(5, usefullstuff.length - 1);
			if (elem.hasAttribute(toCopy)) {
				return toCopy + "=\"" + elem.getAttribute(toCopy).replace("\"", "\\\"") + "\"";
			}
			else
			{
				return "";
			}
		}
		else if (copyAdvanced.test(usefullstuff)) {
			var indexial = usefullstuff.indexOf(')');
			var toCopy = usefullstuff.substring(5, indexial);
			var placement = usefullstuff.substring(indexial + 1);
			if (elem.hasAttribute(toCopy)) {
				return toCopy + "=\"" + placement.replace("%", elem.getAttribute(toCopy)).replace("\"", "\\\"") + "\"";
			}
			else
			{
				return "";
			}
		}
		else if (elem.hasAttribute(usefullstuff)) {
			return elem.getAttribute(usefullstuff);
		}
		else if (usefullstuff[0] === '{' && usefullstuff[usefullstuff.length - 1] === '}') {
			try {
				//this eval is safe, the templates object it comes from is frozen and automatically generated by the server
				return eval(e.substring(3, e.length - 3));
			} catch(error) {
				console.error(error);
				return e;
			}
		}
		else
		{
			console.error("Invalid template insert:", e, elem, template);
			return e;
		}
	});
	while (templateBuilder.childElementCount > 0) {
		elem.parentNode.insertBefore(templateBuilder.firstChild, elem);
	}
	elem.parentNode.removeChild(elem);
}







