
; Stub file for GR8CPU Rev3.1 assembly.
@attribute cpu GR8CPUr3

* = $00

start		stack config $ff
			load #<helloworld
			store printx_msg_lo
			load #>helloworld
			store printx_msg_hi
			call printx ; Hello, world!
			halt

;imports
@include "lib/printx.asm"

;data
helloworld	data "Hello, world!\n\0"








