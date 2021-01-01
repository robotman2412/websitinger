
/*
 * Don't you hate it when text is improperly capitalised?
 * Well don't worry, because i have the ultimate unboogling algorithm for you!
 * Take any plaintext, e.g. "This Text HAS BEEN bOOgled,how could i let this happen?"
 * And the unboogler will magically unboogle it for you!
 * For example: "This text has been boogles, how could I let this happen?"
 *
 * Something not capitalised or formatted how it should be?
 * Add it to the replacement list!
 */

let knownDomains = [
	/([a-z][a-z0-9_]*\.)+(com|net|uk|nl|be|fr|eu)/gi,
	"com.google",
	"perpetual.pizza"
];

let replacementList = [
	[/[ \t]+/g, " "],
	
	replaceWord("i", "I"),
	replaceWord("youtube", "YouTube"),
	replaceWord("twitch", "Twitch"),
	
	[/[ \t]*,[ \t]*(?=[^ \t\r\n]|$)/g, ", "],
	[/[ \t]+\.[ \t]*(?=[^ \t\r\n]|$)/g, ". "],
	[/(^|[^.a-z0-9_])[a-z][a-z0-9_]*\.[a-z0-9]+(?=[^ \t\r\n.a-z0-9_]|$)/gi, domainCheck],
	[/!*(\?+!+)+\?*(?=[^?!]|$)/g, "?!?"],
	[/!!+/g, "!"],
	[/\?\?+/g, "?"],
	[/[?!][^?! \t\r\n]/g, (e)=>{
		return e[0] + " " + e[1];
	}],
	[/[?!.][ \r\n]+\w/gim, (e)=>{
		return e.toUpperCase();
	}]
];

function replaceWord(search, replacement) {
	return [new RegExp("(?<=\\W|^)" + escapeRegExp(search) + "(?=\\W|$)", "gim"), replacement];
}

function domainCheck(text) {
	var raw = text;
	if (raw[0].match(/\W/gi)) {
		raw = raw.substring(1);
	}
	if (raw.length < 3) {
		return text;
	}
	for (i in knownDomains) {
		var checker = knownDomains[i];
		
		if (raw == i) {
			return text.toLowerCase();
		}
		else if (raw.match(checker) != null) {
			var matches = raw.match(checker);
			if (matches.length == 1 && matches[0] == raw) {
				return text.toLowerCase();
			}
		}
	}
	return text.replace(/[ \t]*\.[ \t]*(?=[^ \t]|$)/gim, ". ");
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function unboogle(text) {
	text = text.toLowerCase().trim();
	text = replaceInString(text, 0, text[0].toUpperCase());
	for (i in replacementList) {
		text = text.replace(replacementList[i][0], replacementList[i][1]);
	}
	return text;
}

function replaceInString(text, index, replacement) {
	var pre = text.substring(0, index);
	var post = text.substring(index + replacement.length);
	return pre + replacement + post;
}

function unboogleTheElement() {
	var input = document.getElementById("unboogle");
	var output = document.getElementById("unboogled");
	output.innerHTML = escapeHtml(unboogle(input.value));
}
