import json
import os
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [import-error]
from typing import Optional, List, Dict, Set
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Interview Agent")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[dict] = None
    message: Optional[str] = None

class Feedback(BaseModel):
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]

class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[Feedback] = None

# --- Data Loading ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRICULUM_PATH = os.path.join(BASE_DIR, "curriculum.json")
CANDIDATES_PATH = os.path.join(BASE_DIR, "candidates.json")

def load_json(path: str) -> dict:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

curriculum_data = load_json(CURRICULUM_PATH)
candidates_data = load_json(CANDIDATES_PATH)

# Dictionary for fast curriculum day lookup
curriculum_days = {day["day"]: day for day in curriculum_data.get("days", [])}

# --- State Management ---
# In-memory session store
sessions: Dict[str, dict] = {}

def select_interview_topics(candidate_missions: List[dict]) -> List[dict]:
    """Selects interview topics based on candidate learning history."""
    skipped = []
    multiple_attempts = []
    strong = []
    
    for m in candidate_missions:
        if m.get("skipped"):
            skipped.append(m)
        elif m.get("attempts", 0) > 1:
            multiple_attempts.append(m)
        elif m.get("passed"):
            strong.append(m)
            
    # Prioritize skipped, then multiple attempts, then strong topics
    selected_missions = skipped + multiple_attempts + strong
    
    topics = []
    seen_days = set()
    
    for m in selected_missions:
        day_num = m.get("day")
        if day_num in seen_days:
            continue
        day_info = curriculum_days.get(day_num)
        if day_info:
            topics.append({
                "day": day_num,
                "title": day_info["title"],
                "type": day_info["type"]
            })
            seen_days.add(day_num)
            
    # Always pad with general curriculum to ensure enough topics
    # This prevents the interview from repeating questions when selected_missions is small.
    for day_num, day_info in curriculum_days.items():
        if day_num not in seen_days:
            topics.append({
                "day": day_num,
                "title": day_info["title"],
                "type": day_info["type"]
            })
            seen_days.add(day_num)
    
    return topics

def generate_mock_question(topic: dict) -> str:
    title = topic.get("title", "this topic")
    return f"Can you explain your approach and experience with {title}?"

def generate_mock_follow_up(answer: str, topic: dict) -> str:
    # A simple deterministic follow-up acknowledgment
    word_count = len(answer.split())
    if word_count > 10:
        return f"That's a detailed answer regarding {topic.get('title')}. It shows good depth."
    else:
        return f"Thanks for summarizing your thoughts on {topic.get('title')}."

@app.get("/")
def root():
    return {"message": "AI Interview Agent Backend is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/interview", response_model=InterviewResponse)
def interview(request: InterviewRequest):
    session_id = request.sessionId
    
    # 1. Initialize session if candidate is provided
    if request.candidate is not None:
        missions = request.candidate.get("missions", [])
        topics = select_interview_topics(missions)
        
        first_topic = topics[0] if topics else {"day": 1, "title": "General Basics"}
        first_q = generate_mock_question(first_topic)
        name = request.candidate.get("member", {}).get("name", "Candidate")
        
        reply = f"Welcome {name}. Let's begin your interview. {first_q}"
        
        sessions[session_id] = {
            "candidate": request.candidate,
            "topics": topics,
            "history": [{"role": "agent", "content": reply}],
            "questions_asked": 1,
            "days_covered": {first_topic.get("day", 1)},
            "current_topic_idx": 0,
            "state": "initialized"
        }
        
        if not request.message:
            return InterviewResponse(
                reply=reply,
                done=False
            )

    # 2. Retrieve session or fallback
    if session_id not in sessions:
        # Fallback if session doesn't exist for some reason
        topics = select_interview_topics([])
        first_topic = topics[0] if topics else {"day": 1, "title": "General Basics"}
        first_q = generate_mock_question(first_topic)
        
        reply = f"Welcome Candidate. Let's begin your interview. {first_q}"
        
        sessions[session_id] = {
            "candidate": {},
            "topics": topics,
            "history": [{"role": "agent", "content": reply}],
            "questions_asked": 1,
            "days_covered": {first_topic.get("day", 1)},
            "current_topic_idx": 0,
            "state": "initialized"
        }
        
        if not request.message:
            return InterviewResponse(reply=reply, done=False)

    session = sessions[session_id]
    topics = session["topics"]

    # 3. Handle already completed sessions
    if session["state"] == "done":
        return InterviewResponse(
            reply="Interview completed.",
            done=True,
            feedback=Feedback(
                summary="The interview was already completed.",
                strengths=[], gaps=[], next=[]
            )
        )
        
    # 4. Process the candidate's turn
    user_message = request.message or ""
    if user_message:
        session["history"].append({"role": "candidate", "content": user_message})

    # 5. Check if completion criteria are met
    # "Do not finish the interview before at least 8 questions have been asked and 4 curriculum days have been covered."
    if session["questions_asked"] >= 8 and len(session["days_covered"]) >= 4:
        session["state"] = "done"
        
        feedback = Feedback(
            summary=f"The candidate successfully completed the mock interview, covering {len(session['days_covered'])} curriculum topics over {session['questions_asked']} questions.",
            strengths=[
                "Consistently provided answers to all technical prompts.",
                f"Successfully engaged in topics such as {topics[0]['title'] if topics else 'AI fundamentals'}."
            ],
            gaps=[
                "This is a mock evaluation, so technical depth was not fully verified.",
                "Needs to demonstrate hands-on coding in the next stage."
            ],
            next=[
                "Review the candidate's actual answers in the session history.",
                "Schedule a follow-up coding interview."
            ]
        )
        
        return InterviewResponse(
            reply="Thank you for your time and detailed answers. The interview is now completed.",
            done=True,
            feedback=feedback
        )

    # 6. Generate the next question
    # Ask a follow-up to the previous topic, and a question for the next topic
    prev_topic = topics[session["current_topic_idx"]] if session["current_topic_idx"] < len(topics) else {"day": 1, "title": "General Topic"}
    
    # Advance topic index safely
    session["current_topic_idx"] = (session["current_topic_idx"] + 1) % max(1, len(topics))
    next_topic = topics[session["current_topic_idx"]] if topics else {"day": 1, "title": "Next Topic"}
    
    follow_up = generate_mock_follow_up(user_message, prev_topic)
    next_q = generate_mock_question(next_topic)
    
    reply = f"{follow_up} {next_q}"
    
    session["days_covered"].add(next_topic.get("day", 1))
    session["questions_asked"] += 1
    session["history"].append({"role": "agent", "content": reply})
    
    return InterviewResponse(reply=reply, done=False)

if __name__ == "__main__":
    import uvicorn
    # Bind to PORT if set by the environment (e.g. Railway), default to 8000
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)