export default function Loading({ message = "Loading..." }) {
  return (
    <div className="text-center animate-pulse" style={{ padding: '2rem 0' }}>
      <div style={{ 
        display: 'inline-block',
        width: '40px',
        height: '40px',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );
}
