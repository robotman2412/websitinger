
class TrackLayout {
	constructor(tableElem, leverElem) {
		this.tracks    = [];
		this.switches  = [];
		this.levers    = [];
		this.tableElem = tableElem;
		this.leverElem = leverElem;
		this.id        = tableElem.getAttribute('id');
		this.selected  = null;
		this.ghost     = null;
		if (!this.id) {
			this.id = `track_table_${getId()}`;
			tableElem.setAttribute('id', this.id);
		}
		// Make the table now.
		this.trackWidth  = 100;
		this.trackHeight = 50;
		this.width  = 0;
		this.height = 0;
		this.resizeTable(3, 3);
	}
	
	select(object, event) {
		if (editMode.value && !this.isPartPicker) {
			// In edit mode, we don't select.
			if (object && object.deselect)
				object.deselect();
			return;
		}
		if (this.selected && this.selected.deselect) {
			this.selected.deselect();
		}
		this.selected = object;
		event.stopPropagation();
	}
	
	resizeTable(width, height) {
		if (width < this.width) {
			// Remove additional columns.
			for (var y = 0; y < this.height; y++) {
				for (var x = width; x < this.width; x++) {
					var toRemove = document.getElementById(`${this.id}_r_${y}_c_${x}`);
					toRemove.parentElement.removeChild(toRemove);
				}
			}
		} else if (width > this.width) {
			// Add additional columns.
			for (var y = 0; y < this.height; y++) {
				var row = document.getElementById(`${this.id}_r_${y}`);
				for (var x = this.width; x < width; x++) {
					var toAdd = document.createElement('td');
					toAdd.setAttribute('id', `${this.id}_r_${y}_c_${x}`);
					// Edit mode shenanigans.
					(function (x, y, layout) {
						toAdd.onclick = (event) => layout.cellClicked(event, x, y);
						toAdd.onmouseenter = (event) => layout.cellHovered(event, x, y, true);
						toAdd.onmouseleave = (event) => layout.cellHovered(event, x, y, false);
					})(x, y, this);
					row.appendChild(toAdd);
				}
			}
		}
		if (height < this.height) {
			// Remove additional rows.
			for (var y = this.height; y < height; y++) {
				delete this.tracks[y];
				var toRemove = document.getElementById(`${this.id}_r_${y}`);
				toRemove.parentElement.removeChild(toRemove);
			}
		} else if (height > this.height) {
			// Add additional rows.
			for (var y = this.height; y < height; y++) {
				this.tracks[y] = [];
				var row = document.createElement('tr');
				row.setAttribute('id', `${this.id}_r_${y}`);
				this.tableElem.appendChild(row);
				// And columns.
				for (var x = 0; x < width; x++) {
					var toAdd = document.createElement('td');
					toAdd.setAttribute('id', `${this.id}_r_${y}_c_${x}`);
					// Edit mode shenanigans.
					(function (x, y, layout) {
						toAdd.onclick = (event) => layout.cellClicked(event, x, y);
						toAdd.onmouseenter = (event) => layout.cellHovered(event, x, y, true);
						toAdd.onmouseleave = (event) => layout.cellHovered(event, x, y, false);
					})(x, y, this);
					row.appendChild(toAdd);
				}
			}
		}
		this.width = width;
		this.height = height;
	}
	
	moveTable(dx, dy) {
		// Make a table of the old arrangement.
		var old = [];
		var _new = [];
		for (var y = 0; y < this.height; y++) {
			old[y] = [];
			_new[y] = [];
			for (var x = 0; x < this.width; x++) {
				old[y][x] = this.tracks[y][x];
			}
		}
		// Calculate the way to move everything.
		var ox = dx < 0 ? -dx : 0;
		var oy = dy < 0 ? -dy : 0;
		var nx = dx > 0 ? dx : 0;
		var ny = dy > 0 ? dy : 0;
		var dw = this.width  - Math.abs(dx);
		var dh = this.height - Math.abs(dy);
		// Now, relocate elements to the new location.
		for (var y = 0; y < dh; y++) {
			for (var x = 0; x < dw; x++) {
				// Position in new array.
				var newX = nx + x;
				var newY = ny + y;
				// Position in old array.
				var oldX = ox + x;
				var oldY = oy + y;
				// Literally tell the track to relocate itself.
				if (!!old[oldY][oldX]) {
					old[oldY][oldX].relocate(document.getElementById(`${this.id}_r_${newY}_c_${newX}`));
					old[oldY][oldX].x = newX;
					old[oldY][oldX].y = newY;
				}
				// Move the values over.
				_new[newY][newX] = old[oldY][oldX];
			}
		}
		this.tracks = _new;
	}
	
