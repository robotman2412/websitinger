
;the first one to see is the helloworld example
;loops example for GR8CPU Rev2.1 in assembly

;you are fully welcome to use the CPU control page to test these example:
;https://robot.scheffers.net/cpu_control

;you will need the instruction set reference for some challenges:
;https://robot.scheffers.net/isa_gr8cpur2

* = $00
@attribute cpu GR8CPUr2

;you may be familiar with the for (...) loop
;this file represents in pseudocode:
;for 3 times do
;    print "this is repeated a number of times\n"
;end for
;print "the message has been repeated\n"


;first understand the instructions:
;  comp (something):
;    "dec" and "sub" act like it, as comp subtracts but does not store
;    all ALU instructions set the flags
;  ALU instructions related to subtracting


				;prepare everything before the loop
				load #3				;this is in decimal
				store times
				
				;this will repeat 9 times
loop			load #repeated_msg
				store printx_msg
				load #loop			;hint challenge 2: this needs to be changed
				store printx_ret
				dec times
				jump printx, if A >= B	;since dec is just A = A - 1, that means that this will be false when dec is called after A is 0
										;doing this completes the loop, we just do the subroutine which will go back to the "loop" label when done
				
				;at this point, the message will have been printed 9 times
				load #end			;print "the message has been repeated"
				store printx_ret
				load #final_msg
				store printx_msg
				jump printx
				
				;end of program
end				halt
			
@include "lib/printx.asm"			;don't forget!

times			reserve 1			;this is our loop times variable

repeated_msg	data "this is repeated a number of times\n\0"
final_msg		data "the message has been repeated\n\0"

;challenges:
;1. change the number of times
;2. repeat another, different message after the first one, after its loop but before the "has been repeated" message is printed
;3. repeat another, different message after the first one, but within its loop this time (extra spicy challenge, not required often in practice)

;next up: data moving example
