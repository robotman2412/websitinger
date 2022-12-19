<!DOCTYPE html>
<html>
<head>
	<title id="title">RobotMan2412's website</title>
	<?php require "../../s/php/index.php"; ?>
	<!-- app !-->
	<script src="bits.js"></script>
	<link href='bits.css' rel='stylesheet' type='text/css'>
</head>
<body onload="loaded(); bitsLoaded();">
<div id="template_builder" style="display:none;"></div>
<div id="outer_content" class="content-o">
	<?php page_header(); ?>
	<div id="inner_content" class="content-i">
		<div class="header"><h1>The boolean algebra</h1></div>
		<div class="block-full">
			<h1 class="p-header">Karnaugh diagram</h1>
			<table class="k-diagram" id="k_diagram">
				<tr>
					<td></td><td></td style="border-right: 1px solid #ffffff;"><td>Q32</td>
				</tr>
				<tr>
					<td></td><td></td>
					<td style="border-bottom: 1px solid #ffffff;">00</td><td style="border-bottom: 1px solid #ffffff;">01</td><td style="border-bottom: 1px solid #ffffff;">11</td><td style="border-bottom: 1px solid #ffffff;">10</td>
				</tr>
				<tr>
					<td>Q1</td><td style="border-right: 1px solid #ffffff;">0</td>
					<td>0</td><td>1</td><td>x</td><td>1</td>
				</tr>
				<tr>
					<td></td><td style="border-right: 1px solid #ffffff;">1</td>
					<td>0</td><td>x</td><td>1</td><td>1</td>
				</tr>
			</table>
		</div>
		<?php footer(); ?>
	</div>
</div>
</body>
</html>
