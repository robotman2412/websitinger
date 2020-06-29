
var lastName = "";
var mchNameInput;
var mchCanvas;
var mchCanvasElem;
var mchStickerTemplate;
var mchNameFont;

var mchSlantLen = 16;

var mchLetters = {
	"a": {
		"src": "a.png",
		"slantIn": 0,
		"slantOut": 4,
		"width": 144,
		"x": 0, "y": 208
	},
	"b": {
		"src": "b.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 112,
		"x": 160, "y": 208
	},
	"c": {
		"src": "c.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128,
		"x": 288, "y": 208
	},
	"d": {
		"src": "d.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112,
		"x": 432, "y": 208
	},
	"e": {
		"src": "e.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112,
		"x": 560, "y": 208
	},
	"f": {
		"src": "f.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112,
		"x": 688, "y": 208
	},
	"g": {
		"src": "g.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128,
		"x": 816, "y": 208
	},
	"h": {
		"src": "h.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144,
		"x": 960, "y": 208
	},
	"i": {
		"src": "i.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 48,
		"x": 1120, "y": 208
	},
	"j": {
		"src": "j.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112,
		"x": 1184, "y": 208
	},
	"k": {
		"src": "k.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128,
		"x": 1312, "y": 208
	},
	"l": {
		"src": "l.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 96,
		"x": 1456, "y": 208
	},
	"m": {
		"src": "m.png",
		"slantIn": 0,
		"slantOut": 4,
		"width": 200,
		"x": 1568, "y": 208
	},
	"n": {
		"src": "n.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144,
		"x": 0, "y": 416
	},
	"o": {
		"src": "o.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128,
		"x": 160, "y": 416
	},
	"p": {
		"src": "p.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 136,
		"x": 304, "y": 416
	},
	"q": {
		"src": "q.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128,
		"x": 464, "y": 416
	},
	"r": {
		"src": "r.png",
		"slantIn": 0,
		"slantOut": 1,
		"width": 144,
		"x": 608, "y": 416
	},
	"s": {
		"src": "s.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112,
		"x": 768, "y": 416
	},
	"t": {
		"src": "t.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 144,
		"x": 896, "y": 416
	},
	"u": {
		"src": "u.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 144,
		"x": 1056, "y": 416
	},
	"v": {
		"src": "v.png",
		"slantIn": 6,
		"slantOut": 0,
		"width": 144,
		"x": 1216, "y": 416
	},
	"w": {
		"src": "w.png",
		"slantIn": 6,
		"slantOut": 0,
		"width": 200,
		"x": 1376, "y": 416
	},
	"x": {
		"src": "x.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144,
		"x": 0, "y": 624
	},
	"y": {
		"src": "y.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 144,
		"x": 160, "y": 624
	},
	"z": {
		"src": "z.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112,
		"x": 320, "y": 624
	},
	"0": {
		"src": "0.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128,
		"x": 448, "y": 624
	},
	"1": {
		"src": "1.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 96,
		"x": 592, "y": 624
	},
	"2": {
		"src": "2.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128,
		"x": 712, "y": 624
	},
	"3": {
		"src": "3.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 128,
		"x": 848, "y": 624
	},
	"4": {
		"src": "4.png",
		"slantIn": 2,
		"slantOut": 0,
		"width": 128,
		"x": 992, "y": 624
	},
	"5": {
		"src": "5.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 128,
		"x": 1136, "y": 624
	},
	"6": {
		"src": "6.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112,
		"x": 1280, "y": 624
	},
	"7": {
		"src": "7.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144,
		"x": 1408, "y": 624
	},
	"8": {
		"src": "8.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112,
		"x": 1568, "y": 624
	},
	"9": {
		"src": "9.png",
		"slantIn": 1,
		"slantOut": 0,
		"width": 112,
		"x": 1696, "y": 624
	},
	"!": {
		"src": "_exclaim.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 48,
		"x": 0, "y": 832
	},
	".": {
		"src": "_dot.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 48,
		"x": 64, "y": 832
	},
	",": {
		"src": "_comma.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 64,
		"x": 128, "y": 832
	},
	"_": {
		"src": "_under.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 144,
		"x": 208, "y": 832
	},
	"?": {
		"src": "_question.png",
		"slantIn": 0,
		"slantOut": 0,
		"width": 112,
		"x": 368, "y": 832
	},
	"\'": {
		"src": "_quote_1.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 64,
		"x": 496, "y": 832
	},
	"\"": {
		"src": "_quote_2.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 144,
		"x": 576, "y": 832
	},
	":": {
		"src": "_colon.png",
		"slantIn": 3,
		"slantOut": 0,
		"width": 96,
		"x": 736, "y": 832
	}
};

function mchStart() {
	mchCanvasElem = document.getElementById("mch_name_canvas");
	mchCanvas = mchCanvasElem.getContext("2d");
	mchNameInput = document.getElementById("mch_name");
	mchStickerTemplate = document.getElementById("sticker_nameless");
	mchNameFont = document.getElementById("name_font");
	
	setInterval(function() {
		var newName = mchNameInput.value.toLowerCase();
		if (newName !== lastName) {
			lastName = newName;
			redrawNameCanvas();
		}
		var rect = mchCanvasElem.getClientRects()[0];
		var borderRadius = rect.width / 1492 * 20;
		mchCanvasElem.style.borderRadius = borderRadius + 1 + "px";
	}, 5);
}

function mchNameDownload() {
	var image = mchCanvasElem.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
	var link = document.createElement('a');
	link.download = "custom sticker.png";
	link.href = image;
	link.click();
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
				mchCanvas.save();
				mchCanvas.beginPath();
				mchCanvas.rect(currentX + offsetX, offsetY - 128, letter.width, 192);
				mchCanvas.clip();
				mchCanvas.drawImage(mchNameFont, currentX + offsetX - letter.x, offsetY - 128 - letter.y);
				mchCanvas.restore();
			}
			currentX += letter.width + letterSpacing;
			availableSlant = letter.slantOut;
		}
	}
	return currentX - letterSpacing;
}
