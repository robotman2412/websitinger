
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
var aceEditor = null;
var displayHtmlElem;
var aceEditorElem;

var editorPanelElem;
var cpuViewPanelElem;
var debuggerPanelElem;

var templateBuilder;
var authId = null;

function cpuc_start() {
	templateBuilder = document.getElementById("template_builder");
	
	editorPanelElem = document.getElementById("editor_panel");
	cpuViewPanelElem = document.getElementById("cpuview_panel");
	debuggerPanelElem = document.getElementById("debugger_panel");
	
	cpuSelected = "real_r2";
	nextTabId = 1;
	openTabElem = document.getElementById("open_tab");
	tabHolderElem = document.getElementById("tab_holder");
	tabHandleHolderElem = document.getElementById("tab_handle_holder");
	displayHtmlElem = document.getElementById("display_html");
	aceEditorElem = document.getElementById("ace_edit");
	openTabId = -1;
	welcome();
	
	webSoc = new WebSocket("wss://robot.scheffers.net/cpu_control.ws/");
	webSoc.onopen = ws_open;
	webSoc.onclose = ws_close;
	webSoc.onerror = ws_error;
	webSoc.onmessage = ws_message;
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
	authId = user.getAuthResponse().id_token;
	if (webSoc.readyState) {
		msg = {
			id_token: authId
		}
		webSoc.send(JSON.stringify(msg));
	}
}

function loginInfo() {
	openHtmlTab("/special/cpuc/login_info.html", "Why sign in?");
}

function welcome() {
	openHtmlTab('/special/cpuc/welcome.html', 'Welcome to CPU control!');
}

function examples() {
	openHtmlTab('/special/cpuc/examples.html', 'examples');
}

function interact_r2() {
	openHtmlTab('/special/cpuc/interact_r2.html', 'play with Rev2');
}

function new_r2_asm() {
	openEditableTab("/special/cpuc/stub_r2.asm", "gr8cpurev2", "new Rev2.asm");
}

function new_r3_asm() {
	openEditableTab("/special/cpuc/stub_r3.asm", "gr8cpurev2", "new Rev3.asm");
}

function new_r3_c() {
	openEditableTab("/special/cpuc/stub_r3.c", "c_cpp", "new Rev3.c");
}

function new_r3_py() {
	openEditableTab("/special/cpuc/stub_r3.py", "python", "new Rev3.py");
}

function createEditableTab0(content, resourceType, tabName) {
	var id = nextTabId;
	nextTabId++;
	tabIndexById[id] = tabIdByIndex.length;
	tabIdByIndex[tabIdByIndex.length] = id;
	templateBuilder.innerHTML += "<div id=\"tab_" + id + "_handle\" class=\"tab-handle\" onclick=\"focusTab(" + id + ", event)\" oncontextmenu=\"tabContext(" + id + ", event)\">"
								  + tabName + "&nbsp;<img onclick=\"closeTab(" + id + ", event)\" class=\"tab-handle-close\" src=\"/data/close_simple.png\"></div>";
	tabHandleHolderElem.appendChild(templateBuilder.firstChild);
	tabs[id] = {
		"editable": true,
		"type": resourceType,
		"handle": document.getElementById("tab_" + id + "_handle"),
		"name": tabName,
		"content": content,
		"selection": null
	};
	focusTab(id);
	return tabs[id];
}

function createEditableTab(resourceType, tabName) {
	var id = nextTabId;
	nextTabId++;
	tabIndexById[id] = tabIdByIndex.length;
	tabIdByIndex[tabIdByIndex.length] = id;
	templateBuilder.innerHTML += "<div id=\"tab_" + id + "_handle\" class=\"tab-handle\" onclick=\"focusTab(" + id + ", event)\" oncontextmenu=\"tabContext(" + id + ", event)\">"
								  + tabName + "&nbsp;<img onclick=\"closeTab(" + id + ", event)\" class=\"tab-handle-close\" src=\"/data/close_simple.png\"></div>";
	tabHandleHolderElem.appendChild(templateBuilder.firstChild);
	tabs[id] = {
		"editable": true,
		"type": resourceType,
		"handle": document.getElementById("tab_" + id + "_handle"),
		"name": tabName,
		"content": "",
		"selection": null
	};
	focusTab(id);
	return tabs[id];
}

