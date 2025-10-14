# ----------------------------------------------------
# 1. Imports and Setup (NO NLTK or external data needed)
# ----------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import defaultdict
import re
from string import punctuation

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# ----------------------------------------------------
# Define High-Priority Clinical Keywords (Case-insensitive)
# ----------------------------------------------------
CLINICAL_KEYWORDS = [
    'blood culture', 'urine output', 'vital sign', 'imaging', 'radiology',
    'discharge', 'antibiotic', 'medication', 'fluid intake', 'consult',
    'diagnosis', 'temp', 'pain', 'fever'
]

# Define common words and punctuation to ignore
STOP_WORDS = set([
    'a', 'an', 'the', 'is', 'am', 'are', 'was', 'were', 'be', 'of', 'to', 'in', 
    'on', 'at', 'for', 'with', 'and', 'or', 'but', 'as', 'it', 'he', 'she', 
    'they', 'we', 'you', 'i', 'me', 'him', 'her', 'us', 'them', 'this', 'that'
] + list(punctuation))

# ----------------------------------------------------
# 2. IMPROVED Keyword-Based Summarization Function
#    - Prioritizes clinical keywords
#    - Formats output as a bulleted list
# ----------------------------------------------------
def get_keyword_summary(text, top_n_sentences=4):
    if not text:
        return ""

    # Split text into sentences
    # Regex splits sentences while keeping the punctuation mark at the end
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    
    # If the notes are too short, just return them as a bulleted list
    if len(sentences) <= top_n_sentences:
        return ' • ' + '\n • '.join(sentences)

    # 1. Calculate word frequencies
    word_frequencies = defaultdict(int)
    words = re.findall(r'\b\w+\b', text.lower())
    
    for word in words:
        if word not in STOP_WORDS:
            word_frequencies[word] += 1
            
    # 2. Calculate sentence scores
    sentence_scores = defaultdict(int)
    for i, sentence in enumerate(sentences):
        sentence_lower = sentence.lower()
        
        # Base scoring: Add frequency score for standard keywords
        for word in re.findall(r'\b\w+\b', sentence_lower):
            if word in word_frequencies:
                sentence_scores[i] += word_frequencies[word]
        
        # Priority Scoring: BOOST score for critical clinical terms
        for term in CLINICAL_KEYWORDS:
            if term in sentence_lower:
                # Add a substantial boost (e.g., score equivalent to 5 high-frequency words)
                sentence_scores[i] += 5 

    # 3. Select top sentences
    # Get the indices of the top N sentences based on score
    sorted_scores = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
    top_indices = [index for index, score in sorted_scores[:top_n_sentences]]
    
    # Sort the sentences back into their original order
    summary_sentences = [sentences[index] for index in sorted(top_indices)]
    
    # 4. Format the output as a bulleted list
    return summary_sentences


# ----------------------------------------------------
# 3. The API Route (Endpoint remains the same)
# ----------------------------------------------------
@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    input_text = data.get('text', '')

    if not input_text or len(input_text) < 50:
        return jsonify({"error": "Please provide at least 50 characters of notes."}), 400

    try:
        # Now calls the improved summarizer
        summary_list = get_keyword_summary(input_text, top_n_sentences=4)
        return jsonify({"summary": summary_list})
    except Exception as e:
        print(f"Summarization error: {e}")
        return jsonify({"error": "An internal error occurred during summarization."}), 500


# ----------------------------------------------------
# 4. Run the App
# ----------------------------------------------------
if __name__ == '__main__':
    print("--- Starting Ward Round Template API (Improved Clinical Summarizer) ---")
    app.run(debug=True, port=5000)
