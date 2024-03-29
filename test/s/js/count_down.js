
function escapeHtml(unsafe) {
	if (unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	else
	{
		return "";
	}
}

var canvas;
var no_title = false;

function test(sec) {
	if (!sec) {
		sec = 30;
	}
	targetDate = new Date();
	targetMillis = targetDate.getTime() + sec * 1000;
	targetDate = new Date(targetMillis);
}

function start_countdown() {
	canvas = document.getElementById("canvas").getContext("2d");
	setInterval(typerMan, 49);
	setTimeout(changeToShort, 2000);
	setInterval(countdownUpdate, 10);
	targetDate = new Date(targetMillis);
}

function setCountdown(date, splash, _texts, _shortTexts, pageTitle) {
	console.log([date, splash, _texts, _shortTexts, pageTitle]);
	targetDate = new Date(date);
	targetMillis = targetDate.getTime();
	texts = _texts.split(/\r\n|\n|\r/g);
	shortTexts = _shortTexts.split(/\r\n|\n|\r/g);
	waitingText = currentText = nextText = texts[0];
	splashText = splash;
	document.getElementById("ctd_header").innerHTML = escapeHtml(pageTitle);
	document.getElementsByTagName("title")[0].innerHTML = escapeHtml(pageTitle);
}

var targetMillis = 1658484000000;
var targetDate;
var hypeMillis = 10000;
var preHypeMillis = 10590;
var spinny = 0;
var fillStyle = "#000000";
var clearStyle = "#ffffff";

function dayOfYear(date) {
	var start = new Date(date.getFullYear(), 0, 0);
	var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	return day;
}

function arcing(part, radius, fill = false, offset = 0) {
	offset *= Math.PI * 2;
	canvas.fillStyle = fillStyle;
	if (fill) {
		canvas.beginPath();
		canvas.arc(256, 256, radius, offset + -0.5 * Math.PI, offset + -0.5 * Math.PI - part * 2 * Math.PI, true);
		canvas.lineTo(256, 256);
		canvas.fill();
	}
	else
	{
		canvas.beginPath();
		canvas.arc(256, 256, radius, offset + -0.5 * Math.PI, offset + -0.5 * Math.PI - part * 2 * Math.PI, true);
		canvas.arc(256, 256, radius - 32, offset + -0.5 * Math.PI - part * 2 * Math.PI, offset + -0.5 * Math.PI, false);
		canvas.fill();
	}
}

function arcingPlusPlus(part, radius, text, offset = 0) {
	offset *= Math.PI * 2;
	// Setup.
	canvas.font = "256px Source Code Pro";
	canvas.textAlign = "center";
	// Clip filled part.
	canvas.beginPath()
	canvas.arc(256, 256, radius, offset + -0.5 * Math.PI, offset + -0.5 * Math.PI - part * 2 * Math.PI, true);
	canvas.lineTo(256, 256);
	canvas.save();
	canvas.clip();
	// Draw filled part.
	canvas.fillStyle = fillStyle;
	canvas.fillRect(0, 0, 512, 512);
	canvas.fillStyle = clearStyle;
	canvas.fillText(text, 256, 330);
	canvas.restore();
	// Clip unfilled part.
	canvas.beginPath()
	canvas.arc(256, 256, radius, offset + -0.5 * Math.PI, offset + -0.5 * Math.PI - part * 2 * Math.PI);
	canvas.lineTo(256, 256);
	canvas.save();
	canvas.clip();
	// Draw unfilled part.
	canvas.fillStyle = fillStyle;
	//canvas.fillRect(0, 0, 512, 512);
	//canvas.fillStyle = "#ffffff";
	canvas.fillText(text, 256, 330);
	canvas.restore();
}

var hypeSize = 0;

var secondsRing = 1;
var minutesRing = 1;
var hoursRing = 1;
var daysRing = 1;

var secondsTarget = 1;
var minutesTarget = 1;
var hoursTarget = 1;
var daysTarget = 1;

var secondsSpinny = 1;
var minutesSpinny = 1;
var hoursSpinny = 1;
var daysSpinny = 1;

var waitingText = "";
var splashText = "Go have fun now!";

function countdownUpdate() {
	var now = new Date(Date.now());
	var to = targetDate;
	var years = to.getFullYear() - now.getFullYear();
	var days = dayOfYear(to) - dayOfYear(now);
	var hours = to.getHours() - now.getHours();
	var minutes = to.getMinutes() - now.getMinutes();
	var seconds = to.getSeconds() - now.getSeconds();
	var millis = to.getMilliseconds() - now.getMilliseconds();
	var delta = to.getTime() - now.getTime();
	var itIsTime = false;
	if (millis < 0) {
		seconds --;
		millis += 1000;
	}
	if (seconds < 0) {
		minutes --;
		seconds += 60;
	}
	if (minutes < 0) {
		hours --;
		minutes += 60;
	}
	if (hours < 0) {
		days --;
		hours += 24;
	}
	if (days < 0) {
		years --;
		days += 365;
	}
	if (years < 0) {
		years = 0;
		days = 0;
		hours = 0;
		minutes = 0;
		seconds = 0;
		millis = 0;
		itIsTime = true;
	}
	//console.log("years   : " + years);
	//console.log("days    : " + days);
	//console.log("hours   : " + hours);
	//console.log("minutes : " + minutes);
	//console.log("seconds : " + seconds);
	//console.log("millis  : " + millis);
	// 512 high in total
	
	spinny += 1 / 600;
	
	secondsTarget = seconds / 60 + millis / 60000;
	minutesTarget = minutes / 60;
	hoursTarget = hours / 24;
	daysTarget = days / 365;
	
	//var changeDelta = 1 / 120;
	var changeDelta = 1 / 15;
	var changeGamma = 1 - changeDelta;
	
	if (delta < preHypeMillis) {
		secondsTarget = delta / hypeMillis;
		hypeSizeTarget = 256;
		hypeSize = hypeSizeTarget * changeDelta + hypeSize * changeGamma;
	}
	else
	{
		hypeSize = 136;
	}
	
	if (secondsRing - secondsTarget < 0.0025 && secondsRing - secondsTarget > 0) {
		secondsRing = secondsTarget;
	}
	else
	{
		secondsRing = secondsTarget * changeDelta + secondsRing * changeGamma;
	}
	minutesRing = minutesTarget * changeDelta + minutesRing * changeGamma;
	hoursRing = hoursTarget * changeDelta + hoursRing * changeGamma;
	daysRing = Math.max(daysTarget * changeDelta + daysRing * changeGamma, 0);
	
	if (secondsRing < secondsTarget && secondsSpinny > 0.999) {
		secondsSpinny = 0;
	}
	if (minutesRing + 0.001 < minutesTarget && minutesSpinny > 0.999) {
		minutesSpinny = 0;
	}
	if (hoursRing + 0.001 < hoursTarget && hoursSpinny > 0.999) {
		hoursSpinny = 0;
	}
	if (daysRing + 0.001 < daysTarget && daysSpinny > 0.999) {
		daysSpinny = 0;
	}
	secondsSpinny = changeDelta + secondsSpinny * changeGamma;
	minutesSpinny = changeDelta + minutesSpinny * changeGamma;
	hoursSpinny = changeDelta + hoursSpinny * changeGamma;
	daysSpinny = changeDelta + daysSpinny * changeGamma;
	
	canvas.fillStyle = "#ffffff";
	canvas.clearRect(0, 0, 512, 512);
	if (itIsTime) {
		canvas.font = "256px Source Code Pro";
		canvas.textAlign = "center";
		canvas.fillStyle = fillStyle;
		canvas.fillText("0", 256, 330);
	}
	else if (delta < preHypeMillis) {
		arcingPlusPlus(secondsRing, hypeSize, String(seconds + 1), secondsSpinny);
		nextText = "00000000000 ms remain";
	}
	else
	{
		arcing(daysRing, 256, false, daysSpinny);
		arcing(hoursRing, 216, false, hoursSpinny);
		arcing(minutesRing, 176, false, minutesSpinny);
		arcing(secondsRing, 136, true, secondsSpinny);
	}
	waitenText(seconds + 1, minutes, hours, days);
	if (delta < 1000) {
		nextText = splashText;
		countyBoie = 4;
	}
	if (delta <= 0) {
		waitingText = "0 seconds<br>remain";
	}
}

var texts = [
	"Until MCH2022",
	"Until MCH 0x7E6",
	"Until MCH $7E6",
	"00000000000 ms remain"
//	"0.000000000 years remain"
];
var shortTexts = [
	"Now with extra CPU!",
	"Magical!",
	"May contain hackers!",
	"Hexadecimal!",
	["badge.team!", "mch2022.org!"],
	["ACCESS GRANTED", "ACCESS DENIED"],
	["+RobotMan2412", "+You!"],
	["SIGSEGV", "Segmentation fault in 0x07E607E6", "^C", "rm -rf /"]
];
var nextText = "Until MCH2022";
var currentText = "Until MCH2022";
var countyBoie = 0;
var shortChance = 0.3; // 30% chance
var shortTime = [1200, 2000]; //1.2s to 2s long
var normTime = [13000, 20000]; //13s to 20s long
var delay = 0;
var next;
function typerMan() {
	countyBoie ++;
	countyBoie %= 8;
	
	if (!nextText.startsWith(currentText)) {
		currentText = currentText.substring(0, currentText.length - 1);
	}
	else if (currentText != nextText) {
		currentText += nextText[currentText.length];
	}
	else if (delay > 0) {
		setTimeout(next, delay);
		delay = 0;
	}
	
	var outputText = currentText;
	if ("00000000000 ms remain".startsWith(currentText)) {
		outputText = millisLeft().substring(0, currentText.length);
	}
	if (!no_title) {
		document.getElementById("title").innerHTML = escapeHtml(outputText);
	}
	
	if (countyBoie < 4) {
		outputText += "_";
	}
	
	var mch_text_c = document.getElementById("mch_text").innerHTML;
	var mch_time_c = document.getElementById("mch_time").innerHTML;
	
	if (mch_text_c !== "$ " + escapeHtml(outputText)) {
		document.getElementById("mch_text").innerHTML = "$ " + escapeHtml(outputText);
	}
	if (mch_time_c !== waitingText) {
		document.getElementById("mch_time").innerHTML = waitingText;
	}
}

function waitenText(seconds, minutes, hours, days) {
	var and = false;
	var out = "";
	if (days > 0) {
		out += days + " day" + (days != 1 ? "s" : "") + "<br>";
		and = true;
	}
	if (days > 0 || hours > 0) {
		out += (and ? "and " : "") + hours + " hour" + (hours != 1 ? "s" : "") + "<br>";
		and = true;
	}
	if (days > 0 || hours > 0 || minutes > 0) {
		out += (and ? "and " : "") + minutes + " minute" + (minutes != 1 ? "s" : "") + "<br>";
		and = true;
	}
	out += (and ? "and " : "") + seconds + " second" + (seconds != 1 ? "s" : "") + "<br>";
	out += "remain" + (seconds != 1 ? "" : "s");
	waitingText = out;
}

function millisLeft() {
	var left = String(Math.max(0, targetMillis - Date.now()));
	return "0".repeat(11 - left.length) + left + " ms remain";
}

function changeToShort() {
	nextText = shortTexts;
	pickOne();
	delay = Math.random() * (shortTime[1] - shortTime[0]) + shortTime[0];
	next = changeToNorm;
}

function changeToNorm() {
	nextText = texts;
	pickOne();
	delay = Math.random() * (normTime[1] - normTime[0]) + normTime[0];
	next = Math.random() < shortChance ? changeToShort : changeToNorm;
}

function pickOne() {
	while (typeof(nextText) == "object") {
		nextText = nextText[Math.floor(Math.random() * nextText.length)];
	}
}














