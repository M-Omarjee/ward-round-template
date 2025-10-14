# ----------------------------------------------------
# 1. Imports and Setup
# ----------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# Initialize the Flask app
app = Flask(__name__)
# Enable CORS for development (Allows your JavaScript to talk to this Python server)
CORS(app)

# Initialize the Hugging Face summarization pipeline
# NOTE: This model downloads on the first run, which may take a minute.
try:
    # Using BART large CNN for good quality abstractive summarization
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    print("AI Summarization model loaded successfully!")
except Exception as e:
    # Fallback if the model cannot be loaded (e.g., if there's no internet)
    print(f"Error loading model: {e}")
    summarizer = lambda text, **kwargs: [{"summary_text": "AI model loading failed."}]


# ----------------------------------------------------
# 2. The API Route (Endpoint)
# ----------------------------------------------------
# This function runs when the JavaScript sends a POST request to /summarize
@app.route('/summarize', methods=['POST'])
def summarize_text():
    # 1. Get text from the front-end
    data = request.get_json()
    input_text = data.get('text', '')

    if not input_text or len(input_text) < 50:
        return jsonify({"error": "Please provide at least 50 characters of notes."}), 400

    # 2. Run the AI summarization
    summary_result = summarizer(
        input_text,
        max_length=150, 
        min_length=30,  
        do_sample=False  
    )

    # 3. Extract and return the summary
    summary = summary_result[0]['summary_text']
    
    return jsonify({"summary": summary})

# ----------------------------------------------------
# 3. Run the App
# ----------------------------------------------------
if __name__ == '__main__':
    # Runs the server locally on port 5000 (http://127.0.0.1:5000/)
    app.run(debug=True, port=5000)