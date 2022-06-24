<?php

require_once "/var/www/pgsql_connect.php";
$sql = pgsql_connect();

if (!$sql) {
	die ("Connection failed: " . pg_last_error());
}

// Creates a new planner.
// Returns the planner's ID.
function createPlanner() {
	global $sql;
	
	// Create an entry in the index table.
	$query = "INSERT INTO planner_index (name, show_att, show_food, show_bring, name_att, name_food, name_bring) "
			."VALUES ('PLANOMATOR', TRUE, TRUE, TRUE, 'Attendance', 'Food choice', 'Snacks') RETURNING id;";
	$res   = pg_query($sql, $query);
	if ($res) {
		$arr = pg_fetch_array($res, 0, PGSQL_ASSOC);
		$id  = (int) $arr['id'];
	} else {
		die(pg_last_error($sql));
	}
	
	// Create an entry in the bring table.
	$query = "INSERT INTO planner_bring (id, val) VALUES ($1, 'Other')";
	$res   = pg_query_params($sql, $query, array($id));
	
	// Create an entry in the people table.
	$query = "INSERT INTO planner_people (id, val) VALUES ($1, 'Mr. Avocado')";
	$res   = pg_query_params($sql, $query, array($id));
	
	return $id;
}

function planBody() {
	global $_SERVER, $sql, $id, $name;
	
	// Find the query parameters.
	$parts = parse_url($_SERVER['REQUEST_URI']);
	$id    = (int) $parts['query'];
	
	if ($id == 0) {
		// Create new planner.
		$id = createPlanner();
		// And form a redirect.
		echo '<meta http-equiv="refresh" content="0;?'. $id. '">';
	}
	
	// Verify planner exists.
	$query = "SELECT (name) FROM planner_index WHERE id=$1;";
	$res   = pg_query_params($sql, $query, array($id));
	if ($res) {
		$arr  = pg_fetch_array($res, 0, PGSQL_ASSOC);
		$name = $arr['name'];
	} else {
		die(pg_last_error($sql));
	}
	
	// Create page header.
	echo '<div class="header"><h1>'. htmlspecialchars($name). '</h1></div>';
}

function planContent() {
	global $sql, $id;
}

?>