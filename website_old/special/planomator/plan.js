var temp0;

// Edits are double-checked server-side.
var edits = {};

// Ensures person exists in edits.
function make(person) {
	if (edits[person] == null || edits[person] == undefined) {
		edits[person] = {};
	}
}

function foodAskedChange(elem, person) {
	make(person);
	edits[person]["food"] = elem.value;
}

function dateChange(elem, person, date) {
	make(person);
	elem.setAttribute("class", "date-select " + elem.selectedOptions[0].getAttribute("class"));
	edits[person][date] = elem.selectedOptions[0].getAttribute("id");
}

function countChange(elem, person, what) {
	make(person);
	edits[person][what] = elem.value;
}

function transmit() {
	edits_elem = document.getElementById("edits");
	edits_elem.value = JSON.stringify(edits);
	document.getElementById("edit_form").submit();
}