	addTrack(track, x, y) {
		// Account for adding top or left.
		if (x < 0) {
			this.resizeTable(this.width - x, this.height);
			this.moveTable(-x, 0);
			x = 0;
		}
		if (y < 0) {
			this.resizeTable(this.width, this.height - y);
			this.moveTable(0, -y);
			y = 0;
		}
		if (x >= this.width || y >= this.height) {
			this.resizeTable(Math.max(this.width, x + 1), Math.max(this.height, y + 1));
		}
		// Check for existing tracks here.
		if (!!this.tracks[y][x]) {
			if (this.tracks[y][x] instanceof SwitchTrack) {
				// Reassign switch numbers.
				this.switches = this.switches.filter((e) => e != this.tracks[y][x]);
				this.renumberSwitches();
			}
			this.tracks[y][x].removed();
		}
		// Add the track.
		this.tracks[y][x] = track;
		track.x = x;
		track.y = y;
		track.parent = document.getElementById(`${this.id}_r_${y}_c_${x}`);
		track.layout = this;
		track.id = getId();
		track.createSvg(this.trackWidth, this.trackHeight);
		if (track instanceof SwitchTrack) {
			// Assign switch numbers.
			this.switches = this.switches.concat(track);
			this.renumberSwitches();
		}
		track.added();
		// Have everything update itself.
		this.updateDisplay();
		return track;
	}
	
	removeTrack(x, y) {
		if (this.tracks[y] && this.tracks[y][x]) {
			// This is very simple.
			var track = this.tracks[y][x]
			if (track instanceof SwitchTrack) {
				// Reassign switch numbers.
				this.switches = this.switches.filter((e) => e != track);
				this.renumberSwitches();
			}
			track.removed();
			delete this.tracks[y][x];
			// Have everything update itself.
			this.updateDisplay();
		}
	}
	
	addLever(parentObject, category, name, id=null, stateNames=null) {
		var catElem = document.getElementById(`${category}_levers`);
		let i = this.levers.length;
		if (!id) id = getId();
		var lever = {
			category: category,
			onchange: null,
			elem:     null,
			parent:   parentObject,
			isOn:     false,
			id:       id,
			name:     name,
			fullName: `${parentObject.name}${name}`
		};
		this.levers[i] = lever;
		
		// TODO: A nicer look for this element.
		var inputElem = document.createElement("input");
		inputElem.setAttribute('id', id);
		inputElem.setAttribute('type', 'checkbox');
		inputElem.onchange = (event) => {
			lever.isOn = inputElem.checked;
			if (!!lever.onchange) lever.onchange(event);
		};
		
		var labelElem = document.createElement("label");
		labelElem.setAttribute('id', `${id}_label`);
		labelElem.setAttribute('for', id);
		labelElem.innerText = lever.fullName;
		
		var breakElem = document.createElement("br");
		breakElem.setAttribute('id', `${id}_break`);
		
		catElem.appendChild(inputElem);
		catElem.appendChild(labelElem);
		catElem.appendChild(breakElem);
		
		return this.levers[i];
	}
	
	removeLever(lever) {
		// Remove lever elements.
		var catElem = document.getElementById(`${lever.category}_levers`);
		catElem.removeChild(document.getElementById(lever.id));
		catElem.removeChild(document.getElementById(`${lever.id}_label`));
		catElem.removeChild(document.getElementById(`${lever.id}_break`));
		// Remove it from the array.
		this.levers = this.levers.filter((e) => e != lever);
	}
	
