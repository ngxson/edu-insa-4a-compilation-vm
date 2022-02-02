import { useEffect, useState } from "react";

const TICK_DELAY = 50;
export const FLAG_UNTICK = 1;
export const FLAG_SKIP_BREAKPOINT = 2;

function MachineControl({machine, tickFn}) {
  const [intervalId, setIntervalId] = useState();

  useEffect(() => () => {
    if (intervalId) clearInterval(intervalId);
  }, [intervalId]);

  const toggleAuto = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      tickFn(FLAG_SKIP_BREAKPOINT);
      const id = setInterval(() => {
        const hasError = tickFn();
        // stop on having error
        if (hasError) {
          window.toastr.info('Stop due to error');
          clearInterval(id);
          setIntervalId(null);
        }
      }, TICK_DELAY);
      setIntervalId(id);
    }
  }

  return (
    <div className="card" style={{
      position: 'fixed',
      bottom: '1em',
      right: '1em',
      zIndex: 999,
    }}>
      <div className="card-body">
        <h5>Machine Control</h5>
        <p>
          BP: {machine.bp}<br/>
          SP: {machine.sp}<br/>
          IP: {machine.ip}<br/>
          Clock: {machine.clk}<br/>
        </p>
        <button className="btn btn-secondary" onClick={toggleAuto}>{intervalId
          ? <>Pause <i className="fas fa-pause"></i></>
          : <>Play <i className="fas fa-play"></i></>
        }</button>
        &nbsp;&nbsp;
        <button className="btn btn-secondary" onClick={() => tickFn(FLAG_UNTICK)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        &nbsp;&nbsp;
        <button className="btn btn-primary" onClick={() => tickFn(FLAG_SKIP_BREAKPOINT)}>
          Next tick
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default MachineControl;