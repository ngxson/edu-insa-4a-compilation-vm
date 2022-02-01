import { useState } from "react";

const assemblyCode = `
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
`;

function CodeEditor({onAssemblyCodeChanged}) {
  const [code, setCode] = useState(assemblyCode.trim());

  return (
    <div className="card">
      <div className="card-body">
        <h5>Code Editor</h5>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} style={{
          width: '100%',
          height: 'calc(100vh - 10em)',
          fontFamily: 'monospace',
        }} />
        <button className="btn btn-primary" onClick={() => onAssemblyCodeChanged(code)}>Run</button>
      </div>
    </div>
  );
}

export default CodeEditor;