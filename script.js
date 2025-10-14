document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarize-btn');
    const currentNotes = document.getElementById('current-notes');
    const summaryOutput = document.getElementById('summary-output');

    // The URL for your Python Flask server
    const API_URL = 'http://127.0.0.1:5000/summarize';

    summarizeBtn.addEventListener('click', async () => {
        const textToSummarize = currentNotes.value;

        if (textToSummarize.length < 50) {
            summaryOutput.innerHTML = '<p>Please enter more detailed notes (at least 50 characters) to generate a useful summary.</p>';
            return;
        }

        // 1. Show Loading State
        summaryOutput.innerHTML = '<p>Generating summary... This may take a moment.</p>';
        summarizeBtn.disabled = true; // Disable button while working

        try {
            // 2. Send Data to Python Flask API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Send the notes as JSON
                body: JSON.stringify({ text: textToSummarize })
            });

            // Check if the API request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // 3. Get the Summary from the Response
            const data = await response.json();

            // 4. Display the Result
            if (data.summary) {
                summaryOutput.innerHTML = `
                    <h2>AI Summary:</h2>
                    <p>${data.summary}</p>
                `;
            } else {
                summaryOutput.innerHTML = `<p class="error">Error: Could not retrieve summary. ${data.error || ''}</p>`;
            }

        } catch (error) {
            // Handle any network or server errors
            summaryOutput.innerHTML = `<p class="error">Connection Error: Could not reach the Python server at ${API_URL}. Is app.py running?</p>`;
            console.error('Summarization failed:', error);
        } finally {
            summarizeBtn.disabled = false; // Re-enable button
        }
    });
});