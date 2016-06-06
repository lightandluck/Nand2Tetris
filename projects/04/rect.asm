//This program fills in the first 16 columns of the screen down to 
//a number of rows provided by the user in RAM[0]
@SCREEN
D=A
@addr
M=D

@R0
D=M
@n
M=D
@i
M=1

(LOOP)
    @i
    D=M
    @n
    D=D-M
    @END
    D;JGT
    
    @addr //set screen to black at addr
    A=M
    M=-1
    
    D=A
    @32
    D=D+A
    @addr
    M=D
    
    @i
    M=M+1
    
    @LOOP
    0;JMP
    
(END)
    @END
    0;JMP