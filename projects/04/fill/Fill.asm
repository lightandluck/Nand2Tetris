// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, the
// program clears the screen, i.e. writes "white" in every pixel.

// Put your code here.

(LOOP)
//setting our variables screen, i (iterator), 
//n (number of registers to loop over = total registers for screen memory map)
@SCREEN 
D=A
@addr
M=D

@8192
D=A
@n
M=D

@i
M=1

@KBD
D=M

@BLACK
D;JGT

@WHITE
D;JEQ

//Fill screen with black loop
(BLACK)
    @i //not condition
    D=M
    @n
    D=D-M
    @LOOP
    D;JGT
    
    @addr 
    A=M
    M=-1 //set register to all 1's (-1 in 2's complement)
    
    @addr //iterate addr and i
    M=M+1
    @i
    M=M+1
    
    @BLACK
    0;JMP   

//Clear screen. Same logic as black, but sets registers to 0 instead
(WHITE)
    @i
    D=M
    @n
    D=D-M
    @LOOP
    D;JGT
    
    @addr
    A=M
    M=0
    
    @addr
    M=M+1
    @i
    M=M+1
    
    @WHITE
    0;JMP   
