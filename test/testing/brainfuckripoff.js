
var codeElem;
var outelem;
var code;

/*

BFHW:
-[++[<++>->+++>+++<<]---->+]<<<<.<<<<-.<..<<+.<<<<.>>.>>>-.<.+++.>>.>-.<<<<<+.
--------[-->+++<]>.++++.----.

LWCHW:
(8-bit)
$&$0@&$$0&$$0@&$0&$$0&$$0$0$&$0$0&$$0&$$0&$$0$0&$$0&$$0&$$0&$0&$0-$&$0$&$0$&$0$&$0$0&$$0-&$0&$0&$0&$0^$0&$0&$0&$0&$0$&$0^$0&$0^$0^$0&$0&$0&$$0^$0&$0&$0&$0&$0^$0$0$0^$0$0$0$0$&$0^$0&$0^$0&$$0&$$0&$$0^$0$0$0^$0$0$&$0^$0&$0&$0&$0&$0&$0&$$0^$0
$1000&$0@$10&$0$0&$11$0&$0-$0^$0&$100$0^$0$100&$0^$0

(10-trit)
&$2200$0^$0&$1002$0^$0&$21$0^$0^$0@$$0&$&$-$0&$10$0^&$1122$0^$0$110&$0^
&$11022$0^&$11110$0^$0$0^


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
var VM_DIGITS = 10;
var VM_MAX_INT = Math.pow(VM_BASE, VM_DIGITS); // Can not equal or exceed 2^32

var copyOfCode;
var pc;
var adr;
var mem;
var stk;
var isInv;

var vmTimer;

function log() {
	//console.log("mem=", mem, "adr=", adr, "mem[adr]=", mem[adr], "pc=", pc, "stk=", stk);
}

function reset() {
	clearInterval(vmTimer);
	outElem.value = "";
	copyOfCode = code.toLowerCase();
	pc = 0;
	adr = 0;
	mem = new Uint32Array(VM_MAX_INT);
	stk = [];
	isInv = 0;
	vmTimer = setInterval(multistep, 50);
}

function multistep() {
	for (i = 0; i < 500; i++) {
		step() || clearInterval(vmTimer);
	}
}

function step() {
	var char = getc();
	//while (char != null && !char.match(/^&@-\$\^$/)) char = getc();
	if (char == null) return false;
	runInsn(char);
	log();
	if (pc >= copyOfCode.length) console.log("Program finished.");
	return true;
}

function runInsn(insn) {
	var invThing = isInv ? -1 : 1;
	switch (insn) {
		case ('&'):
			isInv = 1;
			break;
		case ('@'):
			if (!mem[adr] ^ !isInv) { // Branch.
				stk.push(pc - 1);
			} else { // Do not branch.
				var deep = 1;
				while (deep > 0) { // We will now skip a number of things.
					var char = getc();
					if (char == null) return; // Or not lol.
					else if (char == '@') deep ++;
					else if (char == '-') deep --;
				}
			}
			isInv = 0;
			break;
		case ('-'):
			pc = stk.pop();
			isInv = 0;
			break;
		case ('$'):
			mem[adr] = (mem[adr] + VM_MAX_INT - invThing * readTheNum()) % VM_MAX_INT; // Add a stuff.
			adr = (adr + VM_MAX_INT + invThing) % VM_MAX_INT; // Inc addr.
			isInv = 0;
			break;
		case ('^'):
			if (isInv) {
				mem[adr] = 0; // TODO
			} else {
				var char = String.fromCharCode(mem[adr]);
				outElem.value += char;
			}
			adr = (adr + VM_MAX_INT - invThing) % VM_MAX_INT; // Dec addr.
			isInv = 0;
			break;
	}
}

function readTheNum() {
	var n = 0;
	var alpha = '0123456789abcdefghijklmnopqrstuvwxyz';
	var w = false;
	while (1) {
		var q = pc;
		var digit = alpha.indexOf(getc());
		if (digit < 0 || digit >= VM_BASE) {
			pc = q; // Undo the pc++ of getc.
			if (!w) return 1;
			return n;
		}
		n *= VM_BASE;
		n += digit;
		w = true;
	}
}

function getc() {
	if (pc >= copyOfCode.length) return null;
	else return copyOfCode[pc++];
}

/* lol who edits */

function lolWhoCares() {
	codeElem = document.getElementById("code");
	outElem = document.getElementById("out");
	edit();
	reset();
}

function edit() {
	code = codeElem.value;
	reset();
}
