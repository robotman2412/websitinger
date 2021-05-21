
@no_padding
;^ this tells the assembler to remove null bytes (caused by the start address not being 0) from the beginning of the program

* = $00
;^ this is where your program starts in memory
;  see: data types near the end of the file


		copy A to C
label	halt
		;^ instructions without arguments
;^ that is a label, in this case it signifies the address of what follows
;  any label must be at the very start of a line

		load label
			 ;^ here, "label" replaces the address you would otherwise have to calculate yourself
			 ;  the value at this address is loaded
		load #label
			 ;^ here, "label" replaces a value
			 ;  whatever label is will be loaded
		;^ instructions with arguments, instruction byte is always first, then arguments are included left-to-right

otherlabel = label + 3
;^ this is a label set from a calculation

importantcharacter = "a"
;^ you can do this if you want

inthemiddleofnowhere
;^this label is also valid and points at whatever comes next still

		;what folows are all the data types
		
		data "this is a string", 'this is also a string'
			 ;^ as they say themselves, both are strings because they contain more than one character
			 ;  a string cannot be used as an argument to an instruction, as the only data type to behave as such
		data "a", 'b'
			 ;^ these are characters
		data $de, $ad, $be, $ef
			 ;^ these are all hexadecimal
		data -128, 255, 127
			 ;decimal, you can do both signed and unsigned with them (signed, can be negative, unsigned cannot be negative)
		data 73o, 25q
			 ;^ octal, for my old assembly fans
			 ;  i didn't ge the styler to recognise these, but they are valid
		data %01101100
			 ;^ binary, as you may know
		;^ data, byte, bytes: include data in the program

* = $20
;^ you see that this may be used multiple times

label0
* = $50
label1
;^ label0 will be the address after what came before it, label1 will be $50 as it is behind the address setting
;  labels like these are almost always different from each other

@include "somefile.asm"
;^ will insert the contents of that file right here in this one, however included files cannot use "@include" and "@no_padding"
