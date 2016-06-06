// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

@sum //set up sum variable
M=0

@R0 //check if any inputs are 0, jump directly to end
D=M
@STOP
D;JEQ

@R1 //check for 0, jump to END
D=M
@STOP
D;JEQ

@i //set iterator
M=1

(LOOP)
    @i //loop condition
    D=M
    @R0
    D=D-M
    @STOP
    D;JGT
    
    @R1 //add sum
    D=M
    @sum
    M=M+D
    
    @i //increase iterator
    M=M+1
    
    @LOOP
    0;JMP

(STOP)
    @sum //set R2 to sum
    D=M
    @R2
    M=D
(END)  
    @END
    0;JMP
    
     