function createHtmlTab(content, tabName) {
	var id = nextTabId;
	nextTabId++;
	tabIndexById[id] = tabIdByIndex.length;
	tabIdByIndex[tabIdByIndex.length] = id;
	templateBuilder.innerHTML += "<div id=\"tab_" + id + "\">" + content + "</div>";
	tabHolderElem.appendChild(templateBuilder.firstChild);
	templateBuilder.innerHTML += "<div id=\"tab_" + id + "_handle\" class=\"tab-handle\" onclick=\"focusTab(" + id + ", event)\" oncontextmenu=\"tabContext(" + id + ", event)\">"
								  + tabName + "&nbsp;<img onclick=\"closeTab(" + id + ", event)\" class=\"tab-handle-close\" src=\"/data/close_simple.png\"></div>";
	tabHandleHolderElem.appendChild(templateBuilder.firstChild);
	tabs[id] = {
		"editable": false,
		"elem": document.getElementById("tab_" + id),
		"handle": document.getElementById("tab_" + id + "_handle"),
		"name": tabName
	};
	focusTab(id);
	return tabs[id];
}

function openHtmlTab(resource, tabName, onSuccess) {
	var close = {};
	for (id in tabs) {
		if (!tabs[id].editable) {
			var tab = tabs[id];
			if (tab.resource != undefined && tab.resource != null && tab.resource === "ERR_OPEN::" + resource) {
				close[id] = true;
			}
		}
	}
	for (id in close) {
		closeTab(id);
	}
	for (id in tabs) {
		if (!tabs[id].editable) {
			var tab = tabs[id];
			if (tab.resource != undefined && tab.resource != null && tab.resource === resource) {
				focusTab(id);
				return;
			}
		}
	}
	var req = new XMLHttpRequest();
	req.open("GET", resource);
	req.onload = function(e) {
		if (req.status === 200) {
			createHtmlTab(req.responseText, tabName).resource = resource;
			if (onSuccess != undefined && onSuccess != null) {
				onSuccess();
			}
		} else {
			console.error(req.statusText);
			createHtmlTab("<center><h3>Oops!</h3><p>The tab could not be opened because it does not exist.</p></center>", tabName + " (not opened)").resource = "ERR_OPEN::" + resource;
		}
	}
	req.onerror = function (e) {
		console.error(req.statusText);
		createHtmlTab("<center><h3>Oops!</h3><p>The tab could not be opened because of an error.</p></center>", tabName + " (not opened)").resource = "ERR_OPEN::" + resource;
	};
	req.send(null);
}

function openEditableTab(resource, resourceType, tabName, onSuccess) {
	var close = {};
	for (id in tabs) {
		if (tabs[id].editable) {
			var tab = tabs[id];
			if (tab.resource != undefined && tab.resource != null && tab.resource === "ERR_OPEN::" + resource) {
				close[id] = true;
			}
		}
	}
	for (id in close) {
		closeTab(id);
	}
	var req = new XMLHttpRequest();
	req.open("GET", resource);
	req.onload = function(e) {
		if (req.status === 200) {
			createEditableTab0(req.responseText, resourceType, tabName).resource = resource;
			if (onSuccess != undefined && onSuccess != null) {
				onSuccess();
			}
		} else {
			console.error(req.statusText);
			createHtmlTab("<center><h3>Oops!</h3><p>The tab could not be opened because it does not exist.</p></center>", tabName + " (not opened)").resource = "ERR_OPEN::" + resource;
		}
	}
	req.onerror = function (e) {
		console.error(req.statusText);
		createHtmlTab("<center><h3>Oops!</h3><p>The tab could not be opened because of an error.</p></center>", tabName + " (not opened)").resource = "ERR_OPEN::" + resource;
	};
	req.send(null);
}

