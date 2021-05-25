<?php

// Is user mobile?
require_once "libs/Mobile_Detect.php";
$detect = new Mobile_Detect;
$isusermobile = $detect->isMobile();

// Lettuce barf header.
if ($isusermobile) {
	echo file_get_contents("../html/head_mobile_a.html");
}
else
{
	echo file_get_contents("../s/html/head_a.html");
}

function footer() {
	echo file_get_contents("../s/html/footer.html");
}

function page_header() {
	echo file_get_contents("../s/html/page_header.html");
}

?>