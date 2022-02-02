import { useEffect, useState } from "react";
import CodeEditor from "./frontend/CodeEditor";
import CodeViewer from "./frontend/CodeViewer";
import MachineControl from "./frontend/MachineControl";
import MemoryViewer from "./frontend/MemoryViewer";
import ScreenViewer from "./frontend/ScreenViewer";
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
    let hasError = false;
    try {
      if (!isUntick) machine.tick();
      else machine.untick();
    } catch (e) {
      window.toastr.error(e.message);
      hasError = true;
    }
    render(Date.now());
    return hasError;
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
          <CodeEditor onAssemblyCodeChanged={setAssemblyCode} show={showCodeEditor} />
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          {!showCodeEditor &&
            <MachineControl machine={machine} tickFn={tickFn} />
          }
        </div>
        <div className="col-6">
          {!showCodeEditor && <>
            <MemoryViewer memory={machine.memory} bp={machine.bp} sp={machine.sp} />
            <br/>
            <ScreenViewer screen={machine.screen} />
          </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