	updateDisplay() {
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var track = this.tracks[y][x];
				if (track) track.updateDisplay();
			}
		}
	}
	
	renumberSwitches() {
		// Assign switch numbers.
		for (var i = 0; i < this.switches.length; i++) {
			this.switches[i].switchNumber = i + 1;
			this.switches[i].name = String(i + 1);
		}
		// Update lever names.
		for (var i = 0; i < this.levers.length; i++) {
			var lever = this.levers[i];
			var labelElem = document.getElementById(`${lever.id}_label`);
			labelElem.innerText = `${lever.parent.name}${lever.name}`
		}
	}
	
	cellClicked(event, x, y) {
		// Enforce edit mode.
		if (!editMode.value || this.isPartPicker) return;
		event.stopPropagation();
		
		// If this is not the place tool, do something else.
		if (currentTool != TOOL_PLACE) {
			this.applyTool(event, x, y);
			return;
		}
		
		var added = this.addTrack(new placeConstructor(), x, y);
		// Move the table out of the corner.
		if (x == 0 && y == 0) {
			this.resizeTable(this.width + 1, this.height + 1);
			this.moveTable(1, 1);
		} else if (x == 0) {
			this.resizeTable(this.width + 1, this.height);
			this.moveTable(1, 0);
		} else if (y == 0) {
			this.resizeTable(this.width, this.height + 1);
			this.moveTable(0, 1);
		}
		// Pad the edges.
		if (x == this.width - 1) {
			this.resizeTable(this.width + 1, this.height);
		}
		if (y == this.height - 1) {
			this.resizeTable(this.width, this.height + 1);
		}
		// Special sauce.
		added.addedInEditMode();
		this.updateDisplay();
	}
	
	cellHovered(event, x, y, isEnter) {
		// Enforce edit mode.
		if (!editMode.value || this.isPartPicker) return;
	}
	
	applyTool(event, x, y) {
		var track = this.tracks[y][x];
		if (!track) return;
		
		if (currentTool == TOOL_FLIP_V) {
			track.flipVertically();
		} else if (currentTool == TOOL_FLIP_H) {
			track.flipHorizontally();
		} else if (currentTool == TOOL_ROTATE) {
			track.rotate();
		}
		
		this.updateDisplay();
	}
}

class Track {
	constructor(paths) {
		this.x = 0;
		this.y = 0;
		// Add directions.
		this.svg         = null;
		this.layout      = null;
		this.parent      = null;
		this.paths       = paths;
		this.activePathIndex = 0;
		this.activePath  = this.paths[this.activePathIndex];
		this.stops       = [];
		this.connections = [];
		this.decals      = [];
		this.reroute(paths);
	}
	
	reroute(paths) {
		this.paths = paths;
		this.connections = [];
		function addConnection(connections, from, to, full) {
			let i = from.index;
			if (!connections[i]) {
				connections[i] = [];
			}
			connections[i][to.index] = full;
		}
		for (i in this.paths) {
			addConnection(this.connections, this.paths[i].from, this.paths[i].to, this.paths[i]);
			addConnection(this.connections, this.paths[i].to, this.paths[i].from, this.paths[i]);
		}
		if (this.svg) {
			this.svg.remove();
			this.svg = null;
			this.createSvg(this.width, this.height);
		}
	}
	
	select(event) {
		this.layout.select(this, event);
		this.isSelected = true;
		this.updateActivePath();
		this.svg.classList.add("selected");
	}
	
	deselect() {
		this.isSelected = false;
		this.svg.classList.remove("selected");
	}
	
