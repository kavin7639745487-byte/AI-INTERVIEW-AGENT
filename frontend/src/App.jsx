import { useState } from 'react';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Interview from './pages/Interview';
import Results from './pages/Results';
import './index.css';

const VIEWS = {
  WELCOME: 'WELCOME',
  INTERVIEW: 'INTERVIEW',
  RESULTS: 'RESULTS'
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.WELCOME);
  const [sessionId, setSessionId] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleStartInterview = (newSessionId, initialData) => {
    setSessionId(newSessionId);
    setInterviewData(initialData);
    setCurrentView(VIEWS.INTERVIEW);
  };

  const handleCompleteInterview = (finalFeedback) => {
    setFeedback(finalFeedback);
    setCurrentView(VIEWS.RESULTS);
  };

  const handleRestart = () => {
    setSessionId(null);
    setInterviewData(null);
    setFeedback(null);
    setCurrentView(VIEWS.WELCOME);
  };

  return (
    <>
      <Header />
      <main className="main-content">
        {currentView === VIEWS.WELCOME && (
          <Welcome onStart={handleStartInterview} />
        )}
        
        {currentView === VIEWS.INTERVIEW && (
          <Interview 
            sessionId={sessionId} 
            initialData={interviewData}
            onComplete={handleCompleteInterview}
          />
        )}
        
        {currentView === VIEWS.RESULTS && (
          <Results 
            feedback={feedback}
            onRestart={handleRestart}
          />
        )}
      </main>
    </>
  );
}

export default App;
