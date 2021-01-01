<?php

$projectsIndex = addHref(json_decode(file_get_contents("/var/www/html/data/projects_index.json"), true, 65536));
$projID = getProjID();
$proj = getProjectFromName($projID);

function getProjID() {
	$arr0 = array();
	parse_str($_SERVER['QUERY_STRING'], $arr0);
	return $arr0['proj'];
}

function addHref($proj) {
	$proj['href'] = "/project";
	$proj = addHref0($proj, "");
	return $proj;
}

function addHref0($proj, $idst) {
	foreach ($proj['content'] as $idw => &$projw) {
		if ($projw['is_category']) {
			$projw = addHref0($projw, $idst . $idw . ".");
		}
		$projw['href'] = "/project?proj=" . $idst . $idw;
	}
	return $proj;
}

function getProjectFromName($projName) {
	global $projectsIndex;
	if (strlen($projName) < 1) {
		return $projectsIndex;
	}
	$names = explode(".", $projName);
	$current = $projectsIndex;
	foreach ($names as $namew) {
		if (!$current['is_category']) {
			return false;
		}
		if (!array_key_exists('content', $current)) {
			return false;
		}
		if (!array_key_exists($namew, $current['content'])) {
			return false;
		}
		$current = $current['content'][$namew];
	}
	return $current;
}

function previewProjectByID($proj_id) {
	previewProject(getProjectFromName($proj_id));
}

function previewProject($proj) {
	$imageurl = "/web_missing_img.png";
	if (array_key_exists("image_url", $proj)) {
		$imageurl = $proj["image_url"];
	}
	$projname = $proj["name"];
	$projhref = $proj["href"];
	$projdesc = $proj["quickdesc"];
	$status = "";
	if ($proj["is_category"]) {
		if (!$proj["is_ongoing"]) {
			$status = "archived category";
		}
		else
		{
			$status = "category";
		}
	}
	else
	{
		if ($proj["is_ongoing"]) {
			$status = "ongoing project";
		}
		else
		{
			$status = "finished project";
		}
	}
	echo "<a class=\"w\" href=\"", $projhref, "\"><div class=\"proj-prev-o\"><div class=\"proj-prev-i\">";
	echo "<div class=\"proj-prev-img-o\"><div class=\"proj-prev-img-h\"></div><img class=\"proj-prev-img-i\" src=\"", $imageurl, "\"></div>";
	echo "<div class=\"proj-prev-desc-o\"><div class=\"proj-prev-desc-i\">";
	echo "<h3 class=\"proj-prev-title\">", $projname, "</h3><p class=\"proj-prev-desc\">", $projdesc, "</p><p class=\"proj-prev-status\">", $status, "</p>";
	echo "</div><div class=\"proj-prev-desc-f\"></div></div>";
	echo "<p class=\"proj-prev-read\">Read more...</p></div></div></a>";
}

function windowTitle() {
	global $proj;
	if ($proj == false) {
		echo "Missing project - RobotMan2412's website.";
	}
	else
	{
		$projname = $proj['name'];
		echo "$projname - RobotMan2412's website.";
	}
}

function pageTitle() {
	global $proj;
	if ($proj == false) {
		echo "Oops!";
	}
	else
	{
		$projname = $proj['name'];
		echo $projname;
	}
}

function projHierarchy() {
	global $projectsIndex;
	echo "<div id=\"proj-hierarchy-holder\" class=\"proj-hier-h\">";
	projHierarchy0($projectsIndex, 0, 0);
	echo "</div>";
}

function projHierarchy0($proj, $top, $depth) {
	$style = "left: " . $depth * 10 . "px; top: " . $top . "px;";
	if ($proj['is_category']) {
		echo "<a class=\"w\" href=\"", $proj['href'], "\"><div style=\"", $style, "\" class=\"proj-h-entry\">", $proj['name'], "</div></a>";
		$top += 20;
		foreach ($proj['content'] as $projw) {
			$top = projHierarchy0($projw, $top, $depth + 1);
		}
		return $top;
	}
	else
	{
		echo "<a class=\"w\" href=\"", $proj['href'], "\"><div style=\"", $style, "\" class=\"proj-h-entry\">", $proj['name'], "</div></a>";
		return $top + 20;
	}
}

function projContent() {
	global $proj;
	global $projectsIndex;
	global $projID;
	if ($proj == false) {
		$id0 = $_SERVER['QUERY_STRING'];
		echo "<p>This project is missing!<br>If a link on this website led you here, please contact RobotMan2412 and tell him:<br>missing project, query: $id0</p>";
		return;
	}
	if ($proj['is_category']) {
		if (!$proj['is_ongoing']) {
			echo "<p>Note: This category has been archived.</p>";
		}
		echo "<center><h1 style=\"margin-bottom: 0;\">", $proj['name'], "</h1><p style=\"margin-top: 0; font-size: 20px;\">category</p></center>";
		$paf = "/var/www/html" . $proj['description_name'];
		echo file_get_contents($paf);
		if ($proj == $projectsIndex) {
			//$imgfiles = scandir("/var/www/html/data/projects/images");
			$images = [
				"/data/projects/images/wacc.jpg",
				"/data/projects/images/freddy.png"
			];
			//addImageScrolling($images);
		}
		foreach ($proj['content'] as $subidw => $subprojw) {
			previewProject($subprojw);
		}
	}
	else
	{
		if ($proj['is_ongoing']) {
			echo "<p>Note: This project is currently ongoing.</p>";
		}
		$paf = "/var/www/html" . $proj['content_name'];
		echo file_get_contents($paf);
	}
}

?>