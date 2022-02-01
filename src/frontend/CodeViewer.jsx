function CodeViewer({program, ip, handleShowEditor}) {
  return (
    <div className="card">
      <div className="card-body">
        <h5>
          Code Viewer
          &nbsp;&nbsp;
          <button className="btn btn-primary" onClick={handleShowEditor}>Edit code</button>
        </h5>
        <div style={{
          height: 'calc(100vh - 3em)',
          overflow: 'scroll',
        }}>
          <table className="instruction-tab">
            <thead>
              <tr>
                <td width="1px">Addr&nbsp;</td>
                <td>Code</td>
              </tr>
            </thead>

            {program.lines.map(({text, instruction}, i) => (
              <tbody key={i}>
                <tr className={instruction && instruction.addr === ip ? 'active-ip' : ''}>
                  <td>{instruction ? instruction.addr : ''}</td>
                  <td className="code">{text}</td>
                </tr>
              </tbody>
            ))}
          </table>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
      </div>
    </div>
  );
}

export default CodeViewer;