import { useEffect, useState } from "react";
import CodeEditor from "./frontend/CodeEditor";
import CodeViewer from "./frontend/CodeViewer";
import GeneralInfo from "./frontend/GeneralInfo";
import MachineControl, { FLAG_SKIP_BREAKPOINT, FLAG_UNTICK } from "./frontend/MachineControl";
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

  const rerender = () => render(Date.now());

  const tickFn = (flag=0) => {
    const isUntick = flag & FLAG_UNTICK;
    const skipBrk = flag & FLAG_SKIP_BREAKPOINT;
    let hasError = false;
    try {
      if (!isUntick) machine.tick(skipBrk);
      else machine.untick();
    } catch (e) {
      window.toastr.error(e.message);
      hasError = true;
    }
    rerender();
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
            <CodeViewer program={machine.program} ip={machine.ip} handleShowEditor={() => setShowCodeEditor(true)} rerender={rerender} />
          }
          <CodeEditor onAssemblyCodeChanged={setAssemblyCode} show={showCodeEditor} />
          <GeneralInfo />
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