	createSvg(width, height) {
		this.width  = width;
		this.height = height;
		// SVG gore.
		var raw = `<svg xmlns="${svgNamespace}" id="${this.id}_svg" class="track" viewBox="0 0 ${width} ${height}">`;
		// Now with stylesheet!
		raw += `<defs>${svgStylesheet}</defs>`;
		this.elemId = 'track_' + getId();
		for (var i = 0; i < this.paths.length; i++) {
			this.paths[i].id = `${this.elemId}_dir_${i}`;
			raw += `<path id="${this.paths[i].id}" />`;
		}
		raw += '</svg>';
		this.parent.innerHTML = raw;
		// Get the path bits.
		for (var i = 0; i < this.paths.length; i++) {
			this.paths[i].elem = document.getElementById(this.paths[i].id);
		}
		this.svg = document.getElementById(`${this.id}_svg`);
		// Finishing touches.
		this.decalSize = Math.min(this.width, this.height) * 0.4;
		this.svg.onclick = (event) => this.select(event);
		this.updateDisplay();
	}
	
	updateDisplay() {
		function createPath(dir, width, height) {
			// Update this bit of path.
			var elem = dir.elem;
			var from = dir.from;
			var to   = dir.to;
			var path = `M${from.sx*width},${from.sy*height} Q${0.5*width},${0.5*height} ${to.sx*width},${to.sy*height}`;
			elem.setAttribute('d', path);
		}
		
		// Recalculate stops.
		for (var i in DIR_ALL) {
			var dir = DIR_ALL[i];
			var _x  = this.x + dir.dx;
			var _y  = this.y + dir.dy;
			
			// Check for track presense.
			var require = !this.layout.tracks[_y] || !this.layout.tracks[_y][_x] || !this.layout.tracks[_y][_x].connections[dir.opposite.index];
			require &= !!this.connections[dir.index] && showTrackStops.value;
			if (!!this.stops[i] && !require) {
				// Remove unnecessary stop.
				this.stops[i].parentElement.removeChild(this.stops[i]);
				delete this.stops[i];
			} else if (!this.stops[i] && require) {
				// Desired width of stop.
				var stopSize = Math.min(this.width, this.height) * 0.15;
				// Offset from the center.
				var ox = dir.dx * this.width  * 0.5;
				var oy = dir.dy * this.height * 0.5;
				// Normalise that vector.
				var amp = Math.sqrt(ox*ox + oy*oy);
				ox /= amp; oy /= amp;
				// Derive tangent vectors from it.
				var t0x = -oy * stopSize;
				var t0y =  ox * stopSize;
				var t1x =  oy * stopSize;
				var t1y = -ox * stopSize;
				// Convert to absolute points.
				var x0  = t0x + this.width  * dir.sx;
				var y0  = t0y + this.height * dir.sy;
				var x1  = t1x + this.width  * dir.sx;
				var y1  = t1y + this.height * dir.sy;
				// Apply this to a path string.
				var pathStr = `M${x0},${y0} ${x1},${y1}`;
				
				// Create the element.
				var stop = document.createElementNS(svgNamespace, "path");
				this.svg.appendChild(stop);
				stop.setAttribute('d', pathStr);
				this.stops[i] = stop;
			}
		}
		
		// Recalculate paths.
		for (var i in this.paths) {
			createPath(this.paths[i], this.width, this.height);
		}
		
		// Update decals.
		for (var i in this.decals) {
			var group = this.decals[i];
			group.list.forEach(e => e.updateDisplay());
		}
		
		this.updateActivePath();
	}
	
	updateActivePath() {
		// If the index is -1, show all as active.
		this.activePath = this.paths[this.activePathIndex];
		if (this.activePathIndex == -1 || !showSwitchDirections.value) {
			for (var i in this.paths) {
				this.paths[i].elem.classList.remove("inactive")
			}
			for (var i in this.stops) {
				this.stops[i].classList.remove("inactive");
			}
			return;
		}
		
		// Apply the inactive style to everything.
		for (var i in this.paths) {
			this.paths[i].elem.classList.add("inactive")
		}
		for (var i in this.stops) {
			this.stops[i].classList.add("inactive");
		}
		
		if (!this.activePath) return;
		// Excluding the active path.
		// Also move them to the front.
		this.activePath.elem.classList.remove("inactive");
		this.svg.appendChild(this.activePath.elem);
		if (this.stops[this.activePath.from.index]) {
			this.stops[this.activePath.from.index].classList.remove("inactive");
			this.svg.appendChild(this.stops[this.activePath.from.index]);
		}
		if (this.stops[this.activePath.to.index]) {
			this.stops[this.activePath.to.index].classList.remove("inactive");
			this.svg.appendChild(this.stops[this.activePath.to.index]);
		}
	}
	
