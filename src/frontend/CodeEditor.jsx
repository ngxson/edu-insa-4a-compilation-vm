import { useState } from "react";
import DemoPrograms from "./DemoPrograms";

function Editor({code, setCode, onAssemblyCodeChanged, goToImport}) {
  return (
    <>
      <button className="btn btn-secondary" onClick={goToImport}>Import demo program</button>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} style={{
        width: '100%',
        height: 'calc(100vh - 12em)',
        fontFamily: 'monospace',
      }} />
      <button className="btn btn-primary" onClick={() => onAssemblyCodeChanged(code)}>Run</button>
    </>
  );
}

function CodeEditor({onAssemblyCodeChanged, show}) {
  const [code, setCode] = useState('');
  const [showDemoProgs, setShowDemoProgs] = useState(false);

  if (!show) return null;

  return (
    <div className="card">
      <div className="card-body">
        <h5>Code Editor</h5>
        {!showDemoProgs
          ? <Editor code={code} setCode={setCode} onAssemblyCodeChanged={onAssemblyCodeChanged} goToImport={() => setShowDemoProgs(true)} />
          : <DemoPrograms setCode={setCode} backToEditor={() => setShowDemoProgs(false)} />
        }
      </div>
    </div>
  );
}

export default CodeEditor;