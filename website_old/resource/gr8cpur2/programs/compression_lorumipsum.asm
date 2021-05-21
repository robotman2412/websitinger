* = $00
				load #stuff
				store start_adr
				load #number_of_bits
				store bitpos
				jump reading0
			
handle_read		copy C to A
				comp #$00
				jump hread0, unless A = B
				halt
hread0			comp #27
				load specal_low, offset A
				jump hread1, if A >= B
				copy C to A
				add #$60
hread1			copy A to D
			
cont_reading	load #number_of_bits
				store bitpos
				load #$00
				copy A to C
				
reading			dec comppos
				jump readbit, unless A = B ;if not 0, continue reading a bit
reading0		load #comp_word_size
				store comppos
next_byte		load $00
start_adr = next_byte + 1 ;fetch the next byte
				store buffer
				inc start_adr ;increment address so we always read the right byte
readbit			shift L, C ;shift the output buffer first to shift over the other bits
				shift L, buffer ;shift the buffer left to get the bit and prep the next one
				jump skip0, unless carry
				inc C ;put in a one bit if carry is on
skip0			dec bitpos ;count how many bits to read
				jump handle_read, if A = B
				jump reading

number_of_bits = 5
bitpos			data $00
comp_word_size = 8
comppos			data $00
buffer			data $00
specal			data ",. \n"
specal_low = specal - 27
;HSB is HSB of what has been read, but it is read first
stuff			data %1100011, %11100100, %1010110, %11110101, %110000, %10011101, %1011011, %11010010, %111101, %10001111, %10010111, %1100110, %10011010, %1110100, %101101, %101101, %110111, %11010001, %10111101, %11010011, %101000, %11101000, %1011010, %1010110, %1011101, %1001, %10011, %100, %11001100, %1101001, %1110001, %11111010, %1010110, %100110, %10011011, %11101100, %11001010, %1001110, %10010001, %11111101, %101010, %1101011, %110110, %10111100, %10011101, %10100001, %1011011, %111, %11001011, %10101001, %1110000, %11010010, %1000100, %10010010, %10101110, %10100111, %1101011, %1001110, %10110000, %100010, %1111100, %10001011, %11010010, %11010011, %10100100, %1111011, %11111, %100010, %11110101, %10100001, %111011, %10000011, %11010000, %10110001, %110001, %10101000, %1111001, %11101010, %11010011, %10100101, %1110010, %1011011, %11010000, %10010011, %10101101, %1001011, %10010010, %11011110, %11011000, %10101110, %1001000, %1011011, %10111110, %11000110, %10101001, %10011111, %1011100, %11111001, %11010010, %1010101, %100111, %1001011, %10000010, %11001000, %1101001, %10100000, %1101000, %10010111, %10111011, %10110101, %1100011, %10, %11010001, %10111111, %10101100, %1000, %10011111, %100100, %11001111, %10101110, %1001100, %11010011, %11011010, %11010011, %10100001, %1100010, %1100011, %1010100, %11000011, %10100101, %11000111, %1001010, %11110, %10001101, %11101101, %1101011, %11001000, %11111110, %10001101, %11101110, %10011001, %1100011, %1010000, %11010011, %10000000
