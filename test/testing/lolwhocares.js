
var codeElem;
var inElem;
var outElem;
var code;

/*

BFHW:
-[++[<++>->+++>+++<<]---->+]<<<<.<<<<-.<..<<+.<<<<.>>.>>>-.<.+++.>>.>-.<<<<<+.
--------[-->+++<]>.++++.----.

LWCHW:



*/

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
	return (str.match(expr) || []).length;
}

/* lol who executes */

var VM_BASE = 3; // Can not exceed base 36
var VM_DIGITS = 18;
var VM_MAX_INT = Math.pow(VM_BASE, VM_DIGITS); // Can not equal or exceed 2^32

var DIR_UP = 3;
var DIR_DOWN = 1;
var DIR_LEFT = 2;
var DIR_RIGHT = 0;

var insnBase;
var lastInsnChar;

var copyOfCode;
var codeWidth;
var codeHeight;
var pc;
var dir;
var stk;
var insnBuf;
var isRunning;

var insnCharMap = {
	'0': {'0': '0', '1': '1', '2': '2'},
	'1': {'0': '2', '1': '0', '2': '1'},
	'2': {'0': '1', '1': '2', '2': '0'}
};

var insnRCharMap = {
	'0': {'0': '0', '1': '1', '2': '2'},
	'1': {'2': '0', '0': '1', '1': '2'},
	'2': {'1': '0', '2': '1', '0': '2'}
};

var insnLowerMap = {
	'0': '1',
	'1': '0',
	'2': '0'
};

var insnHigherMap = {
	'0': '2',
	'1': '2',
	'2': '1'
};

var obfMap = {
	'0': '@',
	'1': '#',
	'2': '$',
	'@': '@',
	'#': '#',
	'$': '$'
};

var deobfMap = {
	'@': '0',
	'#': '1',
	'$': '2',
	'0': '0',
	'1': '1',
	'2': '2'
};

function log() {
	console.log("pc=", pc, "dir=", dir, "stk=", stk, "insnBuf=", insnBuf);
}

function reset() {
	isRunning = false;
	outElem.value = "";
	copyOfCode = code.split(/\r\n|\r|\n/g);
	codeHeight = copyOfCode.length;
	codeWidth = 0;
	for (i in copyOfCode) {
		codeWidth = Math.max(codeWidth, copyOfCode[i].length);
	}
	pc = {x: -1, y: 0};
	dir = 0;
	stk = [];
	insnBuf = [];
	insnBase = '0';
	lastInsnChar = null;
}

function manyStep() {
	if (!isRunning) return;
	for (i = 0; i < 128 && step(); i++);
	if (i < 128) {
		console.log("Done");
		isRunning = false;
	}
}

function step() {
	var char = getc();
	//while (char != null && !char.match(/^&@-\$\^$/)) char = getc();
	if (char == null) return false;
	runInsn(char);
	log();
	return true;
}

function completeInsnBuf(doHigher, hidden) {
	if (hidden) {
		var map = doHigher ? insnHigherMap : insnLowerMap;
		var stuff = insnBuf[insnBuf.length - 1];
		insnBuf.push(map[stuff]);
	} else if (insnBuf.length == 1) {
		completeInsnBuf(doHigher, true);
		completeInsnBuf(doHigher, true);
		console.log("Completed insn buf to", insnBuf);
	} else {
		completeInsnBuf(doHigher, true);
		console.log("Completed insn buf to", insnBuf);
	}
}

