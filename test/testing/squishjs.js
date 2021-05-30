
var codeInput;
var codeOutput;
var shortenInput;
var lambdaInput;

var doShorten = false;
var doLambda = false;

var rawInput;
var rawOutput;
var bitsOfCode;

function squishLoaded() {
	codeInput = document.getElementById("squish_in");
	codeOutput = document.getElementById("squish_out");
	shortenInput = document.getElementById("squish_shorten_names");
	lambdaInput = document.getElementById("squish_to_lambda");
}

function squishCode() {
	doShorten = shortenInput.checked;
	doLambda = lambdaInput.checked;
	
	rawOutput = rawInput = codeInput.value;
	
	console.log(rawInput);
	
	// Remove line comments.
	rawInput = rawInput.replaceAll(/\/\/.*?(?:\r\n|\r|\n)+/gi, "");
	console.log(rawInput);
	// Remove newlines.
	rawInput = rawInput.replaceAll(/(?:\r\n|\r|\n)+/gi, " ");
	console.log(rawInput);
	// Remove block comments.
	rawInput = rawInput.replaceAll(/\/\*.*?\*\/(?:)/gi, " ");
	console.log(rawInput);
	
	// Split into bits.
	bitsOfCode = getBits(rawInput);
	
	// Remove unnecessary keywords.
	replace(/(?:let|var)\s+([^;]+?[=+-\/<>~][^;]+?);/gi, "$1;");
	// Remove unnecessary spacing.
	replace(/^\s+|\s+$/gi, "");
	console.log(rawOutput);
	replace(/\s*([+\-=?;:\\|,.<>''""1234567890!@#$%^&()~\[\]{}])\s*/gi, "$1");
	console.log(rawOutput);
	replace(/(?:([^\s\/])\s*)?\*(?:\s*([^\s\/]))?/gi, "$1*$2");
	replace(/(?:([^\s*])\s*)?\/(?:\s*([^\s*]))?/gi, "$1/$2");
	console.log(rawOutput);
	if (doLambda) {
		// Convert function to lambda.
		//replaceCode(/function\s+(.+?)\((.*?)\){/gi, "}", "$1=($2)=>{$@};");
		replace(/function\s*\((.*?)\){/gi, "($1)=>{");
		console.log(rawOutput);
		// Shorten lambda with only one line.
		replaceCode("{return", "}", "$@");
		// Shorten immediate usage.
		//replaceCode("()=>", "", "$@");
	}
	// Remove unnecessary semicolons.
	replace(/;;+/gi, ";");
	replace(/;}/gi, "}");
	console.log(rawOutput);
	
	codeOutput.value = rawOutput;
}

function getCodeClosing(raw, type) {
	
}

function getStringClosing(raw, type) {
	var index = 0;
	while (raw.length > 0) {
		var char = raw[0];
		if (char == type) return index;
		else if (char == '\\') {
			raw = raw.substring(2);
			index += 2;
		} else {
			raw = raw.substring(1);
			index ++;
		}
	}
	return index;
}

function getStrChar(input) {
	var a = input.indexOf('"');
	var b = input.indexOf("'");
	var c = input.indexOf("/");
	if (a >= 0 && b >= 0 && c >= 0) {
		return a < b ? (a < c ? a : c) : (b < c ? b : c);
	} else if (a >= 0 && b >= 0) {
		return a < b ? a : b;
	} else if (a >= 0 && c >= 0) {
		return a < c ? a : c;
	} else if (b >= 0 && c >= 0) {
		return b < c ? b : c;
	} else if (a >= 0) {
		return a;
	} else if (b >= 0) {
		return b;
	} else if (c >= 0) {
		return c;
	} else {
		return -1;
	}
}

function getBits(input) {
	var index = getStrChar(input);
	if (index < 0) return [input];
	var list = [];
	var pre = "";
	while (index >= 0) {
		if (index == 0 && (input[0] != '/' || pre.match(/[^a-z0-9_\s]\s*$/i))) {
			index = getStringClosing(input.substring(1), input[0]) + 1;
			list.push(input.substring(0, index + 1));
			pre = input.substring(0, index + 1);
			input = input.substring(index + 1);
		} if (index == 0) {
			index = getStrChar(input.substring(1));
			if (index >= 0) index ++;
			else index = input.length;
			list.push(input.substring(0, index));
			pre = input.substring(0, index);
			input = input.substring(index);
		}else {
			list.push(input.substring(0, index));
			pre = input.substring(0, index);
			input = input.substring(index);
		}
		index = getStrChar(input);
	}
	list.push(input);
	return list;
}

function replace(pattern, replacement) {
	var dirty = false;
	rawOutput = "";
	for (i in bitsOfCode) {
		if (bitsOfCode[i].match(/[^''""\/]$/i)) {
			var n = bitsOfCode[i].replace(pattern, replacement);
			dirty |= n != bitsOfCode[i];
			bitsOfCode[i] = n;
		}
		rawOutput += bitsOfCode[i];
	}
	return dirty
}

function replaceRaw(pattern, replacement) {
	rawOutput = rawOutput.replaceAll(pattern, replacement);
	bitsOfCode = getBits(rawOutput);
}

function replaceCode(pattern, close, replacement) {
}


