<?php
require "/var/www/pgsql_connect.php";
$sql=pgsql_connect();

function add_response($k, $v) {
    echo $k. ":". $v. "\n";
}

function hiscore() {
    global $sql;

    // Hiscore lookup.
    $query = "SELECT nick, score FROM game_users ORDER BY -score;";
    $res   = pg_query($sql, $query);

    if (!$res) {
        // IDK what happened.
        add_response("error", "database error");
        return false;
    } else if (pg_num_rows($res) > 0) {
        // Return the pair of data.
		return pg_fetch_array($res, 0, PGSQL_ASSOC);
    } else {
        // Still no data.
        return false;
    }
}

function find($id) {
    global $sql;

    // User lookup.
    $query = "SELECT nick, score FROM game_users WHERE id = $1;";
    $res   = pg_query_params($sql, $query, array($id));

    if (!$res) {
        // IDK what happened.
        add_response("error", "database error");
        return false;
    } else if (pg_num_rows($res) > 0) {
        // Return the pair of data.
		return pg_fetch_array($res, 0, PGSQL_ASSOC);
    } else {
        // Still no data.
        return false;
    }
}

function register($id, $name) {
    global $sql;

    if (find($id)) {
        add_response("error", "user already registered");
    } else {
        // Create a new entry.
        $query = "INSERT INTO game_users (id, nick, score) VALUES ($1, $2, 0);";
        $res   = pg_query_params($sql, $query, array($id, $name));
        if ($res) {
            add_response("success", "registered");
        } else {
            add_response("error", "database error");
        }
	}
}

function pror() {
    if ($_GET['info'] == "hiscore") {
        $user = hiscore();
        if ($user) {
            add_response("hiscore", $user['score']);
            add_response("hiscore_nick", $user['nick']);
        }
    }
    if ($_GET['info']) {
        // Ignore the rest on info requests.
        return;
    }

    if (!$_GET['id']) {
        add_response("error", "missing id in query");
        return;
    }
    $id = $_GET['id'];

    if ($_GET['register']) {
        register($id, $_GET['register']);
    }
}

pror();

?>