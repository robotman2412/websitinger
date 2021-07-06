
var inElem;
var outElem;
var lastInput;

/* lol who utils */

function escapeHTML(unsafe) {
	return unsafe
		.replace('&', "&amp;")
		.replace('<', "&lt;")
		.replace('>', "&gt;")
		.replace('"', "&quot;")
		.replace('\'', "&#039;");
}

function countMatches(str, expr) {
	var iter = (str.matchAll(expr) || []);
	var num = 0;
	while (!iter.next().done) num ++;
	return num;
}

function crossApply(list, apply, restrictive) {
	list = {...list};
	var done = [];
	for (x in list) {
		for (y in list) {
			if (x != y && done.indexOf([x, y]) == -1) {
				apply(x, y);
				done.push([x, y]);
			}
		}
	}
}

function iFuckingHateRegex(str) {
	return str.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* lol who compresses */

function findRepeatedText(raw, excluded) {
	if (!excluded) excluded = [];
	for (i in excluded) raw = raw.replaceAll(iFuckingHateRegex(excluded[i]), "");
	var candidates = {};
	var iterno = 3;
	for (i = 0; i < raw.length - 3; i++) {
		var str = raw.substring(i, i + 3);
		if (!candidates[str]) candidates[str] = {times: 0, first: raw.indexOf(str)};
		candidates[str].times ++;
	}
	for (var iter = 0; iter < iterno; iter++) {
		crossApply(candidates, (a, b) => {
			if (a.substring(1) == b.substring(0, b.length - 1)) {
				var str = a[0] + b;
				var times = countMatches(raw, iFuckingHateRegex(str));
				candidates[str] = {times: times, first: raw.indexOf(str), a: a, b: b};
			}
		});
		for (str in candidates) {
			candidates[str].value = candidates[str].times * str.length;
			if (candidates[str].times <= 2) {
				delete candidates[str];
			}
		}
	}
	var filtered = [];
	for (str in candidates) {
		filtered.push({str: str, value: candidates[str].value});
	}
	filtered.sort((b, a)=>a.value-b.value);
	//filtered.splice(filtered.length / 6);
	return filtered[0];
}

function compressText(raw) {
	var iterno = 3;
	var excluded = [];
	var candidates = [];
	for (var iter = 0; iter < iterno; iter++) {
		var cand = findRepeatedText(raw, excluded);
		if (!cand) break;
		excluded.push(cand.str);
		candidates.push(cand);
	}
	console.log(candidates);
	return "";
}

/* lol who edits */

function lolWhoCompresses() {
	inElem = document.getElementById("in");
	outElem = document.getElementById("out");
	edit();
}

function edit() {
	var input = inElem.value;
	if (lastInput != input) {
		outElem.value = compressText(input);
		lastInput = input;
	}
}
