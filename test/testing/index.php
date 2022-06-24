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
			<a href="squishjs">squish.js</a>
			<a href="lolwhocares">lolwho.cares</a>
			<a href="txtcompress">txtcompress</a>
			<a href="dave">dave</a>
			<form method="post" enctype="multipart/form-data">
				<input type="date" name="until">
				<input type="text" name="splash">
				<input type="submit">
			</form>
<?php

require_once "/var/www/pgsql_connect.php";
$sql = pgsql_connect();

function sql_esc($raw) {
	return pg_escape_string($raw);
}

if (!$sql) {
  die ("Connection failed: " . pg_last_error());
}
//$sql->query("use testdb;");

if (array_key_exists("until", $_POST)) {
	$putq  = "insert into countdowns (until, splash, longtexts, shorttexts) values (" .
	$putq .= "'" . sql_esc($_POST['until']) . "',";
	$putq .= "'" . sql_esc($_POST['splash']) . "',";
	$putq .= "'{\"THIS IS NOT\"}',";
	$putq .= "'{\"1\",\"2\"}'";
	$putq .= ");";
	if (!pg_query($putq)) {
		echo "Error $putq: " . pg_last_error() . "<br>";
	}
}

//$getq = "select name, msg from msg order by -id;";
$getq = "select id, until, splash from countdowns;";

$result = pg_query($getq);
if (!$result) {
	echo "FOKEN ERROR: " . htmlspecialchars(pg_last_error());
}
else
{
	echo "<table>\n";
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		echo "\t<tr>\n";
		foreach ($line as $col_value) {
			echo "\t\t<td>" . htmlspecialchars($col_value) . "</td>\n";
		}
		echo "\t</tr>\n";
	}
	echo "</table>\n";
	pg_free_result($result);

	pg_close($sql);
}

?>
		</div>
		<?php footer(); ?>
	</div>
</div>
</body>
</html>






