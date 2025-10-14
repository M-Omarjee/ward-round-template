# 🏥 Ward Round Documentation Template

A modern, single-page clinical documentation template optimized for hospital ward rounds.  
It pairs a responsive **frontend** for data entry/visualisation with a lightweight **Flask API** that generates concise, clinically-prioritised summaries.

> **🛑 Critical Disclaimer**  
> This template is for **educational, demonstration, and conceptual** use only.  
> It must **NOT** be used for clinical care, diagnosis, treatment, or official documentation.  
> Always use authorised, validated, and secure hospital systems for real patient data.

---

## ✨ Key Features

### Frontend (`index.html`)
- **Single-file app**: HTML + Tailwind CSS + vanilla JS (no build tools).
- **Responsive UI**: Works on mobile, tablet, and desktop.
- **Structured flow**: Patient Details → Daily Progress → Systems Review → Plan/Management → Sign-off.
- **Anatomical diagrams** (HTML `<canvas>` + JS):
  - **Respiratory (Lungs)**: smooth, symmetrical lung shapes (cardiac notch deliberately excluded).
  - **Gastrointestinal (Abdomen)**: simple hexagon with central umbilicus.
  - **Lower Limbs**: outlines of upper thighs for vascular/motor notes.

### Backend (`app.py`) – AI-style Summarisation
- **Clinical keyword prioritisation**: Scores and boosts sentences with terms like `antibiotic`, `discharge`, `blood culture`, `escalate`, `sepsis`, `IV`, `CXR`, etc.
- **Concise output**: Returns a short, bulleted summary suitable for handovers.
- **Simple API**: Single `POST /summarize` endpoint.

---

## 🗂 Project Structure

.
├─ index.html # Frontend: UI + Tailwind + Canvas drawings + fetch() calls

└─ app.py # Backend: Flask API + keyword-prioritised summariser

## 🚀 How to Run

### 1) Start the backend (Flask)

(optional) activate venv first
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install Flask flask-cors   # first time only
python app.py

### 2) Open the frontend

Just double-click index.html (or open it in the browser).

## 🧠 How the Summariser Works (Brief)

Splits text into sentences.
Applies priority scores to sentences containing clinically significant keywords (e.g., medications, investigations, escalation, discharge readiness).
Sorts by score + recency; returns a short bulleted list.
This is a deterministic heuristic, not a patient-data-trained model. It’s designed for demos and can be extended with real NLP/LLM later.

## 🔒 Privacy & Safety
Do not use with real patient data.

## 🤝 Contributing
PRs welcome! Good first issues: add keywords, improve diagrams, tidy UI, add tests, or wire up a simple persistence layer.
