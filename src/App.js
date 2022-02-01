import { useEffect, useState } from "react";
import CodeEditor from "./frontend/CodeEditor";
import CodeViewer from "./frontend/CodeViewer";
import MachineControl from "./frontend/MachineControl";
import MemoryViewer from "./frontend/MemoryViewer";
import Machine from "./vm/machine";

function App() {
  const [machine, setMachine] = useState();
  const [showCodeEditor, setShowCodeEditor] = useState(true);
  const render = useState(0)[1];

  useEffect(() => {
    const machine = new Machine();
    //machine.boot(assemblyCode);
    setMachine(machine);
  }, []);

  const tickFn = (isUntick=false) => {
    try {
      if (!isUntick) machine.tick();
      else machine.untick();
    } catch (e) {
      window.toastr.error(e.message);
    }
    render(Date.now());
  };

  const setAssemblyCode = (code) => {
    const machine = new Machine();
    machine.boot(code);
    setMachine(machine);
    setShowCodeEditor(false);
  };

  if (!machine) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          {!showCodeEditor &&
            <CodeViewer program={machine.program} ip={machine.ip} handleShowEditor={() => setShowCodeEditor(true)} />
          }
          {showCodeEditor &&
            <CodeEditor onAssemblyCodeChanged={setAssemblyCode} />
          }
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          {!showCodeEditor &&
            <MachineControl machine={machine} tickFn={tickFn} />
          }
        </div>
        <div className="col-6">
          <MemoryViewer memory={machine.memory} bp={machine.bp} sp={machine.sp} />
        </div>
      </div>
    </div>
  );
}

export default App;
