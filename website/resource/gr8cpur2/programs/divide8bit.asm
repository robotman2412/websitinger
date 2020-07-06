
;reserve some space for datas
remainder	data $00 ;also input
divider		data $00
result		data $00

max			data $00 ;maximum shifted amount

divide		load #$00 ;prep
			store result
			store max
			
maxfl		inc max ;find maximum shifted amount
			rot L, divider
			jump maxfl, unless carry ;keep going unless we rotate out a 1
			rot R, divider ;rotate the 1 back in
			jump sdivl ;start dividing
			
divl		shift R, divider ;shift these so, of course, the result is correct
			shift L, result
sdivl		load remainder ;compare remainder against divider, see if we can subtract
			comp divider
			jump mdiv0, if A < B ;skip subtracting if less than that
			sub divider ;remove divider from remainder
			store remainder
			inc result ;set the lowest bit of result to 1
mdiv0		dec max ;see if we must continue dividing
			comp #0
			jump divl, if A > B
div_mret	jump $00 ;return to whatever's set by the program using this
div_ret = div_mret + 1
