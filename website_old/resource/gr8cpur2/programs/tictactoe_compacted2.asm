
;more compact, more documented

;controller format:
;ffffccrr
;r: row
;c: colomn
;f: reset the game and press F to pay respects

;field format:
;332211xx
;bit pairs 1 - 3 represent the piece in that spot
;1 - 3 is the colomns 1 - 3
;xx is ignored
;consecutive bytes are rows
;00 is empty
;01 is player 1 piece
;10 is player 2 piece
;11 is invalid

			;start of program, we try to continue where we left off
			;the big red button allows you to reset the game at any time
			dec player ;toggle between player 1 and 2
			xor #$01 ;this is done later because after display comes windetect
			inc ;this means the same player can play again with the same game after a reset
			store player
			dec moves ;the moves are also increased after win detect, so this is needed
			jump rst_field, unless carry
			jump disp_field
			
rst_wait	load #$00
			store moves ;to be able to tell the field *must* be reset
			copy D to A
rst_field	load #$00
			store field
			store field1
			store field2
			store moves
			;no jump to disp_field, we're right infront of it
			
disp_field	load #dispf_loop ;setup printx for the lines inbetween rows
			store printx_ret
			load #$00
			store t2_temp
			
dispf_loop	load t2_temp
			load field, offset A ;load field row
			copy A to C
			load #$03
			store t1_temp
			jump disp_col
dispc_loop	load #'|' ;add a pipe for the colomns
			copy A to D
disp_col	shift R, C ;get the piece
			shift R, C
			and #%00000011 ;use only the current one
			load piece_data, offset A
			copy A to D ;print the piece
			dec t1_temp ;continue the loop
			jump dispc_loop, unless A = B
			load #'\n' ;print newline
			copy A to D
			load #board_div
			store printx_msg
			inc t2_temp ;continue another loop
			comp #$03 ;only print when inbetween rows
			jump printx, unless A = B
			
			
win_check	load #$00
			copy A to C
			inc ;used to compare player against 1, but A is always $00, so we don't need to load
			comp player ;this saves us 1 byte
			load #%01010100 ;does not modify flags, bitmask for comparing to the field
			jump winc_0, if A = B ;only shift if the player is player 2
			shift L
winc_0		store t3_temp ;bitmask, compared to later on
			
winc_loop	copy C to A ;counter
			load field, offset A ;load row of the field we're trying
			comp t3_temp ;compare to bitmask
			jump on_win, if A = B ;win if match
			inc C
			comp #$03
			jump winc_loop, unless A = B
			load field ;compare rows
			and field1
			and field2
			jump on_win, unless A = B
			
winc_diag	load field1 ;unfortunately, this cannot be smaller
			and #%00110000
			and t3_temp
			jump tie_check, if A = B ;diagonal is impossible, center does not contain a piece of player which just placed
			load field ;load top row of field
			rot R ;rotate right 4 times to align top left to bottom right,
			rot R ;bottom left to top right when compared to bottom row of field
			rot R
			rot R
			and field2 ;and the fields
			and t3_temp ;ensure the result is of the correct player
			jump on_win, unless A = B
			
tie_check	inc moves
			comp #$09
			jump on_tie, if A > B ;tie, always, after 9 moves in total
			
			
prc_invp	dec player ;toggle between player 1 and 2
			xor #$01
			inc
			store player
			
prc_move	;don't load player, it's still in register A
			load piece_data, offset A ;print player's character
			copy A to D
			store win_msg
			load #'\n' ;print newline
			copy A to D
			
prcm_inp	copy D to A ;read controller inputs, the controller used will temporarily halt the CPU
			copy A to C
			and #%11110000
			jump rst_field, unless A = B
			copy C to A
			and #%00000011
			dec
			store t1_temp
			shift R, C
			shift R, C
			load player
			store t3_temp
			load t1_temp
			load field, offset A
			store t2_temp
			
prcm_loop	shift R, t2_temp
			shift R, t2_temp
			shift L, t3_temp
			shift L, t3_temp
			dec C
			jump prcm_loop, unless A = B
			
			load t2_temp
			and #%00000011
			jump prcm_inp, unless A = B
			
			load t1_temp ;add row to field address
			add #field
			store prcm_str ;modify address, no index registers /-.-
			load $00, offset A ;load field offset by rows, but A has already been added to field address
			or t3_temp ;put the piece in the field
prcm_str	store $00 ;store in the field at the same address
prcm_str = prcm_str + 1
			jump disp_field ;win detect comes *after* display
			
on_win		load #win_msg ;when a player wins
			jump on_end
on_tie		load #tie_msg ;when a tie happens
on_end		store printx_msg
			load #rst_wait
			store printx_ret
			;no jump, we're right infront of printx
			
printx		;print a newline terminated String
			load $00
printx_msg = printx + 1
			copy A to D
			comp #'\n'
printx_jmp	jump $00, if A = B
printx_ret = printx_jmp + 1
			inc printx_msg
			jump printx
			


;datas here
tie_msg		data "Tie\n"

win_msg		data $00
			data " wins\n"
			
player		data $01
			
piece_data	data " 0x"
			
board_div	data "-+-+-\n"
			
field		data $00 ;the field data
field1		data $00
field2		data $00
moves		data $00 ;number of moves in total
			
t1_temp		data $00 ;temporary bytes, used in multiple things
t2_temp		data $00
t3_temp		data $00
