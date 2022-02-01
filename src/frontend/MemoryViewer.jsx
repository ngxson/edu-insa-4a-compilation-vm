import { DATA_TYPE_INSTR_ADDR, DATA_TYPE_MEM_ADDR } from "../vm/memory";

function MemoryViewer({memory, bp, sp}) {
  return (
    <div className="card">
      <div className="card-body">
        <h5>Memory Viewer</h5>

        <div>
          <div className="legend t-insaddr" />
          Pointer to an instruction<br/>
          <div className="legend t-memaddr" />
          Pointer to a memory location<br/>
        </div>

        <table className="instruction-tab">
          <thead>
            <tr>
              <td width="1px">Addr&nbsp;</td>
              <td width="1px">Slot&nbsp;</td>
              <td width="1px">__&nbsp;</td>
              <td>Data</td>
            </tr>
          </thead>

          {memory.data.map((cell, i) => {
            //console.log(cell);
            const {value, type} = cell;
            const isSP = sp === i;
            const isBP = bp === i;
            const clsMemAddr = (type === DATA_TYPE_MEM_ADDR) ? 't-memaddr' : '';
            const clsInsAddr = (type === DATA_TYPE_INSTR_ADDR) ? 't-insaddr' : '';

            return <tbody key={i}>
              <tr className={`${clsMemAddr} ${clsInsAddr}`}>
                <td>{i}</td>
                <td>{i - bp - 1}</td>
                <td>{isSP ? 'SP' : ''}{isBP ? 'BP' : ''}</td>
                <td className="code">{value}</td>
              </tr>
            </tbody>
          })}
        </table>
      </div>
    </div>
  );
}

export default MemoryViewer;