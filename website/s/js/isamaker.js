
function escapeHtml(unsafe) {
	return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

var isaDef = {
	metadata: {
		word_size: 8,
		processor_names: [
			"GR8CPU Rev3",
			"GR8CPUr3"
		],
		has_loaders: true,
		sorting: "hex"
	},
	load: [
	],
	instructions: [
		{
			name: "nop",
			verbose: "nop",
			type: "single_word",
			hex: "00",
			args: [],
			desc: ["Do nothing."],
			controls: ["STR"],
			manual_pos: 0
		}
	]
};

var metadata = {
	word_size: 8,
	processor_names: [
		"GR8CPU Rev3",
		"GR8CPUr3"
	],
	default_little_endian: true,
	has_loaders: true,
	sorting: "hex"
};

var loadList = {};

var insnList = {
	0: {
		name: "nop",
		verbose: "nop",
		type: "single_word",
		hex: "00",
		args: [],
		desc: ["Do nothing."],
		controls: ["STR"],
		manual_pos: 0,
		sorted_pos: 0
	}
};

var insnIdByIndex = [
	0, 1
];

var editingList = {
	1: {
		manual_pos: 1,
		sorted_pos: 1,
		args: []
	}
};

var lastInsnId = 1;
var lastSortedPos = 1;
var templateBuilder;

function startIsaMaker() {
	templateBuilder = document.getElementById("template_builder");
}

function checkHex(event) {
	return "0123456789abcdef".indexOf(event.key.toLowerCase()) != -1;
}

function checkParams(id) {
	var elem = document.getElementById("insn_" + id);
	var editing = editingList[id];
	var nameElem = document.getElementById("insn_" + id + "_name");
	var argsElem = document.getElementById("insn_" + id + "_args");
	var nameMapped = {};
	for (i in editing.args) {
		nameMapped[editing.args[i].name] = editing.args[i];
	}
	var argsOut = [];
	nameElem.value.replace(/%[^%]+%/g, function(e) {
		var name = e.substring(1, e.length - 1);
		if (nameMapped[name] == null || nameMapped[name] == undefined) {
			argsOut = argsOut.concat({
				name: name,
				type: {
					bits: metadata.word_size,
					is_little_endian: metadata.default_little_endian
				}
			});
		}
		else
		{
			argsOut = argsOut.concat(nameMapped[name]);
		}
	});
	editing.args = argsOut;
	editingList[id] = editing;
	argsElem.innerHTML = "";
	if (editing.args.length > 0) {
		argsElem.innerHTML += "Arguments:<br>";
		for (i in editing.args) {
			var arg = editing.args[i];
			var onChangeBit = "editingList[" + id + "].args[" + i + "].type.bits = parseInt(this.value)";
			var onChangeEndian = "editingList[" + id + "].args[" + i + "].type.is_little_endian = this.checked";
			argsElem.innerHTML += "<span class=\"insn-arg\">" + escapeHtml(arg.name) + "</span>"
								+ "<div class=\"indented\">"
								+ "Number of bits: <input type=\"number\" value=\"" + arg.type.bits + "\" onchange=\"" + onChangeBit + "\"></input><br>"
								+ "Is little endian: <input type=\"checkbox\"" + (arg.type.is_little_endian ? "checked" : "") + " onchange = \"" + onChangeEndian + "\"></input>"
								+ "</div>";
		}
	}
}

function updateIsa() {
	isaDef = {
		metadata: metadata,
		load: [],
		instructions: []
	};
	if (metadata.has_loaders) {
		for (i in loadList) {
			isaDef.load = isaDef.load.concat(loadList[i]);
		}
	}
	for (i in insnIdByIndex) {
		isaDef.instructions = isaDef.instructions.concat(insnList[i]);
	}
	var isaDefOut = document.getElementById("isa_def_json");
	isaDefOut.value = JSON.stringify(isaDef, null, 4);
}

function deleteInsn(id) {
	if (confirm("Really delete instruction $" + document.getElementById("insn_" + id + "_hex").value + "?")) {
		var elem = document.getElementById("insn_" + id);
		elem.parentNode.removeChild(elem);
		var manualPos = editingList[id].manual_pos;
		var sortedPos = editingList[id].sorted_pos;
		delete editingList[id];
		insnIdByIndex.splice(insnList[id], 1);
		delete insnList[id];
		for (i in editingList) {
			if (editingList[i].manual_pos > manualPos) {
				editingList[i].manual_pos --;
			}
			if (editingList[i].sorted_pos > sortedPos) {
				editingList[i].sorted_pos --;
			}
		}
		for (i in insnList) {
			if (insnList[i].manual_pos > manualPos) {
				insnList[i].manual_pos --;
			}
			if (insnList[i].sorted_pos > sortedPos) {
				insnList[i].sorted_pos --;
			}
		}
		updateIsa();
	}
}

function editInsn(id) {
	var elem = document.getElementById("insn_" + id);
	elem.innerHTML =  "Hex:<br>"
					+ "<input type=\"text\" class=\"hex-in\" id=\"insn_" + id + "_hex\" onkeypress=\"return checkHex(event)\"><br>"
					+ "Format:<br>"
					+ "<input type=\"text\" class=\"name-in\" id=\"insn_" + id + "_name\" onkeypress=\"checkParams(" + id + ")\"><br>"
					+ "Verbose:<br>"
					+ "<input type=\"text\" class=\"name-in\" id=\"insn_" + id + "_verbose\" onkeypress=\"checkParams(" + id + ")\"><br>"
					+ "Control signals:<br>"
					+ "<textarea class=\"controls-in\" id=\"insn_" + id + "_controls\"></textarea><br>"
					+ "Description:<br>"
					+ "<textarea class=\"desx-in\" id=\"insn_" + id + "_desx\"></textarea>"
					+ "<div class=\"args-edit\" id=\"insn_" + id + "_args\"></div>"
					+ "<button class=\"delete\" onclick=\"deleteInsn(" + id + ")\">delete</button>"
					+ "<button class=\"edit\" onclick=\"endEdit(" + id + ")\">save</button>";
	var def = insnList[id];
	var nameElem = document.getElementById("insn_" + id + "_name");
	var verbElem = document.getElementById("insn_" + id + "_verbose");
	var hexElem = document.getElementById("insn_" + id + "_hex");
	var ctrlElem = document.getElementById("insn_" + id + "_controls");
	var desxElem = document.getElementById("insn_" + id + "_desx");
	editingList[id] = {
		manual_pos: def.manual_pos,
		sorted_pos: def.sorted_pos,
		args: def.args
	};
	var indexial = 0;
	var nameFunc = function(e) {
		if (indexial >= def.args.length) {
			return "%error%";
		}
		else
		{
			indexial ++;
			return "%" + def.args[indexial - 1].name + "%";
		}
	};
	nameElem.value = def.name.replace(/%/g, nameFunc);
	indexial = 0;
	verbElem.value = def.verbose.replace(/%/g, nameFunc);
	hexElem.value = def.hex;
	desxElem.value = def.desc.join("\n");
	ctrlElem.value = def.controls.join("\n");
	checkParams(id);
}

function endEdit(id) {
	var elem = document.getElementById("insn_" + id);
	var editing = editingList[id];
	var nameElem = document.getElementById("insn_" + id + "_name");
	var verbElem = document.getElementById("insn_" + id + "_verbose");
	var hexElem = document.getElementById("insn_" + id + "_hex");
	var ctrlElem = document.getElementById("insn_" + id + "_controls");
	var desxElem = document.getElementById("insn_" + id + "_desx");
	var name = nameElem.value;
	var verbose = verbElem.value;
	var nameFunc = function(e) {
		var desx = {
			name: e.substring(1, e.length - 1)
		};
		return "%";
	};
	name = name.replace(/%[^%]+%/g, nameFunc);
	verbose = verbose.replace(/%[^%]+%/g, nameFunc);
	var insnDef = {
		type: "single_arg",
		args: editing.args,
		name: name,
		verbose: verbose,
		hex: hexElem.value,
		desc: desxElem.value.split("\n"),
		controls: ctrlElem.value.split("\n"),
		manual_pos: editing.manual_pos
	};
	insnList[id] = insnDef;
	updateIsa();
	elem.setAttribute("class", "insn-def asm");
	elem.innerHTML = "";
	insertInsn(elem, insnDef, id);
}

function addInsn() {
	lastInsnId ++;
	lastSortedPos ++;
	templateBuilder.innerHTML += "<div class=\"insn-def asm\" id=\"insn_" + lastInsnId + "\"></div>";
	document.getElementById("insn_holder").appendChild(document.getElementById("insn_" + lastInsnId));
	insnList[lastInsnId] = {
		name: "",
		verbose: "",
		type: "single_word",
		hex: "00",
		args: [],
		desc: [],
		controls: [],
		manual_pos: lastSortedPos,
		sorted_pos: lastSortedPos
	};
	editInsn(lastInsnId);
	insnIdByIndex = insnIdByIndex.concat(lastInsnId);
}

function insertInsn(elem, def, id) {
	var descStr = "";
	for (i in def.desc) {
		descStr += "<br>" + escapeHtml(def.desc[i]).replace(/%[^%]+%/g, function(e) {
			var desx = e.substring(1, e.length - 1);
			return "<span class=\"insn-arg\">" + e.substring(1, e.length - 1) + "</span>";
		});
	}
	var indexial = 0;
	var nameFunc = function(e) {
		if (indexial >= def.args.length) {
			return "<span class=\"insn-arg\">%error%</span>";
		}
		else
		{
			indexial ++;
			return "<span class=\"insn-arg\">" + escapeHtml(def.args[indexial - 1].name) + "</span>";
		}
	};
	if (!def.verbose) def.verbose = def.name;
	var nameStr = escapeHtml(def.name).replace(/%/g, nameFunc);
	indexial = 0;
	var verbStr = escapeHtml(def.verbose).replace(/%/g, nameFunc);
	var argStr = "";
	for (i in def.args) {
		var arg = def.args[i];
		argStr += "<span class=\"insn-arg\">" + escapeHtml(arg.name) + "</span>: " + arg.type.bits + " bits " + (arg.type.is_little_endian ? "little" : "big") + " endian<br>";
	}
	if (def.controls.length > 0 && def.controls[0].length > 0) {
		var controlStr = escapeHtml(def.controls.join("\n")).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
		elem.innerHTML += "<span class=\"hex val\" id=\"insn_" + id + "_hex\">$" + escapeHtml(def.hex) + "</span> - "
						+ "<span class=\"name insn\" id=\"insn_" + id + "_name\">" + nameStr + "</span><br>"
						+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ "<span class=\"name insn\" id=\"insn_" + id + "_verbose\">" + verbStr + "</span><br>"
						+ argStr
						+ "Control signals:<br>"
						+ "<div class=\"controls indented\" id=\"insn_" + id + "_controls\">" + controlStr + "</div>"
						+ descStr
						+ "<button class=\"edit\" onclick=\"editInsn(" + id + ")\">edit</button>";
	}
	else
	{
		elem.innerHTML += "<span class=\"hex val\" id=\"insn_" + id + "_hex\">$" + escapeHtml(def.hex) + "</span> - "
						+ "<span class=\"name insn\" id=\"insn_" + id + "_name\">" + nameStr + "</span><br>"
						+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ "<span class=\"name insn\" id=\"insn_" + id + "_verbose\">" + verbStr + "</span><br>"
						+ argStr
						+ descStr
						+ "<button class=\"edit\" onclick=\"editInsn(" + id + ")\">edit</button>";
	}
}

function sortHex() {
	isaDef = JSON.parse(document.getElementById("isa_def_json").value);
	isaDef.instructions.sort((a, b) => {
		return parseInt(a.hex, 16) - parseInt(b.hex, 16);
	});
	document.getElementById("isa_def_json").value = JSON.stringify(isaDef, null, 4);
	loadFromJson();
}

function loadFromJson() {
	isaDef = JSON.parse(document.getElementById("isa_def_json").value);
	var insnHolder = document.getElementById("insn_holder");
	insnHolder.innerHTML = "";
	lastInsnId = -1;
	editingList = {};
	insnIdByIndex = [];
	loadList = isaDef.load;
	insnList = {};
	for (i in isaDef.instructions) {
		var def = isaDef.instructions[i];
		lastInsnId ++;
		insnIdByIndex = insnIdByIndex.concat(lastInsnId);
		insnList[lastInsnId] = def;
		insnHolder.innerHTML += "<div class=\"insn-def asm\" id=\"insn_" + lastInsnId + "\"></div>";
		var elem = document.getElementById("insn_" + lastInsnId);
		insertInsn(elem, def, lastInsnId);
	}
}

function findByNum(num) {
	for (i in insnList) {
		if (Number.parseInt(insnList[i].hex, 16) == num) {
			return insnList[i];
		}
	}
}

function disasm(elem) {
	var adrToLabel = {};
	var labelno = 0;
	var byteStr = elem.value.trim().split(/[\s\r\n]+/gi);
	var out = "";
	var pc = 0;
	tha_loop:
	for (var i = 0; i < byteStr.length; i++) {
		if (byteStr[i].match(/^.+:$/)) {
			var loc_hex = Number(pc).toString(16);
			var loc = "0x" + "0".repeat(4 - loc_hex.length) + pc;
			out += escapeHtml(byteStr[i]) + "<span class=\"comment\">\t; " + loc + "</span><br>";
			continue tha_loop;
		}
		var num = Number.parseInt(byteStr[i], 16);
		var insn = findByNum(num & 0x7f);
		var indexial = 0;
		var pie = !!(num & 0x80);
		var comment = pie ? "PIE" : "";
		pc ++;
		var nameFunc = function(e) {
			if (indexial >= insn.args.length) {
				return "error";
			} else {
				var val = 0;
				var bytes = Math.ceil(insn.args[indexial].type.bits / 8);
				console.log(bytes, byteStr, i);
				if (i < byteStr.length - bytes) {
					for (var x = 0; x < bytes; x++) {
						val <<= 8;
						val += Number.parseInt(byteStr[i + bytes - x], 16);
					}
					i += bytes;
					pc += bytes;
					if (bytes > 1) val += pie * pc;
					if (bytes > 1) val &= 0xffff;
					else val &= 0xff;
					val = Number(val).toString(16);
					val = "0x" + "0".repeat(bytes * 2 - val.length) + val;
				} else {
					val = "missing data";
				}
				indexial ++;
				return "<span class=\"hex val\">" + val + "</span>";
			}
		};
		comment = comment ? "\t; " + escapeHtml(comment) : "";
		out += "&nbsp;&nbsp;<span class=\"name insn\">" + escapeHtml(insn.name).replace("%", nameFunc) + "</span><span class=\"comment\">" + comment + "</span><br>";
	}
	document.getElementById("disasm_out").innerHTML = out;
}

