function runInsn(insn) {
	var pushLater = null;
	var branchLater = 0;
	if (insn == '*') {
		pushLater = readTheNum() % VM_MAX_INT;
	}
	if (!insn.match(/[012]/)) {
		switch (insn) {
			case ('<'):
				dir = 2;
				break;
			case ('>'):
				dir = 0;
				break;
			case ('^'):
				dir = 3;
				break;
			case ('v'):
				dir = 1;
				break;
			case ('`'):
				branchLater = -1;
				break;
			case (','):
				branchLater = 1;
				break;
		}
		dir &= 3;
		if (insnBuf.length > 0) {
			completeInsnBuf(!((pc.x + pc.y) & 1));
		} else {
			lastInsnChar = insn;
			if (pushLater != null) stk.push(pushLater);
			if (branchLater && !stk[stk.length - 1]) {
				dir = (dir + branchLater) & 3;
			}
			return;
		}
	} else if (insnBuf.length == 2) {
		if (insn == lastInsnChar) {
			completeInsnBuf(!((pc.x + pc.y) & 1));
			insnBase = insn;
		} else {
			insnBuf.push(insnCharMap[insnBase][insn]);
			insnBase = '0';
			if (insnBuf.length >= 3) {
				console.log("Running insn ", insnBuf);
			}
		}
	} else if (insnBuf.length < 3) {
		if (insn == lastInsnChar) {
			completeInsnBuf(!((pc.x + pc.y) & 1));
			insnBase = insn;
		} else {
			insnBuf.push(insnCharMap[insnBase][insn]);
		}
	}
	lastInsnChar = insn;
	if (insnBuf.length >= 3) {
		lastInsnChar = null;
		insn = insnBuf[0] + insnBuf[1] + insnBuf[2];
		insnBuf = [];
		switch (insn) {
			case ('010'): // Swap
				var ax = stk.pop() || 0, bx = stk.pop() || 0;
				stk.push(ax, bx);
				break;
			case ('012'): // Increment
				var ax = stk.pop() || 0;
				stk.push((ax + 1 + VM_MAX_INT) % VM_MAX_INT);
				break;
			case ('020'): // Decrement
				var ax = stk.pop() || 0;
				stk.push((ax - 1 + VM_MAX_INT) % VM_MAX_INT);
				break;
			case ('021'): // Duplicate
				var ax = stk.pop() || 0;
				stk.push(ax, ax);
				break;
			case ('120'): // Discard
				stk.pop();
				break;
			case ('121'): // Add
				var ax = stk.pop() || 0, bx = stk.pop() || 0;
				stk.push((bx + ax + VM_MAX_INT) % VM_MAX_INT);
				break;
			case ('101'): // Sub
				var ax = stk.pop() || 0, bx = stk.pop() || 0;
				stk.push((bx - ax + VM_MAX_INT) % VM_MAX_INT);
				break;
			case ('102'): // Store
				var x = stk.pop() || 0, y = stk.pop() || 0, cx = stk.pop() || 0;
				if (y < 0 || y >= codeHeight) break;
				else if (x < 0 || x >= copyOfCode[y].length) break;
				else copyOfCode[y] = copyOfCode[y].substring(0, x) + String.fromCharCode(cx) + copyOfCode[y].substring(x + 1);
				break;
			case ('210'): // Load
				var x = stk.pop() || 0, y = stk.pop() || 0;
				if (y < 0 || y >= codeHeight) stk.push(0);
				else if (x < 0 || x >= copyOfCode[y].length) stk.push(0);
				else stk.push(copyOfCode[y].charCodeAt(x));
				break;
			case ('212'): // Input
				var val = inElem.value[0];
				inElem.value = inElem.value.substring(1);
				stk.push((val || '\u0000').charCodeAt(0));
				break;
			case ('201'): // Output
				var ax = stk.pop() || 0;
				outElem.value += String.fromCharCode(ax);
				break;
		}
	}
	if (pushLater != null) stk.push(pushLater);
	if (branchLater && !stk[stk.length - 1]) {
		dir = (dir + branchLater) & 3;
	}
}

function readTheNum() {
	var n = 0;
	var alpha = '0123456789abcdefghijklmnopqrstuvwxyz';
	while (1) {
		var q = {x: pc.x, y: pc.y};
		var digit = alpha.indexOf(getc());
		if (digit < 0 || digit >= VM_BASE) {
			pc = q; // Undo the pc++ of getc.
			return n;
		}
		n *= VM_BASE;
		n += digit;
	}
}

function getcp(x, y) {
	if (y < 0 || y >= codeHeight) {
		return null;
	}
	if (x < 0 || x >= codeWidth) {
		return null;
	}
	ret = copyOfCode[y];
	if (x >= ret.length) return ' ';
	else return ret[x];
}

function getc() {
	switch (dir & 3) {
		case (0):
			pc.x ++;
			break;
		case (1):
			pc.y ++;
			break;
		case (2):
			pc.x --;
			break;
		case (3):
			pc.y --;
			break;
	}
	if (pc.y < 0 || pc.y >= codeHeight) {
		return null;
	}
	if (pc.x < 0 || pc.x >= codeWidth) {
		return null;
	}
	ret = copyOfCode[pc.y];
	if (pc.x >= ret.length) return ' ';
	else return ret[pc.x];
}

/* lol who edits */

function lolWhoCares() {
	codeElem = document.getElementById("code");
	inElem = document.getElementById("in");
	outElem = document.getElementById("out");
	edit();
	reset();
	setInterval(manyStep, 50);
}

function stuffToPos(sel, str) {
	str = str.substring(0, sel);
	var y = countMatches(str, /\r\n|\r|\n/g);
	var q = Math.max(str.lastIndexOf('\r'), str.lastIndexOf('\n'));
	var x = str.length - q - 1;
	return {x: x, y: y};
}

