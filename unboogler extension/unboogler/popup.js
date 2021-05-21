
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function loaded() {
	setInterval(checkNum, 4000);
}

function checkNum() {
	chrome.storage.sync.get(['custom_words'], function(result) {
		let elem = document.getElementById("numwords");
		elem.innerHTML = escapeHtml(result.custom_words);
		let stuff = JSON.parse(result.custom_words);
		let num = stuff.length;
		//elem.innerHTML = num + " custom word" + (num != 1 ? "s" : "");
	});
}

function nowWrite(stuff) {
	let num = stuff.length;
	let elem = document.getElementById("numwords");
	//elem.innerHTML = num + " custom word" + (num != 1 ? "s" : "");
	chrome.storage.sync.set({custom_words: JSON.stringify(stuff)}, function() {
		console.log('Value is set to ' + value);
	});
}

function addCustomWord() {
	let toAdd = document.getElementById("custom_word_input").value;
	chrome.storage.sync.get(['custom_words'], function(result) {
		var stuff = JSON.parse(result.custom_words);
		for (i in stuff) {
			if (stuff[i][0] == toAdd.toLowerCase()) {
				stuff[i][1] = toAdd;
				nowWrite(stuff);
				return;
			}
		}
		stuff.concat([[toAdd.toLowerCase(), toAdd]]);
		nowWrite(stuff);
	});
}
