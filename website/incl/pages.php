<?php

$pages = json_decode(file_get_contents("/var/www/html/pages.json"), true)['pages'];

foreach ($pages as $pagew) {
	$pagewhref = $pagew['href'];
	$pagewtitle = $pagew['name'];
	$pagewtext = $pagew['short'];
	echo "<a href=$pagewhref><div class=\"page-w\" title=\"$pagewtitle\"><center class=\"page-w-text\">$pagewtext</center></div></a><div class=\"page-w-split\"></div>";
}

?>
