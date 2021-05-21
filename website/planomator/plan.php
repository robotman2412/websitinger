<?php

$people = [
	"Robot",
	"Dave",
	"IGOR",
	"R24owan",
	"Maxx"
];

$attendance = [
	"unknown" => "weet niet",
	"can-go" => "kan",
	"cannot-go" => "kan niet"
];

$customdatatypes = [
	"attendance" => [
		"subset" => "choose",
		"list" => [
			"unknown" => "weet niet",
			"can-go" => "kan",
			"cannot-go" => "kan niet"
		],
		"colors" => [
			"unknown" => "ffffff",
			"can-go" => "1fff0f",
			"cannot-go" => "ff4f4f"
		]
	]
];

$layout = [
	[
		"type" => "table",
		"title" => "komen",
		"datatype" => "custom:attendance",
		"storage" => "attendance",
		
		"default" => "unknown",
		"left" => "text",
		"top" => "people",
		"expand" => "nieuwe datum voorstellen"
	],
	[
		"type" => "list",
		"title" => "pizzas",
		"datatype" => "text",
		"storage" => "pizzas",
		
		"key" => "people"
	],
	[
		"type" => "table",
		"title" => "brengen",
		"datatype" => "number",
		"storage" => "attendance",
		
		"default" => 0,
		"left" => "text",
		"top" => "people",
		"expand" => "nieuw ding brengen of vragen"
	]
];

function planBody() {
	//TODO: Auth and shits.
}

function planContent() {
	global $layout, $customdatatypes;
	foreach ($layout as $layout0) {
		echo "<center><h2>" . $layout0["title"] . "</h2></center>";
		if ($layout0["type"] == "table") {
			planTable($layout0);
		}
		elseif ($layout0["type"] == "list") {
			planList($layout0);
		}
	}
}

function planTable($layout) {
	$storage = $layout["storage"];
	$left = getList($storage, $layout["left"]);
	$top = getList($storage, $layout["top"]);
	$datatype = $layout["datatype"];
	
		echo "<table><tr><th class=\"l\"></th>";
		foreach ($top as $top0) {
			echo "<th>";
			echo "</th>";
		}
		echo "</tr>";
}

function getList($storage, $type) {
	global $people;
	if ($type == "people") {
		return $people;
	}
	elseif ($type == "text") {
		return []; //TODO: load list
	}
}

?>









