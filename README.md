🏥 Ward Round Documentation Template
A modern, single-page clinical documentation template optimized for hospital ward rounds.
It pairs a responsive frontend for data entry/visualisation with a lightweight Flask API that generates concise, clinically-prioritised summaries.
🛑 Critical Disclaimer
This template is for educational, demonstration, and conceptual use only.
It must NOT be used for clinical care, diagnosis, treatment, or official documentation.
Always use authorised, validated, and secure hospital systems for real patient data.
✨ Key Features
Frontend (index.html)
Single-file app: HTML + Tailwind CSS + vanilla JS (no build tools).
Responsive UI: Works on mobile, tablet, and desktop.
Structured flow: Patient Details → Daily Progress → Systems Review → Plan/Management → Sign-off.
Anatomical diagrams (HTML <canvas> + JS):
Respiratory (Lungs): smooth, symmetrical lung shapes (cardiac notch deliberately excluded).
Gastrointestinal (Abdomen): simple hexagon with central umbilicus.
Lower Limbs: outlines of upper thighs for vascular/motor notes.
Backend (app.py) – AI-style Summarisation
Clinical keyword prioritisation: Scores and boosts sentences with terms like antibiotic, discharge, blood culture, escalate, sepsis, IV, CXR, etc.
Concise output: Returns a short, bulleted summary suitable for handovers.
Simple API: Single POST /summarize endpoint.
🗂 Project Structure
.
├─ index.html       # Frontend: UI + Tailwind + Canvas drawings + fetch() calls
└─ app.py           # Backend: Flask API + keyword-prioritised summariser
🚀 Quick Start
1) Frontend (no build step)
Just open index.html in a modern browser.
Tip: if your browser blocks local AJAX requests, serve it locally:
# Option A: Python simple server
python3 -m http.server 8000
# visit http://127.0.0.1:8000/index.html

# Option B: Node (if installed)
npx serve .
2) Backend (Flask API)
# create & activate a venv if you like
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

pip install Flask flask-cors
python app.py
The API runs at: http://127.0.0.1:5000/
The frontend is already configured to call POST /summarize on http://127.0.0.1:5000/ (adjust in code if you host elsewhere).
🔌 API
POST /summarize
Generate a concise, keyword-prioritised summary from free-text clinical notes.
Request (JSON)
{
  "notes": "Free-text ward round notes here..."
}
Response (JSON)
{
  "bullets": [
    "• Started IV antibiotics for CAP; repeat CRP tomorrow.",
    "• Blood cultures taken; monitor results.",
    "• Wean O2 as sats stable on room air.",
    "• Consider discharge if afebrile 24h and oral switch tolerated."
  ]
}
cURL Example
curl -X POST http://127.0.0.1:5000/summarize \
  -H "Content-Type: application/json" \
  -d '{"notes": "Patient admitted with CAP... antibiotics started ... blood cultures sent ..."}'
🧠 How the Summariser Works (Brief)
Splits text into sentences.
Applies priority scores to sentences containing clinically significant keywords (e.g., medications, investigations, escalation, discharge readiness).
Sorts by score + recency; returns a short bulleted list.
This is a deterministic heuristic, not a patient-data-trained model. It’s designed for demos and can be extended with real NLP/LLM later.
🧩 Customisation Ideas
Add/adjust keyword lists and weights (e.g., include site-specific protocols).
Persist entries with a backend store (SQLite/Postgres) and expose /patients, /entries routes.
Export a printable PDF/summary sheet.
Add authentication and role-based access.
Replace heuristic summary with an LLM (with strict governance).
🔒 Privacy & Safety
Do not use with real patient data.
If you extend this beyond a demo, you are responsible for compliance (IG, DPIA, security, audit trails, access control, hosting).
🐞 Troubleshooting
Frontend can’t reach API: check CORS in app.py, confirm Flask is running, and verify the URL matches what the frontend calls.
Local file AJAX blocked: serve index.html via a local server (see Quick Start).
📸 Screenshots (optional)
Add screenshots/gifs here:
Main form view
Canvas diagrams
Summary panel
📝 License
MIT — free to use, adapt, and share.
Please retain the Critical Disclaimer in derivative works.
🤝 Contributing
PRs welcome!
Good first issues: add keywords, improve diagrams, tidy UI, add tests, or wire up a simple persistence layer.
If you want, I can also generate a minimal app.py and index.html that match this README exactly so you can run it immediately.
