<?php

$people = [
	"Robot",
	"Dave",
	"IGOR",
	"R24owan",
	"Maxx",
	"Cynep_"
];

$dates = [
	"date0" => "Fri 11 Feb",
	"date1" => "Sat 12 Feb",
	"date2" => "Sun 13 Feb",
	"date3" => "Fri 18 Feb",
	"date4" => "Sat 19 Feb",
	"date5" => "Sun 20 Feb",
	"date6" => "Fri 25 Feb",
	"date7" => "Sat 26 Feb",
	"date8" => "Sun 27 Feb"
];

$items = [
	"item0" => "Doritos",
	"item1" => "Doritosaus",
	"item2" => "Pfeffernüßen",
	"item3" => "Drinken",
	"item4" => "Overige"
];

$default_att = "cannot-go";

$attendance = [
	"unknown" => "weet niet",
	"can-go" => "kan",
	"cannot-go" => "kan niet"
];

$storage = "/var/www/data/plan.json";

$data = json_decode(file_get_contents($storage), true);

$food_title = "pizza";
$att_title = "komen";
$bring_title = "snaxx";

function planBody() {
	global $data;
	global $people, $dates, $items, $attendance, $storage;
	foreach ($people as $person0) {
		if (!array_key_exists($person0, $data)) {
			$data[$person0] = [];
		}
	}
	unset($person0);
	
	if ($_SERVER["REQUEST_METHOD"] === "POST") {
		//Simple merge.
		$edits = json_decode($_POST["edits"], true);
		foreach ($edits as $person0 => $list0) {
			if (array_key_exists($person0, $data)) {
				foreach ($list0 as $key0 => $value0) {
					if ($key0 == "food" && strlen($value0) <= 128) {
						$data[$person0]["food"] = $value0;
					}
					elseif (array_key_exists($key0, $dates) && array_key_exists($value0, $attendance)) {
						$data[$person0][$key0] = $value0;
					}
					elseif (array_key_exists($key0, $items) && strlen($value0) <= 128) {
						$data[$person0][$key0] = $value0;
					}
				}
				unset($key0, $value0);
			}
		}
		unset($person0, $list0);
		
		file_put_contents($storage, json_encode($data) . "\n");
	}
}

function planContent() {
	global $att_title, $food_title, $data, $people, $dates, $default_att, $bring_title, $items;
	echo "<center><h2>$att_title</h2></center><table class=\"att-table\"><tr id=\"people\"><th class=\"l\"></th>";
	foreach ($people as $person0) {
		echo "<th class=\"i\">" . $person0 . "</th>";
	}
	unset($person0);
	echo "</tr>";
	foreach ($dates as $date0 => $datename0) {
		echo "<tr id=\"$date0\"><th class=\"l\">$datename0</th>";
		foreach ($people as $person0) {
			echo "<th class=\"optn";
			if (array_key_exists($date0, $data[$person0])) {
				echo " " . $data[$person0][$date0] . "\">";
				echo planPersonDD($date0, $person0, $data[$person0][$date0]);
			}
			else
			{
				echo " $default_att\">";
				echo planPersonDD($date0, $person0, $default_att);
			}
			echo "</th>";
		}
		unset($person0);
		echo "</tr>";
	}
	unset($date0, $datename0);
	echo "</table><center><h2>$food_title</h2></center><table class=\"food-table\">";
	foreach ($people as $person0) {
		$val = "";
		if (array_key_exists("food", $data[$person0])) {
			$val = htmlspecialchars($data[$person0]["food"]);
		}
		echo "<tr><th>$person0</th><th class=\"l\"><input type=\"text\" value=\"$val\" onchange=\"foodAskedChange(this, '$person0');\">";
	}
	unset($person0);
	echo "</table>";
	echo "<center><h2>$bring_title</h2></center><table class=\"att-table\"><tr id=\"people\"><th class=\"l\"></th>";
	foreach ($people as $person0) {
		echo "<th class=\"i\">" . $person0 . "</th>";
	}
	unset($person0);
	echo "</tr>";
	foreach ($items as $item0 => $itemname0) {
		echo "<tr id=\"$item0\"><th class=\"l\">$itemname0</th>";
		foreach ($people as $person0) {
			echo "<th class=\"bring\">";
			if (array_key_exists($item0, $data[$person0])) {
				echo planCounter($item0, $person0, $data[$person0][$item0]);
			}
			else
			{
				echo planCounter($item0, $person0, "");
			}
			echo "</th>";
		}
		unset($person0);
		echo "</tr>";
	}
	unset($item0, $datename0);
	echo "</table><br><br><button class=\"wide\" onclick=\"transmit()\">submit changes</button>";
}

function planCounter($item, $person, $what) {
	$what = htmlspecialchars($what);
	echo "<input class=\"item-input\" onchange=\"countChange(this, '$person', '$item');\" value=\"$what\">";
}

function planPersonStat($date, $person, $selected) {
	global $attendance;
	$name = $attendance[$selected];
	echo "<div class=\"atte $selected\">$name</div>";
}

function planPersonDD($date, $person, $selected) {
	global $attendance;
	echo "<select class=\"date-select $selected\" onchange=\"dateChange(this, '$person', '$date');\">";
	foreach ($attendance as $att0 => $attn0) {
		echo "<option";
		if ($att0 == $selected) {
			echo " selected";
		}
		echo " id=\"$att0\" class=\"$att0\">$attn0</option>";
	}
	echo "</select>";
}

?>









