export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', padding: '1.5rem', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>AI Interview Agent</h1>
      </div>
    </header>
  );
}
