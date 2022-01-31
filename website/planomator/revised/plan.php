<?php

require_once "/var/www/pgsql_connect.php";
$sql = pgsql_connect();

$index_table = "planner_index";
$id = 0;

function sql_esc($raw) {
	return pg_escape_string($raw);
}

if (!$sql) {
	die ("Connection failed: " . pg_last_error());
}

// Assumes the given id is a number.
function createPlanner($id) {
	global $index_table, $sql;
	
	$attName = "planner_". $id. "_att";
	$foodName = "planner_". $id. "_food";
	$bringName = "planner_". $id. "_bring";
	
	// Create appropriate meta table.
// 	$query = "create table ". $metaName, " (".
// 		"id SERIAL PRIMARY KEY,".
// 		"type VARCHAR(16) NOT NULL,".
// 		"value VARCHAR(64) NOT NULL".
// 	");";
// 	pg_query($query);
	
	// Enter meta table in index.
	$query = "insert into ". $index_table. "()";
	pg_query($query);
	
}

function planBody() {
}

function planContent() {
}

?>