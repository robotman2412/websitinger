* = $00

;controller format:
;fxxxccrr
;r: row
;c: colomn
;x: ignored
;f: to pay respects to the current value, then murder it brutally

; 123
; 456
; 789
;  0

			jump start
			
;time		data $00 ;times undo-able
;prev1		data $00
;prev		data $00
stored		data $00
temp		data $00
temp1		data $00

start		load #$00
			copy A to C
			store stored
;			store time
			load #input0
			store btd_ret
;			jump input1
			
input		;load prev
;			store prev1
;			load stored
;			store prev
;			inc time
;			comp #2
;			jump input1, if A <= B
;			dec time ;max of 2
			
input1		load #'>'
			copy A to D
			load #' '
			copy A to D
			load stored
			store number
			jump btd
			
input0		load #'\n'
			copy A to D
			copy D to A
			store temp
			and #%00010000
			jump start, unless A = B
			load temp
			and #%00100000
			jump enbin, unless A = B
			load temp
			and #%01000000
			jump shitgoback, unless A = B
			
mult10		shift L, stored
			shift L
			shift L
			add stored
			store stored
			copy A to C
			
			load temp
			and #%10000000
			jump input, unless A = B
			
decode		load temp
			and #%00000011
			dec
			store temp1
			shift L
			add temp1
			store temp1
			shift R, temp
			shift R
			add temp1
			add stored
			store stored
			copy A to C
			jump input
			
enbin		load #'$'
			copy A to D
			load stored
			;halt
			shift R
			shift R
			shift R
			shift R
			and #$0f
			;halt
			load hexes, offset A
			copy A to D
			load stored
			;halt
			and #$0f
			;halt
			load hexes, offset A
			copy A to D
			load #'\n'
			copy A to D
			
			load stored
			store temp
			load #'%'
			copy A to D
			load #8
			store temp1
			
enbin_loop0	load temp
			and #%10000000
			rot L
			load hexes, offset A
			copy A to D
			shift L, temp
			dec temp1
			jump enbin_loop0, unless A = B
			
			load #'\n'
			copy A to D
			jump input
			
shitgoback	load stored
			store remainder
			;jump divide
			
;@include "divide8bit.asm"

divide		load #$00
			store stored
div0		load remainder
			comp #10
			jump input1, if A < B
			sub #10
			store remainder
			inc stored
			jump div0
			
remainder	data $00

@include "btd_includable_compacted.asm"

hexes		data "0123456789abcdef"
