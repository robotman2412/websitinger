
var codeInput;
var codeOutput;
var shortenInput;
var lambdaInput;

var doShorten = false;
var doLambda = false;

var rawInput;
var streamInput;
var streamOutput;

var functionRegex = /^function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)\s*\(\s*((?:\s*[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*\s*)(?:,\s*[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*\s*)*)?\s*\)\s*(?={)/g;
var argsRegex = /(?:\s*[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*\s*)/g;
var nameRegex = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
var spaceRegex = /\s|\r\n|\r|\n/g;

function squish_loaded() {
	codeInput = document.getElementById("squish_in");
	codeOutput = document.getElementById("squish_out");
	shortenInput = document.getElementById("squish_shorten_names");
	lambdaInput = document.getElementById("squish_to_lambda");
}

function squish_code() {
	doShorten = shortenInput.checked;
	doLambda = lambdaInput.checked;
	
	rawInput = codeInput.value;
	streamInput = rawInput;
	streamOutput = "";
}

function fetchLine() {
	var end;
	var start;
	
	for (start = 0; start < streamInput.length; start++) {
		if (streamInput[start] != ';' && streamInput[start] != ' ' && streamInput[start] != '\t')) {
			break;
		}
	}
	for (end = start; end < streamInput.length; end++) {
		if (streamInput[end] == ';') {
			break;
		}
	}
	
	var line = streamInput.substring(start, end);
	streamInput = streamInput.substring(end);
	return line;
}

function generateLambda(fnName, fnArgs, funcContent) {
	var out = "let " + fnName + "=(";
	if (fnArgs.length > 0) {
		out += fnArgs[0];
	}
	for (var i = 1; i < fnArgs.length; i++) {
		out += "," + fnArgs[i];
	}
	out += ")=>{" + funcContent + "};";
	return out;
}












