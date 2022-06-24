<!DOCTYPE html>
<html>
<head>
	<?php require "../../s/php/index.php"; require "plan.php"; ?>
	<title>RobotMan2412's website</title>
	<script src="plan.js"></script>
	<link rel="stylesheet" href="plan.css" type="text/css">
</head>
<body onload="loaded();">
	<div id="template_builder" style="display:none;"></div>
	<div id="outer_content" class="content-o">
		<?php page_header(); ?>
		<div id="inner_content" class="content-i">
			<?php planBody(); ?>
			<div class="block-full">
				<center><p>NOTE: This is a WIP planner.</p></center>
				<?php planContent(); ?>
				
				<form id="edit_form" style="display: none;" method="post" enctype="multipart/form-data">
					<input type="text" name="edits" id="edits">
				</form>
				<!--<table class="date-table"> https://www.youtube.com/watch?v=dQw4w9WgXcQ
					<tr id="people">
						<th class="l"></th>
						<th class="i">Robot</th>
						<th class="i">Dave</th>
						<th class="i">IGOR</th>
						<th class="i">R24owan</th>
						<th class="i">Maxx</th>
					</tr>
					<tr id="date0">
						<th class="l">Date0</th>
						<th><input type="checkbox" id="date0_robot"></th>
						<th><input type="checkbox" id="date0_dave"></th>
						<th><input type="checkbox" id="date0_igor"></th>
						<th><input type="checkbox" id="date0_r24owan"></th>
						<th><input type="checkbox" id="date0_max"></th>
					</tr>
				</table>!-->
			</div>
			<?php footer(); ?>
		</div>
	</div>
</body>
</html>