	relocate(newParent) {
		this.parent = newParent;
		this.parent.appendChild(this.svg);
		for (var i in this.decals) {
			this.parent.appendChild(this.decals[i].elem);
		}
	}
	
	added() {
		
	}
	
	addedInEditMode() {
		
	}
	
	flipVertically() {
		
	}
	
	flipHorizontally() {
		
	}
	
	rotate() {
		
	}
	
	removed() {
		this.svg.parentElement.removeChild(this.svg);
	}
	
	addDecal(decal, location) {
		decal.parentObject = this;
		if (!this.decals[location.index]) {
			// Create the decal group.
			var groupElem = document.createElement("div");
			groupElem.setAttribute('id', `${this.id}_decalgroup_${location.index}`);
			// Set its location.
			groupElem.style.position  = 'absolute';
			groupElem.style.left      = `${location.sx*100}%`;
			groupElem.style.top       = `${location.sy*100}%`;
			groupElem.style.transform = `translate(${-location.sx*this.decalSize}px, ${-location.sy*this.decalSize}px)`;
			groupElem.style.width     = `${this.decalSize}px`;
			groupElem.style.height    = `${this.decalSize}px`;
			// Add it to the list.
			this.parent.appendChild(groupElem);
			this.decals[location.index] = {
				elem: groupElem,
				list: []
			};
		}
		var group = this.decals[location.index];
		group.list = group.list.concat(decal);
		decal.add(group.elem, location);
		return decal;
	}
	
	removeDecal(decal) {
		// Removing is simpler than adding.
		var location = decal.location;
		var group = this.decals[location.index];
		group.list = group.list.filter(e => e != decal);
		decal.remove();
	}
}

class SimpleTrack extends Track {
	constructor(from=DIR_LEFT, to=DIR_RIGHT) {
		super([{from: from, to: to}]);
	}
	
	addedInEditMode() {
		// Find all the possible connections to make.
		var possible = [];
		for (var i in DIR_ALL) {
			var dir = DIR_ALL[i];
			var _x = this.x + dir.dx;
			var _y = this.y + dir.dy;
			var neighbour = !!this.layout.tracks[_y] ? this.layout.tracks[_y][_x] : null;
			if (!!neighbour && !!neighbour.connections[dir.opposite.index]) {
				possible = possible.concat(dir);
			}
		}
		// Pick one of them.
		this.pickReroute(possible);
	}
	
	pickReroute(possible) {
		var from, to;
		if (possible.length == 0) {
			possible = [DIR_RIGHT];
		}
		if (possible.length != 2) {
			from = possible[Math.floor(Math.random() * possible.length)];
			to   = from.opposite;
		} else {
			from = possible[0];
			to   = possible[1];
		}
		this.reroute([{from: from, to: to}]);
	}
	
	flipVertically() {
		var from = this.paths[0].from;
		var to   = this.paths[0].to;
		var newFrom = DIR_GET(from.dx, -from.dy);
		var newTo   = DIR_GET(to.dx,   -to.dy);
		this.reroute([{from: newFrom, to: newTo}]);
	}
	
	flipHorizontally() {
		var from = this.paths[0].from;
		var to   = this.paths[0].to;
		var newFrom = DIR_GET(-from.dx, from.dy);
		var newTo   = DIR_GET(-to.dx,   to.dy);
		this.reroute([{from: newFrom, to: newTo}]);
	}
	
