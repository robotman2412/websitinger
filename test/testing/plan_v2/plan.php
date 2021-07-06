<?php

require_once "/var/www/pgsql_connect.php";
$sql = pgsql_connect();

function sql_esc($raw) {
	return pg_escape_string($raw);
}

?>









