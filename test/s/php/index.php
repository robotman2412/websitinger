<?php

//require_once "/var/www/mysql_connect.php";

// Is user mobile?
require_once "/var/www/test/s/php/libs/Mobile_Detect.php";
$detect = new Mobile_Detect;
$isusermobile = $detect->isMobile();

// Lettuce barf header.
if ($isusermobile) {
	echo file_get_contents("/var/www/test/s/html/head_mobile.html");
}
else
{
	echo file_get_contents("/var/www/test/s/html/head.html");
}

function footer() {
	echo file_get_contents("/var/www/test/s/html/footer.html");
}

function page_header() {
	echo file_get_contents("/var/www/test/s/html/page_header.html");
}

?>