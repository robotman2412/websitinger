<?php

// Is user mobile?
require_once "/var/www/test/s/php/libs/Mobile_Detect.php";
$detect = new Mobile_Detect;
$isusermobile = $detect->isMobile();

// Lettuce barf header.
if ($isusermobile) {
	echo file_get_contents("/var/www/test/s/html/head_mobile_a.html");
}
else
{
	echo file_get_contents("/var/www/test/s/html/head_a.html");
}

function footer() {
	echo file_get_contents("/var/www/test/s/html/footer.html");
}

function blog_footer() {
	echo file_get_contents("/var/www/test/s/html/blog_footer.html");
}

function page_header() {
	echo file_get_contents("/var/www/test/s/html/page_header.html");
}

// Create statistics.
require_once "/var/www/test/s/php/stats.php";

?>