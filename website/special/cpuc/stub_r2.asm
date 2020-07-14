
; Stub file for GR8CPU Rev2.1 assembly.
@attribute cpu GR8CPUr2

* = $00

start		load #helloworld
			store printx_msg
			load #end
			store printx_ret
			jump printx ; Hello, world!
			
end			halt

;imports
@include "lib/printx.asm"

;data
helloworld	data "Hello, world!\n\0"








