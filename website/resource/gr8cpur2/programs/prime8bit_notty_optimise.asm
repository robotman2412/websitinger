
			load #mdiv1
			store div_ret
			
start		load #$03
			store prime
			jump primeprint
			
primeloop	load prime
			shift R
			add #2
			store divmax
			and #$01
			jump primeloop0, unless A = B
			load divmax
			inc
			store divmax
primeloop0	load #3
			store divider
			
divloop		load prime
			store remainder
			jump divide
			
mdiv1		load remainder
			comp #$00
			jump mprime, if A = B
			inc divider
			inc divider
			comp divmax
			jump divloop, if A <= B
			
primeprint	load prime
			copy A to C
			jump mprime
			
mprime		inc prime
			jump end, if carry
			inc prime
			jump primeloop, unless carry
end			halt

@include "divide8bit.asm"

prime	data $00
divmax	data $00
