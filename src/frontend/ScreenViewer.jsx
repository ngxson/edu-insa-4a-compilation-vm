import nl2br from 'react-nl2br';

function ScreenViewer({screen}) {
  return (
    <div className="card">
      <div className="card-body">
        <h5>Machine Output</h5>
        <pre>{nl2br(screen)}</pre>
      </div>
    </div>
  );
}

export default ScreenViewer;