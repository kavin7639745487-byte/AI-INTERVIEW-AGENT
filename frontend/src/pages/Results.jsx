export default function Results({ feedback, onRestart }) {
  if (!feedback) {
    return (
      <div className="container text-center">
        <h2>No feedback available.</h2>
        <button className="btn btn-primary mt-4" onClick={onRestart}>Start Over</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-6">
        <h2 style={{ color: 'var(--success)' }}>Interview Completed</h2>
        <p>Thank you for completing the mock interview.</p>
      </div>
      
      <div className="card mb-6">
        <h3>Interview Summary</h3>
        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{feedback.summary}</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ marginBottom: 0, borderTop: '4px solid var(--success)' }}>
          <h3 style={{ color: 'var(--success)' }}>Strengths</h3>
          {feedback.strengths && feedback.strengths.length > 0 ? (
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              {feedback.strengths.map((item, idx) => (
                <li key={idx} className="mb-2">{item}</li>
              ))}
            </ul>
          ) : (
            <p>None recorded.</p>
          )}
        </div>
        
        <div className="card" style={{ marginBottom: 0, borderTop: '4px solid var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)' }}>Areas for Improvement</h3>
          {feedback.gaps && feedback.gaps.length > 0 ? (
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              {feedback.gaps.map((item, idx) => (
                <li key={idx} className="mb-2">{item}</li>
              ))}
            </ul>
          ) : (
            <p>None recorded.</p>
          )}
        </div>
      </div>
      
      <div className="card mb-6" style={{ borderTop: '4px solid var(--accent-primary)' }}>
        <h3 style={{ color: 'var(--accent-primary)' }}>Next Steps</h3>
        {feedback.next && feedback.next.length > 0 ? (
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
            {feedback.next.map((item, idx) => (
              <li key={idx} className="mb-2">{item}</li>
            ))}
          </ul>
        ) : (
          <p>None recommended.</p>
        )}
      </div>
      
      <div className="text-center mt-6">
        <button className="btn btn-primary" onClick={onRestart}>
          Start Another Interview
        </button>
      </div>
    </div>
  );
}