	rotate() {
		var from = this.paths[0].from;
		var to   = this.paths[0].to;
		var newFrom = DIR_ALL[(from.index + 1) % 8];
		var newTo   = DIR_ALL[(to.index   + 1) % 8];
		this.reroute([{from: newFrom, to: newTo}]);
		if (newFrom.dx == 0 || newTo.dx == 0) this.rotate();
	}
}

class CurveTrack extends SimpleTrack {
	constructor(from=DIR_DOWN_LEFT, to=DIR_RIGHT) {
		super(from, to);
	}
	
	pickReroute(possible) {
		var from, to;
		if (possible.length == 2 && possible[0].dx != possible[1].dx && possible[0].dy != possible[1].dy) {
			from = possible[0];
			to   = possible[1];
		} else if (possible.length == 0) {
			return;
		} else {
			from = possible[Math.floor(Math.random() * possible.length)];
			if (from.dy == 0) {
				to = DIR_GET(from.opposite.dx, -1);
			} else {
				to = DIR_GET(from.opposite.dx, 0);
			}
		}
		this.reroute([{from: from, to: to}]);
	}
}

class SwitchTrack extends Track {
	constructor(paths, leverLocations) {
		super(paths);
		this.numLevers      = leverLocations.length;
		this.leverLocations = leverLocations;
		this.switchNumber   = 0;
		this.levers         = [];
	}
	
	rerouteSwitch(paths, leverLocations) {
		if (this.numLevers != leverLocations.length) {
			throw new Error("Number of levers must match!");
		}
		for (var i in this.levers) {
			this.removeDecal(this.levers[i].decal);
		}
		this.reroute(paths);
		this.leverLocations = leverLocations;
		for (var i = 0; i < this.numLevers; i++) {
			this.levers[i].decal = this.addDecal(new TextDecal(this.levers[i].fullName, showSwitchNames.getPredicate()), this.leverLocations[i]);
		}
	}
	
	added() {
		super.added();
		for (var i = 0; i < this.numLevers; i++) {
			this.levers[i] = layout.addLever(this, `switch`, String.fromCharCode(0x61 + i), `${this.id}_lever_${i}`);
			this.levers[i].trackIndex = i;
			this.levers[i].onchange = (event) => this.onlever(this.levers[i], event);
			this.levers[i].decal = this.addDecal(new TextDecal(this.levers[i].fullName, showSwitchNames.getPredicate()), this.leverLocations[i]);
		}
	}
	
	removed() {
		super.removed();
		for (var i = 0; i < this.numLevers; i++) {
			this.layout.removeLever(this.levers[i]);
		}
	}
	
	onlever(lever, event) {
		var lutIndex = 0;
		for (var i in this.levers) {
			lutIndex += (1 << this.levers[i].trackIndex) * this.levers[i].isOn;
		}
		this.activePathIndex = lutIndex;
		this.updateActivePath();
	}
}

class TwoWaySwitch extends SwitchTrack {
	constructor(from=DIR_LEFT, to0=DIR_RIGHT, to1=DIR_UP_RIGHT) {
		var leverLoc = DIR_ALL[(from.index + 1) % DIR_ALL.length];
		if (to0.dy == leverLoc.dy || to0.dx == leverLoc.dx) {
			var tmp = to0;
			to0 = to1;
			to1 = tmp;
		}
		super([
			{from: from, to: to0},
			{from: from, to: to1}
		], [leverLoc]);
	}
	
	flipHorizontally() {
		var leverLoc = DIR_FLIP_H(this.leverLocations[0]);
		var from     = DIR_FLIP_H(this.paths[0].from);
		var to0      = DIR_FLIP_H(this.paths[0].to);
		var to1      = DIR_FLIP_H(this.paths[1].to);
		this.rerouteSwitch([
			{from: from, to: to0},
			{from: from, to: to1}
		], [leverLoc]);
	}
}

