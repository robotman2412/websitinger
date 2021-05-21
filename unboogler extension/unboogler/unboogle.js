
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
	/([a-z][a-z0-9_]*\.)+(com|net|uk|nl|be|fr|eu|png|jpg|jpeg|txt|java|c|cxx|cpp|h|hxx|hpp|lua|js|jsw|py|pyw)/gi,
	"com.google",
	"perpetual.pizza"
];
var custom_words = [];
let replacementList = [
	[/[ \t]+/g, " "],
	
	captialise("i"),
	replaceWord("youtube", "YouTube"),
	captialise("twitch"),
	captialise("pixar"),
	captialise("disney"),
	captialise("factorio"),
	captialise("minecraft"),
	captialise("commodore"),
	captialise("america"),
	replaceWord("great brittain", "Great Brittain"),
	captialise("brittain"),
	captialise("christmas"),
	captialise("netherland"),
	captialise("netherlands"),
	captialise("belguim"),
	captialise("christmas"),
	captialise("c++"),
	captialise("java"),
	captialise("kotlin"),
	captialise("perl"),
	captialise("c"),
	replaceWord("ai", "AI"),
	replaceWord("q&a", "Q&A"),
	
	[/[ \t]*,[ \t]*(?=[^ \t\r\n0-9]|$)/g, ", "],
	[/[ \t]+\.[ \t]*(?=[^ \t\r\n0-9]|$)/g, ". "],
	[/(^|[^.a-z0-9_])[a-z][a-z0-9_]*\.[a-z0-9]+(?=[^ \t\r\n.a-z0-9_]|$)/gi, domainCheck],
	[/!*(\?+!+)+\?*(?=[^?!]|$)/g, "?!?"],
	[/!!+/g, "!"],
	[/\?\?+/g, "?"],
	[/(?<=[^a-z0-9A-Z']|^)[qwrtpsdfghklzxcvbnm]{1,4}(?=\W|$)/gm, (e)=>{return e.toUpperCase();}],
	[/[?!][^?! \t\r\n]/g, (e)=>{
		return e[0] + " " + e[1];
	}],
	[/[?!.\-:;\])|][ \r\n]+\w/gim, (e)=>{
		return e.toUpperCase();
	}],
	[/["\[][ \r\n]+\w/gim, (e)=>{
		return e.toUpperCase();
	}],
];

function replaceWord(search, replacement) {
	return [new RegExp("(?<=\\W|^)" + escapeRegExp(search) + "(?=\\W|$)", "gim"), replacement];
}

function captialise(word) {
	return [new RegExp("(?<=\\W|^)" + escapeRegExp(word) + "(?=\\W|$)", "gim"), word[0].toUpperCase() + word.substring(1)];
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
	if (text == null || text == undefined || text.length < 3) {
		return "";
	}
	text = text.toLowerCase().trim();
	text = replaceInString(text, 0, text[0].toUpperCase());
	let toTry = replacementList.concat(custom_words);
	for (i in toTry) {
		text = text.replace(toTry[i][0], toTry[i][1]);
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

function unboogleTitles() {
	var rawTexts = document.getElementsByTagName("yt-formatted-string");
	rawTexts = Array.prototype.slice.call(rawTexts);
	rawTexts.concat(Array.prototype.slice.call(document.getElementsByTagName("span")));
	var texts = [];
	for (i in rawTexts) {
		var elem = rawTexts[i];
		var elemID = elem.getAttribute("id");
		var elemParentClass = elem.parentNode != null ? elem.parentNode.getAttribute("class") : null;
		if (elemID != null && elemID.indexOf("title") != -1) {
			texts = texts.concat(elem);
		}
		else if (elemParentClass != null && elemParentClass.indexOf("title") != -1) {
			texts = texts.concat(elem);
		}
	}
	//console.log(texts);
	for (i in texts) {
		texts[i].innerHTML = escapeHtml(unboogle(texts[i].innerText));
	}
}

function updateCustom() {
	chrome.storage.sync.get(['custom_words'], function(result) {
		if (result == null || result.custom_words == null) {
			return;
		}
		var stuff = JSON.parse(result.custom_words);
		for (i in stuff) {
			stuff[i] = replaceWord(stuff[i][0], stuff[i][1]);
		}
		custom_words = stuff;
	});
}

setInterval(unboogleTitles, 2000);
//setInterval(updateCustom, 4000);
