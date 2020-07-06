
var cpuSelected;
var tabs = {};
var tabIdByIndex = [];
var tabIndexById = {};
var webSoc = {};
var nextTabId;

var openTabText = "";
var openTabElem;
var openTabId;

var tabHolderElem;
var tabHandleHolderElem;

function cpuc_start() {
	cpuSelected = "real_r2";
	webSoc = new WebSocket("wss://robot.scheffers.net/cpu_control_ws");
	webSoc.onopen = ws_open;
	webSoc.onclose = ws_close;
	webSoc.onerror = ws_error;
	webSoc.onmessage = ws_message;
	nextTabId = 1;
	openTabElem = document.getElementById("open_tab");
	tabHolderElem = document.getElementById("tab_holder");
	tabHandleHolderElem = document.getElementById("tab_handle_holder");
	openTabId = 0;
	tabIdByIndex[0] = 0;
	tabIndexById[0] = 0;
	tabs[0] = {
		"editable": true,
		"type": "text",
		"elem": document.getElementById("tab_0"),
		"handle": document.getElementById("tab_0_handle"),
		"name": "Nothing here yet!"
	};
	setInterval(function() {
		if (openTabId != -1) {
			var newText = openTabElem.innerText;
			if (newText !== openTabText) {
				openTabText = newText;
				var restore = saveCaretPosition(openTabElem);
				openTabElem.innerHTML = coloriseText(newText, tabs[openTabId].type);
				restore();
			}
		}
	}, 100);
}

function cpuc_sel(elem) {
	var nextSelected = elem.getAttribute("value");
	var oldElem = document.getElementById("sel_" + cpuSelected);
	oldElem.setAttribute("class", "select-optn noselect");
	elem.setAttribute("class", "select-optn on noselect");
	cpuSelected = nextSelected;
}

function onSignIn(user) {
	var profile = user.getBasicProfile();
//	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//	console.log('Name: ' + profile.getName());
//	console.log('Image URL: ' + profile.getImageUrl());
//	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	var authId = user.getAuthResponse().id_token;
}

function coloriseText(raw, type) {
	return raw.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

function loginInfo() {
	openTab("/special/cpuc/info_login.html", true, "html");
}

function createTab(resourceType, tabName) {
	var id = nextTabId;
	nextTabId++;
	tabIndexById[id] = tabIdByIndex.length;
	tabIdByIndex[tabIdByIndex.length] = id;
	tabHolderElem.innerHTML += "<div id=\"tab_" + id + "\"></div>";
	tabHandleHolderElem.innerHTML += "<div id=\"tab_" + id + "_handle\" class=\"tab-handle\" onclick=\"focusTab(" + id + ", event)\" oncontextmenu=\"tabContext(" + id + ", event)\">"
								  + tabName + "<img onclick=\"closeTab(" + id + ", event)\" class=\"tab-handle-close\" src=\"/data/close_simple.png\"></div>";
	tabs[id] = {
		"editable": true,
		"type": "text",
		"elem": document.getElementById("tab_" + id),
		"handle": document.getElementById("tab_" + id + "_handle")
	};
	focusTab(id)
}

function openTab(resource, isReadOnly, resourceType) {
	
}

function closeTab(id, event) {
	
}

function focusTab(id, event) {
	if (openTabId = id) {
		return;
	}
	if (openTabId != -1) {
		if (tabs[openTabId].editable) {
			tabs[openTabId].elem.innerHTML = openTabElem.innerHTML;
		}
		tabs[openTabId].handle.setAttribute("class", "tab-handle");
	}
	tabs[id].handle.setAttribute("class", "tab-handle-active");
	openTabElem.innerHTML = tabs[id].elem.innerHTML;
	openTabElem.setAttribute("contenteditable", tabs[id].editable);
	openTabId = id;
}

function tabContext(id, event) {
	
}

function ws_open() {
	
}

function ws_error() {
	
}

function ws_close() {
	
}

function ws_message() {
	
}

function calculateSelectionStuff(text, index) {
	
}

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function saveCaretPosition(context){
    var selection = window.getSelection();
	console.log(selection);
    var range = selection.getRangeAt(0);
    range.setStart(  context, 0 );
    var len = range.toString().length;
	//var len = getCaretCharacterOffsetWithin(context);

    return function restore(){
        var pos = getTextNodeAtPosition(context, len);
        selection.removeAllRanges();
        var range = new Range();
        range.setStart(pos.node ,pos.position);
        selection.addRange(range);

    }
}

function getTextNodeAtPosition(root, index){
    var lastNode = null;

    var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT,function next(elem) {
        if(index >= elem.textContent.length){
            index -= elem.textContent.length;
            lastNode = elem;
            return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    var c = treeWalker.nextNode();
    return {
        node: c? c: root,
        position: c? index:  0
    };
}
