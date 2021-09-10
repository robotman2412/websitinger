<!DOCTYPE html>
<html>
<head>
	<title id="title">Testing - RobotMan2412's website</title>
	<?php require "../s/php/index.php"; ?>
</head>
<body onload="loaded(); clearStyle='rgb(127, 93, 175)'; fillStyle='#ffffff'; no_title = true; start_countdown();">
<div id="template_builder" style="display:none;"></div>
<div id="outer_content" class="content-o">
	<?php page_header(); ?>
	<div id="inner_content" class="content-i">
		<div class="header"><h1>Testing</h1></div>
		<div class="block-full">
			<form method="post" enctype="multipart/form-data">
			    <input type="hidden" name="button" value="1">
				<input type="submit">
			</form>
			<form method="post" enctype="multipart/form-data">
			    <input type="hidden" name="button" value="2">
				<input type="submit">
			</form>
<?php

if (array_key_exists("button", $_POST)) {
    if ($_POST['button'] == "1") {
        echo "Posted button 1.<br>";
    } else if ($_POST['button'] == "2") {
        echo "Posted button 2.<br>";
    }
}

?>
		</div>
		<?php footer(); ?>
	</div>
</div>
</body>
</html>







