@R0
D=M
@n
M=D
@i
M=1
@sum
M=0

(LOOP)
@i
D=M
@n
D=D-M
@STOP
D;JGT

@i
D=M
@sum
M=D+M

@i
M=M+1
@LOOP
0;JMP

(STOP)
@sum
D=M
@R1
M=D

(END)
@END
0;JMP