class Engelsman extends SwitchTrack {
	constructor(incoming0=DIR_DOWN_LEFT, incoming1=null) {
		// Simple assumption.
		if (incoming0 == DIR_LEFT || incoming0 == DIR_RIGHT) {
			incoming0 = incoming1;
			incoming1 = null;
		}
		if (!incoming1)
			incoming1 = DIR_LEFT;
		if (incoming0 && incoming0.sx)
			incoming0 = incoming0.opposite;
		// Find the lever locations.
		var lever;
		if (incoming0.dx == incoming1.dx) {
			if (incoming0.dy != -1 && incoming1.dy != -1) {
				lever = DIR_UP_LEFT;
			} else if (incoming0.dy != 0 && incoming1.dy != 0) {
				lever = DIR_LEFT;
			} else {
				lever = DIR_DOWN_LEFT;
			}
		}
		// Make it fit.
		super([
			{from: incoming0, to: incoming0.opposite},
			{from: incoming0, to: incoming1.opposite},
			{from: incoming1, to: incoming0.opposite},
			{from: incoming1, to: incoming1.opposite}
		], [lever.opposite, lever]);
	}
}

class Decal {
	constructor(predicate) {
		this.predicate = predicate;
		this.isVisible = true;
	}
	
	add(parentElement, location) {
		this.parentElement = parentElement;
		this.location      = location;
	}
	
	remove() {
		
	}
	
	updateDisplay() {
		if (this.predicate) {
			var doShow = this.predicate();
			if (this.isVisible && !doShow) this.hide();
			else if (!this.isVisible && doShow) this.show();
			this.isVisible = doShow;
		}
	}
	
	hide() {
		
	}
	
	show() {
		
	}
}

class TextDecal extends Decal {
	constructor(text, predicate=null) {
		super(predicate);
		this.text = text;
	}
	
	add(parentElement, location) {
		super.add(parentElement, location);
		this.elem = document.createElement("p");
		this.elem.style.position      = 'absolute';
		this.elem.style.margin        = '0';
		this.elem.innerText = this.text;
		parentElement.appendChild(this.elem);
	}
	
	remove() {
		super.remove();
		this.parentElement.removeChild(this.elem);
	}
	
	hide() {
		this.elem.style.display = 'none';
	}
	
	show() {
		this.elem.style.display = 'initial';
	}
}

class CheckboxSetting {
	constructor(id, onchange, defaultValue) {
		this.id       = id;
		this.elem     = document.getElementById(id);
		this.onchange = onchange;
		this.value    = defaultValue;
		this.elem.onchange = (event) => {
			this.value = this.elem.checked;
			this.onchange();
		};
	}
	
	getPredicate() {
		return ()=>this.value;
	}
}

var DIR_UP = {
	dx: 0,   dy: -1,
	sx: 0.5, sy: 0
};
var DIR_DOWN = {
	dx: 0,   dy: 1,
	sx: 0.5, sy: 1
};
var DIR_LEFT = {
	dx: -1,  dy: 0,
	sx: 0,   sy: 0.5
};
var DIR_RIGHT = {
	dx: 1,   dy: 0,
	sx: 1,   sy: 0.5
};
var DIR_UP_LEFT = {
	dx: -1,  dy: -1,
	sx: 0,   sy: 0
};
var DIR_UP_RIGHT = {
	dx: 1,   dy: -1,
	sx: 1,   sy: 0
};
var DIR_DOWN_LEFT = {
	dx: -1,  dy: 1,
	sx: 0,   sy: 1
};
var DIR_DOWN_RIGHT = {
	dx: 1,   dy: 1,
	sx: 1,   sy: 1
};

