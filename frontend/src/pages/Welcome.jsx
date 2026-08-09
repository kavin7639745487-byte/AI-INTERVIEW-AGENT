import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { startInterview } from '../services/api';
import candidatesData from '../../../candidates.json';

export default function Welcome({ onStart }) {
  const candidates = candidatesData?.candidates || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Generate a random session ID for this interview
    const sessionId = `sess-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // The backend API contract requires the full candidate object
    const selectedCandidate = candidates[selectedIndex] || {};
    
    try {
      const data = await startInterview(sessionId, selectedCandidate);
      onStart(sessionId, data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the interview server.');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Initializing your interview environment..." />;
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card text-center" style={{ padding: '3rem 2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Welcome to Your AI Mock Interview</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          This system will guide you through a series of technical questions based on your profile and previous missions.
        </p>
        
        <form onSubmit={handleStart}>
          <div className="input-group text-left" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <label htmlFor="candidateSelect" className="input-label">Select Candidate Profile</label>
            <select
              id="candidateSelect"
              className="input-field"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              {candidates.map((cand, idx) => (
                <option key={cand.member?.id || idx} value={idx}>
                  {cand.member?.name || 'Unknown Candidate'} - {cand.member?.jobRole || 'Unknown Role'}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
            Start Interview
          </button>
        </form>
      </div>
      
      <ErrorMessage message={error} />
    </div>
  );
}
