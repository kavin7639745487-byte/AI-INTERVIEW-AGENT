export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  
  return (
    <div className="card" style={{ 
      borderColor: 'var(--error)', 
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      textAlign: 'center' 
    }}>
      <h3 style={{ color: 'var(--error)' }}>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary mt-4" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
