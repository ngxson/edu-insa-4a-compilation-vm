
const DEMO_PROGS = [
  {
    name: 'do..while loop (calculate 3! = 6)',
    source: `
void main() {
  int n;
  int fact;

  n = 3;
  fact = 1;
  do {
    fact = fact*n;
    n = n - 1;
  } while(n>0);
  //compute 3!
  
  print(fact);
}
    `.trim(),
    asm: `
    call    main
    mov     rax,0
    ret     0
main:
    alloc   2
    mpush   3
    pop     0
    mpush   1
    pop     1
dowhile_0:
    push    1
    push    0
    mul
    pop     1
    push    0
    mpush   1
    sub
    pop     0
    push    0
    mpush   0
    testg
    jz      enddowhile_0
    jmp     dowhile_0
enddowhile_0:
    push    1
    call    print_int
    call    print_newline
    free
    ret     0
    `.trim(),
  },
  {
    name: 'function call (basic)',
    source: `
int f(int p, int q) {
  return p+q;
}

void main() {
  int x;
  int y;
  x = 12;
  y = 34;
  x = f(x,x+y);
  // result: x = 58
}
    `.trim(),
    asm: `
    call    main
    mov     rax,0
    ret     0
f:
    alloc   0
    push    -4
    push    -3
    add
    iret    2
    free
    ret     2
main:
    alloc   2
    mpush   12
    pop     0
    mpush   34
    pop     1
    push    0
    push    0
    push    1
    add
    call    f
    pop     0
    free
    ret     0
    `.trim(),
  },
  {
    name: 'fibonacci fib(6)',
    source: `
int fib(int n) {
  if(n==0) return 1;
  if(n==1) return 1;
  if(n>1) return fib(n-1) + fib(n-2);
}

void main() {
  print(fib(6));
  // result = 13
}    
    `.trim(),
    asm: `
    call    main
    mov     rax,0
    ret     0
fib:
    alloc   0
    push    -3
    mpush   0
    teste
    jz      else_0
    mpush   1
    iret    1
    jmp     endif_0
else_0:
endif_0:
    push    -3
    mpush   1
    teste
    jz      else_1
    mpush   1
    iret    1
    jmp     endif_1
else_1:
endif_1:
    push    -3
    mpush   1
    testg
    jz      else_2
    push    -3
    mpush   1
    sub
    call    fib
    push    -3
    mpush   2
    sub
    call    fib
    add
    iret    1
    jmp     endif_2
else_2:
endif_2:
    free
    ret     1
main:
    alloc   0
    mpush   6
    call    fib
    call    print_int
    call    print_newline
    free
    ret     0
    `.trim(),
  }
];

function DemoPrograms({setCode, backToEditor}) {
  const importCode = (code) => {
    setCode(code);
    backToEditor();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={backToEditor}>
        <i class="fas fa-arrow-left"></i>
        Back to editor
      </button><br/>
      <b>Demo programs:</b><br/>
      {DEMO_PROGS.map(prog => (
        <div>
          <b>{prog.name}</b>
          &nbsp;&nbsp;
          <button className="btn btn-primary" onClick={() => importCode(prog.asm)}>Import</button>
          <br/>
          <pre>{prog.source}</pre>
        </div>
      ))}
    </>
  );
}

export default DemoPrograms;