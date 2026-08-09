const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const startInterview = async (sessionId, candidate) => {
  const response = await fetch(`${API_BASE_URL}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, candidate, message: null })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to start interview: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const submitAnswer = async (sessionId, message) => {
  const response = await fetch(`${API_BASE_URL}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Omit candidate to ensure we don't re-initialize the session
    body: JSON.stringify({ sessionId, message })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to submit answer: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};
