
;this is a comment
* = $00 ;start address of the program
;if omitted, the start address will be 0

start		load #$00 ;this is very important
			store someplace ;put it somewhere
			halt ;end the program here
			
someplace	data $69
;^ this is a label
;a label can be used to replace a constant value
