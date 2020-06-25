<?php

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

?>