<?php

// Is user mobile?
require_once "/var/www/html/s/php/libs/Mobile_Detect.php";
$detect = new Mobile_Detect;
$isusermobile = $detect->isMobile();

echo "<!--AhjgF RWc!-->";
// Lettuce barf header.
if ($isusermobile) {
	echo file_get_contents("/var/www/html/s/html/head_mobile_a.html");
}
else
{
	echo file_get_contents("/var/www/html/s/html/head_a.html");
}

function footer() {
	echo file_get_contents("/var/www/html/s/html/footer.html");
}

function page_header() {
	echo file_get_contents("/var/www/html/s/html/page_header.html");
}

?>