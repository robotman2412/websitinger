<?php

$useragent=$_SERVER['HTTP_USER_AGENT'];
$logStats = !isset($_COOKIE["no_stats"]);

require_once "libs/Mobile_Detect.php";
$detect = new Mobile_Detect;
$isusermobile = $detect->isMobile();

function addImageScrolling($images) {
	static $scrollID = -1;
	$scrollID ++;
	$numimgs = sizeof($images);
	$numdisp = $numimgs + 1;
	echo "<div id=\"scroll_outer_$scrollID\" class=\"image-scroll-wide-o\"><style id=\"scroll_style_$scrollID\"></style>";
	echo "<div id=\"scroll_inner_$scrollID\" class=\"image-scroll-wide-i image-scroll-gen-$scrollID\" style=\"width: ", $numdisp, "00%;\">";
	$i = 0;
	foreach ($images as $imagew) {
		addImageScrolling0($imagew, $i, $numdisp);
		$i ++;
	}
	addImageScrolling0($images[0], $numimgs, $numdisp);
	echo "</div><script>registerImageScroll($scrollID, $numdisp);</script></div>";
}

function addImageScrolling0($imgmeta, $index, $total) {
	echo "<div style=\"left: ", $index / $total * 100, "%; position: absolute; top: 0;\"><center><img src=\"", $imgmeta, "\" style=\"height: 100%; width: auto;\"></center></div>";
}

function imageSizeAtr($imagname) {
	$info = getimagesize($imagename);
	return "width\"" . $info[0] . "\" height\"" . $info[1] . "\"";
}

function footer() {
	echo file_get_contents("/var/www/html/footer.html");
}

function head() {
	global $isusermobile;
	global $logStats;
	echo "<script id=\"server_side_template_loader\">var templates = {};";
	$templates = json_decode(file_get_contents("/var/www/html/data/templates/index.json"), true);
	foreach ($templates as $idw => $templatew) {
		echo "templates[\"$idw\"] = \"";
		if ($isusermobile) {
			echo str_replace(array("\\", "\t", "\r\n", "\n", "\n", "\"", "\'", "</script>"), array("\\\\", " ", " ", " ", " ", "\\\"", "\\\'", "</\" + \"script\" + \">"), file_get_contents("/var/www/html/data/templates/".$templatew["mobile"]));
		}
		else
		{
			echo str_replace(array("\\", "\t", "\r\n", "\r", "\n", "\"", "\'", "</script>"), array("\\\\", " ", " ", " ", " ", "\\\"", "\\\'", "</\" + \"script\" + \">"), file_get_contents("/var/www/html/data/templates/".$templatew["desktop"]));
		}
		echo "\";";
	}
	echo "Object.freeze(templates);</script>";
	if ($isusermobile) {
		echo "<script id=\"server_side_mobile_detect\">const isUserMobile = true;</script>";
		echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"index_mobile.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"project_mobile.css\">";
	}
	else
	{
		echo "<script id=\"server_side_mobile_detect\">const isUserMobile = false;</script>";
		echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"index.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"project.css\">";
	}
	if ($logStats) {
		$stats = json_decode(file_get_contents("/home/pi/stats.json"), true);
		if (!array_key_exists($_SERVER["PHP_SELF"], $stats)) {
			$stats[$_SERVER["PHP_SELF"]] = 1;
		}
		else
		{
			$stats[$_SERVER["PHP_SELF"]] = $stats[$_SERVER["PHP_SELF"]] + 1;
		}
		file_put_contents("/home/pi/stats.json", json_encode($stats) . "\n");
	}
}

?>