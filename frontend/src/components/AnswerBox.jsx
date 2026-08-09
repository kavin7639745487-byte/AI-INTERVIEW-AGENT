import { useState } from 'react';

export default function AnswerBox({ onSubmit, disabled }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || disabled) return;
    
    onSubmit(answer);
    setAnswer('');
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="answer" className="input-label">Your Answer</label>
          <textarea
            id="answer"
            className="input-field"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={disabled}
            autoFocus
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={disabled || !answer.trim()}
          >
            Submit Answer
          </button>
        </div>
      </form>
    </div>
  );
}
