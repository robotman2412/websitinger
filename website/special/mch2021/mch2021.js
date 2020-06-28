
var lastName = "";
var mchNameInput;
var mchCanvas;
var mchStickerTemplate;

var mchSlantLen = 16;

var mchLetters = {
	"a": {
		"src": "a.png",
		"slantIn": 0,
		"slantOut": 6,
		"width": 144
	},
	"b": {
		"src": "b.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 112
	},
	"c": {
		"src": "c.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128
	},
	"d": {
		"src": "d.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112
	},
	"e": {
		"src": "e.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112
	},
	"f": {
		"src": "f.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112
	},
	"g": {
		"src": "g.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128
	},
	"h": {
		"src": "h.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144
	},
	"i": {
		"src": "i.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 48
	},
	"j": {
		"src": "j.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112
	},
	"k": {
		"src": "k.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128
	},
	"l": {
		"src": "l.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 96
	},
	"m": {
		"src": "m.png",
		"slantIn": 0,
		"slantOut": 6,
		"width": 208
	},
	"n": {
		"src": "n.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144
	},
	"o": {
		"src": "o.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128
	},
	"p": {
		"src": "p.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144
	},
	"q": {
		"src": "q.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128
	},
	"r": {
		"src": "r.png",
		"slantIn": 0,
		"slantOut": 1,
		"width": 144
	},
	"s": {
		"src": "s.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112
	},
	"t": {
		"src": "t.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 144
	},
	"u": {
		"src": "u.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 144
	},
	"v": {
		"src": "v.png",
		"slantIn": 6,
		"slantOut": 0,
		"width": 144
	},
	"w": {
		"src": "w.png",
		"slantIn": 6,
		"slantOut": 0,
		"width": 208
	},
	"x": {
		"src": "x.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144
	},
	"y": {
		"src": "y.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 144
	},
	"z": {
		"src": "z.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112
	},
	"0": {
		"src": "0.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128
	},
	"1": {
		"src": "1.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 96
	},
	"2": {
		"src": "2.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128
	},
	"3": {
		"src": "3.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128
	},
	"4": {
		"src": "4.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128
	},
	"5": {
		"src": "5.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 128
	},
	"6": {
		"src": "6.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112
	},
	"7": {
		"src": "7.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144
	},
	"8": {
		"src": "8.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112
	},
	"9": {
		"src": "9.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112
	},
	"!": {
		"src": "_exclaim.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 48
	},
	",": {
		"src": "_comma.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 32
	},
	".": {
		"src": "_dot.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 48
	},
	"_": {
		"src": "_under.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144
	},
	"?": {
		"src": "_question.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112
	},
	":": {
		"src": "_colon.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 96
	},
	"\'": {
		"src": "_quote_1.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 64
	},
	"\"": {
		"src": "_quote_2.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 144
	}
};

function mchStart() {
	mchCanvas = document.getElementById("mch_name_canvas").getContext("2d");
	mchNameInput = document.getElementById("mch_name");
	mchStickerTemplate = document.getElementById("sticker_nameless");
	
	var letterHolder = document.getElementById("mch_letter_holder");
	for (key in mchLetters) {
		letterHolder.innerHTML += "<img id=\"mch_letter_" + mchLetters[key].src + "\" src=\"/special/mch2021/letters/" + mchLetters[key].src + "\" width=\"" + mchLetters[key].width + "\" height=\"256\">";
		mchLetters[key].elem = document.getElementById("mch_letter_" + mchLetters[key].src);
	}
	
	setInterval(function() {
		var newName = mchNameInput.value.toLowerCase();
		if (newName !== lastName) {
			lastName = newName;
			redrawNameCanvas();
		}
	}, 50);
}

function redrawNameCanvas() {
	//width fittah: 1280
	//width in default place: 1152
	//default offset: 234, 362
	//leftmost offset: 106, 362
	mchCanvas.clearRect(0, 0, 1492, 660);
	var maxTextWidth = 900;
	var textWidth = drawName(true);
	mchCanvas.setTransform(1, 0, 0, 1, 0, 0);
	mchCanvas.drawImage(mchStickerTemplate, 0, 0);
	var scaleFactor = 1;
	var offsetX = 234;
	var offsetY = 362 + 128;
	if (textWidth > 1280) {
		offsetX = 106;
		scaleFactor = 1280 / textWidth;
	}
	else if (textWidth > 1152){
		offsetX -= textWidth - 1152;
	}
	mchCanvas.scale(scaleFactor, scaleFactor);
	drawName(false, offsetX / scaleFactor, offsetY / scaleFactor);
}

function drawName(simulate = false, offsetX = 0, offsetY = 0) {
	var currentX = 0;
	var spaceSize = 92;
	var letterSpacing = 48;
	var slantMultiplier = 16;
	var availableSlant = 0;
	for (i = 0; i < lastName.length; i++) {
		var c = lastName[i];
		if (c === ' ') {
			currentX += spaceSize;
		}
		else
		{
			var letter;
			if (mchLetters[c] == undefined) {
				currentX += spaceSize;
				continue;
			}
			else
			{
				letter = mchLetters[c];
			}
			var slantUsed = Math.min(availableSlant, letter.slantIn);
			currentX -= slantUsed * slantMultiplier;
			if (!simulate) {
				mchCanvas.drawImage(letter.elem, currentX + offsetX, offsetY - 128);
			}
			currentX += letter.width + letterSpacing;
			availableSlant = letter.slantOut;
		}
	}
	return currentX - letterSpacing;
}
