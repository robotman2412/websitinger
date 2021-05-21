
;the first one to see is the helloworld example
;data moving example for GR8CPU Rev2.1 in assembly

;you are fully welcome to use the CPU control page to test these example:
;https://robot.scheffers.net/cpu_control

;you will need the instruction set reference for some challenges:
;https://robot.scheffers.net/isa_gr8cpur2

* = $00
@attribute cpu GR8CPUr2

;if you've programmed before, you may know alot of data flows around
;even in simple things, data moves and mutates

;there is a "black box" on at the end of the file
;it checks your work, you musn't change it
;your program can either jump to the label "back_box" or you can let it flow into the back box as you wish

;this challenge will test your knowledge of programming for GR8CPU Rev2.1
;now for the challenge
;five labels have been provided:
;    number_a
;    number_5_a
;    number_b
;    number_c
;    is_c_over_b
;you must read number a and put the value of it times 5 in number_5_a
;you must check whether c is over b and set is_c_over_b to a nonzero value only if true

;it will print GG if correct
;it will print something else if not correct

;for extra challenge:
;do the 5 times a using the shift instructions


				jump prep_challenge ;this prepares the challenge via the black box, do not remove it

;vv write here
start_of_code ;this label tells the black box where your code starts, you may move it if needed

;^^ write here


















;------------BLACK BOX------------
black_box		load number_a
				shift L
				shift L
				add number_a
				comp number_5_a
				load #'G'
				jump black_box0, if A = B
				load #'N'
black_box0		copy A to D
				load number_c
				comp number_b
				load is_c_over_b
				jump black_box4, if A > B
black_box1		comp #$00
				jump black_box2, if A = B
				jump black_box3
black_box4		comp #$00
				jump black_box3, if A = B
black_box2		load #'G'
				copy A to D
				halt
black_box3		load #'N'
				copy A to D
				halt
black_box5 = start_of_code + 4
black_box6 = start_of_code + 9
prep_challenge	load #$00
				store is_c_over_b
				store number_5_a
				load #number_a
				xor #$1c
				xor start_of_code
				shift R
				rot R
				add black_box5
				xor black_box6
				xor #$ff
				store number_a
				dec
				dec
				sub #9
				store number_b
				xor #$0f
				store number_c
				jump start_of_code
number_a		reserve 1
number_5_a		reserve 1
number_b		reserve 1
number_c		reserve 1
is_c_over_b		reserve 1


