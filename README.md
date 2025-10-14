🏥 Clinical Ward Round Documentation Template
This project delivers a modern, single-page clinical documentation template optimized for hospital ward rounds. It combines a user-friendly, responsive frontend interface with a specialized backend service for quick, clinically focused note summarization.

🛑 Disclaimer
This template is intended solely for educational, demonstration, and conceptual purposes. It must NOT be used for actual clinical care, patient diagnosis, treatment, or official medical documentation. Always use authorized, validated, and secure hospital systems for real patient data.

📦 Project Structure
The application is split into two core files:

index.html (Frontend / Canvas): Contains the complete structure, styling (Tailwind CSS), and all embedded JavaScript logic for the UI, dynamic features, and anatomical drawings.

app.py (Backend API): A Python Flask application responsible for processing clinical notes and generating keyword-prioritized summaries.

✨ Frontend Features (index.html)
The main HTML Canvas is designed to mirror a professional clinical documentation sheet while incorporating interactive elements:

1. Dynamic UI & Aesthetics

Fully Responsive Layout: Optimized for use on mobile devices (e.g., ward tablets) and desktop monitors using Tailwind CSS.

Real-time Timestamp: Displays the exact time the documentation was accessed/written.

Professional Sections: Clearly defined areas for Patient Details, Daily Progress, Systems Review, and Plan/Management.

Sign-Off Block: Includes dedicated input fields for Sign (Name / Signature) and Grade / Role.

2. Anatomical Diagrams

The template includes embedded <canvas> elements for three key system reviews, using JavaScript to draw clear anatomical outlines that can be annotated by the user:

Respiratory (Lungs): Features a refined, smooth, and symmetrical lung shape (specifically requested to exclude the cardiac notch).

Gastrointestinal (Abdomen): Features a simple hexagonal outline with a central umbilicus.

Lower Limbs (Vascular/Motor): Features simple outlines of upper thighs.

3. AI Summarization Integration

A dedicated section allows clinicians to input detailed subjective and objective data, which can then be processed by the backend API.

'Generate/Refresh AI Summary' Button: Triggers an API call to summarize the clinical notes.

Error Handling: Includes visual feedback (loading, success, or failure messages) for the API communication.

💻 Backend Service (app.py)
The Flask API provides the intelligence for rapid clinical summarization.

1. Clinical Keyword Prioritization

The summarization algorithm is custom-built for a clinical environment:

Priority Scoring: Sentences containing High-Priority Clinical Keywords (e.g., blood culture, antibiotic, vital sign, discharge) receive a substantial boost in their score.

Relevance: This ensures the resulting summary focuses on key medical actions, changes in status, and management plans, rather than only common high-frequency words.

2. Output Structure

Bullet Points: The final summary is formatted as a concise bulleted list for improved readability during clinical handovers.

Filtering: Filters out common stop words and handles basic punctuation.

This dual-system setup ensures that the clinical team has a robust and intelligent tool for efficient and accurate documentation.
