
var codeInput;
var codeOutput;
var shortenInput;
var lambdaInput;

var doShorten = false;
var doLambda = false;

var rawInput;
var rawOutput;
var bitsOfCode;

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
	bitsOfCode = getBits(rawInput);
	
	console.log(rawInput);
	
	// Remove line comments.
	replace(/\/\/.*?(?:\r\n|\r|\n)+/gi, "");
	console.log(rawInput);
	// Remove newlines.
	replace(/(?:\r\n|\r|\n)+/gi, " ");
	console.log(rawOutput);
	// Remove block comments.
	replace(/\/\*.*?\*\/(?:)/gi, " ");
	console.log(rawOutput);
	// Remove unnecessary keywords.
	replace(/let|var/gi, " ");
	// Remove unnecessary spacing.
	replace(/\s+/gi, " ");
	console.log(rawOutput);
	replace(/\s*([+\-=?;:\\,.<>''""1234567890!@#$%^&()~\[\]{}])\s*/gi, "$1");
	console.log(rawOutput);
	replace(/(?:([^\s\/])\s*)?\*(?:\s*([^\s\/]))?/gi, "$1*$2");
	replace(/(?:([^\s*])\s*)?\/(?:\s*([^\s*]))?/gi, "$1/$2");
	console.log(rawOutput);
	if (doLambda) {
		// Convert function to lambda.
		replace(/function\s+(.+?)\((.*?)\){/gi, "$1=($2)=>{");
		replace(/function\s*\((.*?)\){/gi, "($1)=>{");
		console.log(rawOutput);
	}
	// Remove unnecessary semicolons.
	replace(/;;+/gi, ";");
	console.log(rawOutput);
	
	codeOutput.value = rawInput;
}

function getBits(input) {
	
}

function replace(pattern, replacement) {
	
}











