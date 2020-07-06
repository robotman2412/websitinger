
function includeAsmFrag(src, id, style) {
	var req = new XMLHttpRequest();
	req.open("GET", src);
	req.onload = function(e) {
		if (req.status === 200) {
			includeAsmFrag0(req.responseText, id, style);
		} else {
			console.error(req.statusText);
			document.getElementById(id).innerHTML = "Error loading assembly fragment.";
		}
	}
	req.onerror = function (e) {
		console.error(req.statusText);
		document.getElementById(id).innerHTML = "Error loading assembly fragment.";
	};
	req.send(null);
}

function includeAsmFrag0(asm, id, style) {
	var req = new XMLHttpRequest();
	req.open("GET", "/special/gr8cpu/" + style + ".txt");
	req.onload = function(e) {
		if (req.status === 200) {
			putAsmFrag(asm, id, parseStyle(req.responseText));
		} else {
			console.error(req.statusText);
			document.getElementById(id).innerHTML = "Error loading assembly fragment.";
		}
	}
	req.onerror = function (e) {
		console.error(req.statusText);
		document.getElementById(id).innerHTML = "Error loading assembly fragment.";
	};
	req.send(null);
}

function parseStyle(raw) {
	var style = {};
	raw = raw.replace("\r\n", "\n");
	raw = raw.replace("\r", "\n");
	var split = raw.split("\n");
	for (i = 0; i < split.length; i++) {
		var line = split[i];
		var indexial = line.indexOf(":");
		if (indexial != -1) {
			style[line.substring(0, indexial)] = line.substring(indexial + 1);
		}
	}
	return style;
}

function putAsmFrag(raw, id, style) {
	raw = raw.replace("<", "&lt;");
	raw = raw.replace(">", "&gt;");
	//raw = raw.replace(/\r\n/g, "\n");
	//raw = raw.replace(/\r/g, "\n");
	raw = raw.split("\n");
	for (i = 0; i < raw.length; i++) {
		while (raw[i].indexOf("\t") != -1) {
			raw[i] = raw[i].replace("\t", function(match, index) {
				if (index == 0) {
					return "    ";
				}
				var nextEndable = Math.floor(index / 4) * 4 + 4;
				return " ".repeat(nextEndable - index);
			});
		}
		var lastIndex = 0;
		while (1) {
			var firstMatch = null;
			var firstEnd = 0;
			var firstType = null;
			var first = raw[i].length;
			var line = raw[i];
			for (key in style) {
				var re = new RegExp(style[key], "giu");
				re.lastIndex = lastIndex;
				var res = re.exec(line);
				if (res !== null) {
					var index = res["index"];
					if (index < first) {
						first = index;
						firstEnd = re.lastIndex;
						firstMatch = res[0];
						firstType = key;
					}
				}
			}
			if (firstMatch === null) {
				break;
			}
			var pre = raw[i].substring(0, first);
			var post = raw[i].substring(firstEnd);
			raw[i] = pre + "<span class=\"" + firstType + "\">" + firstMatch + "</span>" + post; //insert the style
			lastIndex = firstEnd + 13 + 2 + 7 + firstType.length; //we must not forget the added shit
		}
	}
	document.getElementById(id).innerHTML = raw.join("<br>").replace(/ + (?=[^ ])/g, function (match) {
		return "&nbsp;".repeat(match.length - 1) + " ";
	});
}
