export default function QuestionCard({ question }) {
  if (!question) return null;
  
  return (
    <div className="card mb-6" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        Interview Question
      </h3>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
        {question}
      </p>
    </div>
  );
}
