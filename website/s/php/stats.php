
<?php

// Get an SQL instance.
require_once "/var/www/pgsql_connect.php";
$stat_sql = pgsql_connect();

// If successful, log visit.
if ($stat_sql) {
	$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$address     = $_SERVER['REMOTE_ADDR'] or "?";
	
	$putq  = "insert into page_visits (visit_url, client_address, visit_date)";
	$putq .= "values ('". pg_escape_string($actual_link). "', '". pg_escape_string($address). "', current_timestamp);";
	pg_query($stat_sql, $putq);
	pg_close($stat_sql);
}

?>
