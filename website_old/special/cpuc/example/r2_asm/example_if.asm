
;the first one to see is the helloworld example
;if example for GR8CPU Rev2.1 in assembly

;you are fully welcome to use the CPU control page to test these example:
;https://robot.scheffers.net/cpu_control

;you will need the instruction set reference for some challenges:
;https://robot.scheffers.net/isa_gr8cpur2

* = $00
@attribute cpu GR8CPUr2

;programming revolves around alot of conditions
;for example, you may want to compare numbers
;in here, we'll be looking at that

;this file represents in pseudocode:
;A = 3
;B = 96
;C = 5
;D = 6
;if A > B then
;  print "A>B\n"
;end if
;if C = D then
;  print "C=D\n"
;end if
				
				;setting up the variables
				load #3
				store var_a
				load #96
				store var_b
				load #5
				store var_c
				load #6
				store var_d
				
				load #a_over_b			;preparing for print "A>B\n"
				store printx_msg
				load #nextcheck
				store printx_ret
				load var_a				;if A > B
				comp var_b
				jump printx, if A > B	;then...
				
nextcheck		load #c_is_d			;preparing for print "C=D\n"
				store printx_msg
				load #end
				store printx_ret
				load var_c				;if C = D
				comp var_d
				jump printx, if A = B	;then...
				
end				halt
				
				;using these statements to reserve a byte per variable
var_a			data $00
var_b			data $00
var_c			data $00
var_d			data $00

@include "lib/printx.asm"

;challenges:
;Note: To properly check your work, change the values A, B, C and D a bit.
;1. add a third condition to check if D <= B
;2. check if (A xor B) = $11
;   you will need the XOR alu instructions for this









