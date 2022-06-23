<!DOCTYPE html>
<html>
<head>
	<?php require "../s/php/index.php"; ?>
	<title>Blog - RobotMan2412's website</title>
</head>
<body onload="loaded();">
<div id="template_builder" style="display:none;"></div>
<div id="outer_content" class="content-o">
	<?php page_header(); ?>
	<div id="inner_content" class="content-i">
<?php

require_once "/var/www/pgsql_connect.php";
$sql = pgsql_connect();
function sql_esc($raw) {
	return pg_escape_string($raw);
}
function sql_bool($raw) {
	return $raw ? "TRUE" : "FALSE";
}

// Find the query parameters.
$parts = parse_url($_SERVER['REQUEST_URI']);
parse_str($parts['query'], $query);

$mail_addr  = strtolower($query['mail_addr']);
$mail_blog  = $query['mail_blog']  == "on";
$mail_event = $query['mail_event'] == "on";

$valid = false != preg_match("/[\w-]+(\\.[\w-]+)*@[\w-]+(\\.[\w-]+)+/", $mail_addr);

$unsub = !$mail_blog && !$mail_event;

if (!$sql) {
	echo "Error: Could not connect to database.<br>";
} else if ($valid) {
	if ($unsub) {
		// Delete entry.
		$putq = "DELETE FROM mailinglist WHERE email='". sql_esc($mail_addr). "';";
		$resp  = pg_query($putq);
		if (!$resp) {
			echo "Error: " . htmlspecialchars(pg_last_error()) . "<br>";
		}
	} else {
		// Insert new data.
		$putq = "INSERT INTO mailinglist VALUES ('". sql_esc($mail_addr). "', ". sql_bool($mail_blog). ", ". sql_bool($mail_event). ")".
				" ON CONFLICT (email) DO UPDATE SET mail_blog=excluded.mail_blog, mail_event=excluded.mail_event;";
		$resp  = pg_query($putq);
		if (!$resp) {
			echo "Error: " . htmlspecialchars(pg_last_error()) . "<br>";
		}
	}
}

if (!$valid) {
?>
		<div class="header"><h1>Invalid email</h1></div>
		<div class="block-full">
			<p class="justify">
				The provided email address is invalid.<br>
				<a href="/blog">Go back.</a>
			</p>
		</div>
<?php
} else if ($unsub) {
?>
		<div class="header"><h1>You've unsubscribed.</h1></div>
		<div class="block-full">
			<p class="justify">
				You (<?php echo htmlspecialchars($mail_addr); ?>) won't receive any more emails from me,
				and your email address has been forgotten.<br>
				<a href="/blog">Go back.</a>
			</p>
		</div>
<?php
// From unsubscribe to subscribe.
} else {
?>
		<div class="header"><h1>Thanks for subscribing!</h1></div>
		<div class="block-full">
			<h2 class="p-header">You (<?php echo htmlspecialchars($mail_addr); ?>) subscribed to:</h2>
			<ul>
<?php
if ($mail_blog)  echo "<li>New blog posts</li>";
if ($mail_event) echo "<li>Upcoming events</li>";
?>
			</ul>
			<p class="justify">
				Was this a mistake?
				<a href=
<?php
echo "\"mail-submit?mail_addr=". urlencode($mail_addr). "\"";
?>
				>Unsubscribe now.</a><br>
				<a href="/blog">Go back.</a>
			</p>
		</div>
<?php
// Closing if statement.
}
?>
		<?php footer(); ?>
	</div>
</div>
</body>
</html>
