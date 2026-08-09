import { useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import AnswerBox from '../components/AnswerBox';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { submitAnswer } from '../services/api';

export default function Interview({ sessionId, initialData, onComplete }) {
  // initialData is the response from the /api/interview start call
  const [currentQuestion, setCurrentQuestion] = useState(initialData.reply);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (answerText) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await submitAnswer(sessionId, answerText);
      
      if (data.done) {
        onComplete(data.feedback);
      } else {
        setCurrentQuestion(data.reply);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Active Interview Session</h2>
        <span style={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          color: 'var(--accent-primary)',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          Interview in Progress
        </span>
      </div>

      <ErrorMessage message={error} />
      
      <QuestionCard question={currentQuestion} />
      
      {loading ? (
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <Loading message="The agent is processing your answer..." />
        </div>
      ) : (
        <AnswerBox onSubmit={handleSubmit} disabled={loading} />
      )}
    </div>
  );
}