// Direction relations.
DIR_UP.opposite = DIR_DOWN;
DIR_DOWN.opposite = DIR_UP;
DIR_LEFT.opposite = DIR_RIGHT;
DIR_RIGHT.opposite = DIR_LEFT;
DIR_UP_LEFT.opposite = DIR_DOWN_RIGHT;
DIR_DOWN_RIGHT.opposite = DIR_UP_LEFT;
DIR_DOWN_LEFT.opposite = DIR_UP_RIGHT;
DIR_UP_RIGHT.opposite = DIR_DOWN_LEFT;
var DIR_ALL = [DIR_UP, DIR_UP_RIGHT, DIR_RIGHT, DIR_DOWN_RIGHT, DIR_DOWN, DIR_DOWN_LEFT, DIR_LEFT, DIR_UP_LEFT];
for (var i = 0; i < DIR_ALL.length; i++) DIR_ALL[i].index = i;
function DIR_GET(dx, dy) {
	for (var i in DIR_ALL) {
		if (DIR_ALL[i].dx == dx && DIR_ALL[i].dy == dy) return DIR_ALL[i];
	}
	return undefined;
}
function DIR_FLIP_H(dir) {
	return DIR_GET(-dir.dx, dir.dy);
}
function DIR_FLIP_V(dir) {
	return DIR_GET(dir.dx, -dir.dy);
}


// Tools.
let TOOL_FLIP_H = 'flip_horizontal';
let TOOL_FLIP_V = 'flip_vertical';
let TOOL_ROTATE = 'rotate';
let TOOL_PLACE  = 'place';

var svgStylesheet;
var svgStylesheetError = false;
(function() {
	let url = 'wissels_svg.css';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = () => {
		if(xhttp.readyState === XMLHttpRequest.DONE) {
			var status = xhttp.status;
			if (status === 0 || (status >= 200 && status < 400)) {
				svgStylesheet = `<style type="text/css"><![CDATA[${xhttp.responseText}]]></style>`;
				console.log(`Got '${url}'.`);
			} else {
				console.error(`Could not get '${url}'!`);
				svgStylesheetError = true;
			}
		}
	};
	xhttp.open("GET", url);
	xhttp.send();
})();

var lastId = 0;
function getId() {
	lastId ++;
	return  'e' + lastId;
}

let svgNamespace = "http://www.w3.org/2000/svg";
var layout;

var editMode;
var showSwitchNames;
var showBlockNames;
var showSignalNames;
var showSwitchDirections;
var showTrackStops;
var partLayout;

var placeConstructor;
var currentTool;

function startWissels() {
	// Settings.
	editMode             = new CheckboxSetting("edit_mode",    ()=>layout.updateDisplay(), true);
	showSwitchNames      = new CheckboxSetting("switch_names", ()=>layout.updateDisplay(), true);
	showBlockNames       = new CheckboxSetting("block_names",  ()=>layout.updateDisplay(), true);
	showSignalNames      = new CheckboxSetting("signal_names", ()=>layout.updateDisplay(), true);
	showSwitchDirections = new CheckboxSetting("switch_dir",   ()=>layout.updateDisplay(), true);
	showTrackStops       = new CheckboxSetting("track_stop",   ()=>layout.updateDisplay(), true);
	
	// Part selector.
	partLayout = new TrackLayout(document.getElementById("part_table"), null);
	partLayout.isPartPicker = true;
	function createTrackPart(id, track) {
		track.parent = document.getElementById(id);
		track.id = `part_${getId()}`;
		track.layout = partLayout;
		track.x = 0; track.y = 0;
		track.createSvg(50, 25);
		track.svg.onclick = (event) => {
			track.select(event);
			placeConstructor = track.constructor;
			currentTool      = TOOL_PLACE;
		}
	}
	
	createTrackPart("part_engelsman", new Engelsman(DIR_LEFT, DIR_DOWN_LEFT));
	createTrackPart("part_switch",    new TwoWaySwitch(DIR_LEFT, DIR_UP_RIGHT, DIR_RIGHT));
	createTrackPart("part_straight",  new SimpleTrack(DIR_LEFT, DIR_RIGHT));
	createTrackPart("part_curve",     new CurveTrack(DIR_DOWN_LEFT, DIR_RIGHT));
	
	// Layout.
	layout = new TrackLayout(document.getElementById("track_table"), document.getElementById("track_levers"));
	layout.addTrack(new Engelsman(DIR_DOWN_LEFT), 1, 1);
	
	document.body.onclick = (event) => layout.select(null, event);
}