function encodeInsn(insn, dir) {
	if (codeElem.selectionStart != codeElem.selectionEnd) {
		throw new Error("I hate selections");
	}
	// Find positions first.
	var selection = codeElem.selectionStart;
	var pos = stuffToPos(selection, codeElem.value);
	var x = pos.x, y = pos.y;
	var code = codeElem.value.split(/\r\n|\r|\n/g);
	// Then, check for earlier instructions.
	var isFullInstruction; // Whether the last instruction was fully declared or compacted.
	var isBaseCharDeclared; // Whether the last character in check is the base character.
	var prevCode = "";
	var dx = (dir == 0) ? 1 : (dir == 2 ? -1 : 0);
	var dy = (dir == 1) ? 1 : (dir == 3 ? -1 : 0);
	var numPrev;
	var px = x, py = y;
	if (dir == 0) {
		px = 0;
		numPrev = x;
	} else if (dir == 1) {
		py = 0;
		numPrev = y;
	} else if (dir == 2) {
		px = codeWidth - 1;
		numPrev = px - x;
	} else if (dir == 3) {
		py = codeHeight - 1;
		numPrev = py - y;
	}
	for (var i = 0; i < numPrev; i++) {
		prevCode += getcp(px, py) || ' ';
		px += dx;
		py += dy;
	}
	// Check which types the earlier instructions were.
	var check = prevCode.match(/(^|[^012])[012]+$/g);
	if (check && check.length > 0) {
		check = check[0];
		if (!check[0].match(/[012]/)) check = check.substring(1);
		while (check.length > 0) {
			if (check.length >= 3 && check[0] != check[1] && check[1] != check[2]) {
				isFullInstruction = true;
				isBaseCharDeclared = false;
				check = check.substring(3);
			} else if (check.length >= 2 && check[0] == check[1]) {
				isFullInstruction = false;
				isBaseCharDeclared = true;
				check = check.substring(2);
			} else if (check.length >= 3 && check[1] == check[2]) {
				isFullInstruction = false;
				isBaseCharDeclared = true;
				check = check.substring(3);
			} else {
				isFullInstruction = false;
				isBaseCharDeclared = false;
				check = "";
			}
		}
	} else {
		isFullInstruction = true;
		isBaseCharDeclared = false;
	}
	var baseChar = "0";
	var out = "";
	if (!isFullInstruction && !isBaseCharDeclared) {
		baseChar = getcp(x - dx, y - dy);
		out += baseChar;
	} else if (!isFullInstruction && isBaseCharDeclared) {
		baseChar = getcp(x - dx, y - dy);
	}
	console.log("prev=", prevCode, "full=", isFullInstruction, "base=", isBaseCharDeclared, baseChar, "x=", x, "y=", y);
	// Encode the instruction with the base character.
	var insn = shortenInsn(insn, !!((y + x) & 1) ^ (!isFullInstruction && !isBaseCharDeclared));
	for (var i = 0; i < insn.length; i++) {
		out += insnRCharMap[baseChar][insn[i]];
	}
	// Insert or append the output.
	dx = (dir == 0) ? 1 : (dir == 2 ? -1 : 0);
	dy = (dir == 1) ? 1 : (dir == 3 ? -1 : 0);
	px = x, py = y;
	for (var i = 0; i < out.length; i++) {
		if (py < 0) {
			throw new Error("Code goes up too much");
		} else if (py == code.length) {
			code[py] = "";
		}
		if (code[py].length > px) {
			code[py] = code[py].substring(0, px) + out[i] + code[py].substring(px + 1);
		} else if (code[py].length < px) {
			code[py] += ' '.repeat(px - code[py].length) + out[i];
		} else {
			code[py] += out[i];
		}
		px += dx;
		py += dy;
	}
	// Stitch the code back together.
	codeElem.value = code.join('\n');
	selection = px;
	for (var i = 0; i < code.length && i < py; i++) {
		selection += code[i].length + 1;
	}
	codeElem.selectionStart = selection;
	codeElem.selectionEnd = selection;
	console.log(px, py, selection);
}

function isHigher(pre, char) {
	return (pre == '2') ? (char == '1') : (char == '2');
}

function shortenInsn(insn, doHigher) {
	if (doHigher == isHigher(insn[0], insn[1]) && doHigher == isHigher(insn[1], insn[2])) {
		return insn[0];
	} else if (doHigher != isHigher(insn[0], insn[1]) && doHigher != isHigher(insn[1], insn[2])) {
		return insn.substring(0, 2);
	} else {
		return insn;
	}
}

function edit() {
	code = codeElem.value;
	reset();
}
