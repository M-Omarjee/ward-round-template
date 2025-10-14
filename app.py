# ----------------------------------------------------
# REVISED 1. Imports and Setup (No need for torch/transformers)
# ----------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import networkx as nx
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from string import punctuation

# Download necessary NLTK data (only runs once)
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except:
    print("NLTK download failed. Check internet connection or run 'import nltk; nltk.download(\"punkt\")' manually.")


# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# ----------------------------------------------------
# REVISED 2. Extractive Summarization Function (TextRank-style)
# ----------------------------------------------------
def get_extractive_summary(text, top_n_sentences=3):
    # 1. Clean and Tokenize
    sentences = sent_tokenize(text)
    if len(sentences) <= top_n_sentences:
        return text # Return original text if too short

    word_frequencies = {}
    stop_words = set(stopwords.words('english') + list(punctuation))
    
    for word in word_tokenize(text.lower()):
        if word not in stop_words:
            if word not in word_frequencies.keys():
                word_frequencies[word] = 1
            else:
                word_frequencies[word] += 1
    
    # 2. Score sentences
    sentence_scores = {}
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence.lower()):
            if word in word_frequencies.keys():
                if i not in sentence_scores:
                    sentence_scores[i] = word_frequencies[word]
                else:
                    sentence_scores[i] += word_frequencies[word]
    
    # 3. Select top sentences
    # We use NetworkX to simplify the selection of the most important nodes (sentences)
    # The scores are simplified here, but the principle is the same.
    sorted_scores = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
    
    summary_sentences = []
    # Take the indices of the top N sentences and sort them back into original order
    top_indices = [index for index, score in sorted_scores[:top_n_sentences]]
    for index in sorted(top_indices):
        summary_sentences.append(sentences[index])
    
    return ' '.join(summary_sentences)


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
        # Run the simpler extractive summary
        summary = get_extractive_summary(input_text, top_n_sentences=3)
        return jsonify({"summary": summary})
    except Exception as e:
        print(f"Summarization error: {e}")
        return jsonify({"error": "An internal error occurred during summarization."}), 500


# ----------------------------------------------------
# 4. Run the App
# ----------------------------------------------------
if __name__ == '__main__':
    print("--- Starting Ward Round Template API ---")
    app.run(debug=True, port=5000)