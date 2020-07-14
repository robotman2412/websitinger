
;this is the first example to see
;hello world example for GR8CPU Rev2.1 in assembly

;you are fully welcome to use the CPU control page to test these example:
;https://robot.scheffers.net/cpu_control

;you will need the instruction set reference for some challenges:
;https://robot.scheffers.net/isa_gr8cpur2

* = $00 ;start at address 0 ($00 hexadecimal)
;you can change the start address, but leave it like this for now
@attribute cpu GR8CPUr2 ;tell the assembler that we are making a program for GR8CPU Rev2.1
;don't forget this line, as without it the assembler will reject the program

;this file represents in pseudocode:
;print "This is a message.\nThe '\\0' at the end is required.\n"

			;all operations use the A register, unless specified otherwise

			;this is a basic loading / storing example
			;the instruction below this line is the first to execute and resides at address 0
			load #message		;this loads the actual address of message, not the first value in it
			store printx_msg	;stores it to the message pointer used by printx, note that you must set it every time
			load #end			;this loads again the address of the label end, which points to the halt instruction
			store printx_ret	;stores it to the return pointer used by printx, making it go there when done
			jump printx			;go to printx to print the message
								;code style, include an empty line to signify it is a different part
end			halt				;end the program, the CPU stops executing
			
@include "lib/printx.asm"		;this is printx, it needs to be in the file to work, it does the print subroutine
								;note that neither data nor the included stuff is at the beginning
								;the instructions are in the beginning, as GR8CPU Rev2 starts executing at address 0

message		data "This is a message.\nThe '\\0' at the end is required.\n\0" ;edit this line at will
			;fun fact: the '\0' at the end of the message is required, because it tells printx that the message stops there

;challenges:
;1. change the printed message
;2. use two seperate calls to printx to print two messages

;next up: if example
