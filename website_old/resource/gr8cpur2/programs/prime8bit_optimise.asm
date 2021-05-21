
			load #mdiv1
			store div_ret
			load #btd
			store printx_ret
			load #mprime1
			store btd_ret
			
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
			jump mprime2, if A = B
			inc divider
			inc divider
			comp divmax
			jump divloop, if A <= B
			
primeprint	load prime
			store number
			load #msg
			store printx_msg
			jump printx
			
mprime1		load #'\n'
			copy A to D
			
mprime2		inc prime
			jump end, if carry
			inc prime
			jump primeloop, unless carry
end			halt

@include "btd_includable_compacted.asm"
@include "printx.asm"
@include "divide8bit.asm"

msg		data "Prime: \0"
prime	data $00
divmax	data $00