function closeTab(id, event) {
	if (event != undefined && event != null) {
		event.stopPropagation();
	}
	var index = tabIndexById[id];
	if (id == openTabId) {
		if (tabs[id].editable) {
			aceEditor.destroy();
			aceEditorElem.setAttribute("class", "ace-editor");
			aceEditorElem.style.display = "none";
		}
		else
		{
			displayHtmlElem.innerHTML = "";
		}
	}
	else if (!tabs[id].editable) {
		tabHolderElem.removeChild(tabs[id].elem);
	}
	tabHandleHolderElem.removeChild(tabs[id].handle);
	if (tabIdByIndex.length == 1) {
		tabIdByIndex = [];
		tabIndexById = {};
		tabs = {};
		openTabId = -1;
		displayHtmlElem.innerHTML = "<center><h3>No tabs are open.</h3><p>When you open a tab, it will appear here.</p></center>";
	}
	else
	{
		delete tabs[id];
		delete tabIndexById[id];
		for (i = index ; i < tabIdByIndex.length - 1; i++) {
			tabIdByIndex[i] = tabIdByIndex[i + 1];
			tabIndexById[tabIdByIndex[i]] = i;
		}
		delete tabIdByIndex[tabIndexById];
		tabIdByIndex.length --;
		if (id == openTabId) {
			openTabId = -1;
			if (index == 0) {
				focusTab(tabIdByIndex[0]);
			}
			else
			{
				focusTab(tabIdByIndex[index - 1]);
			}
		}
	}
}

function focusTab(id, event) {
	if (event != undefined && event != null) {
		event.stopPropagation();
	}
	if (openTabId == id) {
		return;
	}
	if (openTabId != -1) {
		if (tabs[openTabId].editable) {
			aceEditor.destroy();
			aceEditorElem.setAttribute("class", "ace-editor");
			aceEditorElem.style.display = "none";
			tabs[openTabId].content = aceEditor.getValue();
			tabs[openTabId].cursor = aceEditor.getCursorPosition();
			tabs[openTabId].selection = aceEditor.selection.toJSON();
		}
		else
		{
			tabHolderElem.appendChild(tabs[openTabId].elem);
		}
		tabs[openTabId].handle.setAttribute("class", "tab-handle");
	}
	else
	{
		displayHtmlElem.innerHTML = "";
	}
	tabs[id].handle.setAttribute("class", "tab-handle-active");
	if (tabs[id].editable) {
		aceEditorElem.style.display = "block";
		aceEditor = ace.edit("ace_edit");
		aceEditor.setTheme("ace/theme/monokai");
		aceEditor.session.setMode("ace/mode/" + tabs[id].type);
		aceEditor.session.insert(aceEditor.getCursorPosition(), tabs[id].content);
		aceEditor.setFontSize("20px");
		if (tabs[id].selection != null) {
			aceEditor.selection.fromJSON(tabs[id].selection);
		}
	}
	else
	{
		displayHtmlElem.appendChild(tabs[id].elem);
	}
	openTabId = id;
}

function tabContext(id, event) {
	if (event != undefined && event != null) {
		event.stopPropagation();
	}
}

function closeAllTabs() {
	
}

function tabMenu(event) {
	
}

function tx(obj) {
	webSoc.send(JSON.stringify(obj));
	console.log("-> " + JSON.stringify(obj));
}

var nextStuff;
var submitPid;

function submitJobTest() {
	var respid = "i_job_0";
	tx({
		submit_job: {
			type: "ShowMessage",
			cpu: "GR8CPURev2Breadboard",
			name: "Job tests!",
			respid: respid
		}
	});
	nextStuff = submitJobSupplyProgram;
}

function submitJobSupplyProgram(data) {
	if (data.ack_job) {
		if (data.ack_job.action === "ok") {
			submitPid = data.ack_job.pid;
			tx({
				continue_job: {
					action: "supply_program",
					pid: submitPid,
					program: "TestProgram0"
				}
			});
			nextStuff = submitJobVerify;
		}
		else
		{
			console.error(data.error);
			nextStuff = null;
		}
	}
}

function submitJobVerify(data) {
	if (data.continue_job) {
		if (data.continue_job.action === "await_verify") {
			tx({
				continue_job: {
					action: "verify",
					pid: submitPid
				}
			});
			nextStuff = null;
		}
		else if (data.continue_job.action === "error") {
			console.error(data.error);
			nextStuff = null;
		}
	}
}

function ws_open() {
	if (authId != null) {
		msg = {
			id_token: authId
		}
		webSoc.send(JSON.stringify(msg));
	}
}

function ws_error() {
	
}

function ws_close() {
	
}

function ws_message(event) {
	console.log("<- " + event.data);
	if (nextStuff) {
		nextStuff(JSON.parse(event.data));
	}
}













