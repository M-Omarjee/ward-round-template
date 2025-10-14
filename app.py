# ----------------------------------------------------
# 1. DEPENDENCIES (Install these first! See D.)
# ----------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# ----------------------------------------------------
# 2. INITIALIZATION
# ----------------------------------------------------
# Initialize the Flask app
app = Flask(__name__)
# Enable CORS for development (Allows your HTML/JS to talk to this Python server)
CORS(app)

# Initialize the Hugging Face summarization pipeline
# We use a popular, pre-trained model for abstractive summarization
# NOTE: The first run will download the model, which may take a few minutes.
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    print("Summarization model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    # Create a dummy summarizer for testing if the model download fails
    summarizer = lambda text, **kwargs: [{"summary_text": "Error loading AI model. Try again later."}]


# ----------------------------------------------------
# 3. THE API ROUTE
# ----------------------------------------------------
# Define the endpoint that your JavaScript will call
@app.route('/summarize', methods=['POST'])
def summarize_text():
    # Expects a JSON payload with a 'text' key
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    input_text = data['text']

    # Set parameters for the summary generation
    # You can adjust these for length/quality
    summary_result = summarizer(
        input_text,
        max_length=150, # Max length of the generated summary
        min_length=30,  # Min length of the generated summary
        do_sample=False  # Deterministic generation
    )

    # The result is a list of dictionaries, we extract the text
    summary = summary_result[0]['summary_text']

    # Return the summary as a JSON response to the front-end
    return jsonify({"summary": summary})

# ----------------------------------------------------
# 4. RUNNING THE APP
# ----------------------------------------------------
if __name__ == '__main__':
    # Runs the server locally on http://127.0.0.1:5000/
    app.run(debug=True)