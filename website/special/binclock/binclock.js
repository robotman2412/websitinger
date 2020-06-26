

function binStart() {
	setInterval(function() {
		var now = new Date();
		var sec = now.getSeconds();
		var min = now.getMinutes();
		var hour = now.getHours();
		for (i = 0; i < 6; i++) {
			var elem = document.getElementById("bin_sec_" + i);
			if (sec & (1 << i)) {
				elem.setAttribute("class", "bin-d-i");
			}
			else
			{
				elem.setAttribute("class", "bin-d-i-off");
			}
		}
		for (i = 0; i < 6; i++) {
			var elem = document.getElementById("bin_min_" + i);
			if (min & (1 << i)) {
				elem.setAttribute("class", "bin-d-i");
			}
			else
			{
				elem.setAttribute("class", "bin-d-i-off");
			}
		}
		for (i = 0; i < 5; i++) {
			var elem = document.getElementById("bin_hour_" + i);
			if (hour & (1 << i)) {
				elem.setAttribute("class", "bin-d-i");
			}
			else
			{
				elem.setAttribute("class", "bin-d-i-off");
			}
		}
		document.getElementById("bin_sec").innerHTML = sec;
		document.getElementById("bin_min").innerHTML = min;
		document.getElementById("bin_hour").innerHTML = hour;
	}, 10);
}

