import { useState } from "react";

function MachineControl({machine, tickFn}) {
  const [intervalId, setIntervalId] = useState();

  const toggleAuto = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      tickFn();
      const id = setInterval(tickFn, 500);
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
        </p>
        <button className="btn btn-secondary" onClick={toggleAuto}>{intervalId
          ? <>Pause <i class="fas fa-pause"></i></>
          : <>Play <i class="fas fa-play"></i></>
        }</button>
        &nbsp;&nbsp;
        <button className="btn btn-secondary" onClick={() => tickFn(true)}>
          <i class="fas fa-arrow-left"></i>
        </button>
        &nbsp;&nbsp;
        <button className="btn btn-primary" onClick={() => tickFn()}>
          Next tick
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default MachineControl;