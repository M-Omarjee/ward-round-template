document.addEventListener('DOMContentLoaded', () => {
    // FIX: IDs must match the index.html file exactly:
    // 1. 'current-notes' matches the <textarea>
    // 2. 'summarize-btn' matches the <button>
    // 3. 'summary-output' matches the <div> below the button
    const notesInput = document.getElementById('current-notes');
    const summarizeButton = document.getElementById('summarize-btn');
    const summaryOutput = document.getElementById('summary-output');

    summarizeButton.addEventListener('click', async () => {
        
        console.log("--- Executing v1.6 Final Request ---"); 
        
        const input_text = notesInput.value.trim();

        if (input_text.length < 50) {
            summaryOutput.innerHTML = '<p class="text-red-500">Please enter at least 50 characters of notes to summarize.</p>';
            return;
        }

        summaryOutput.innerHTML = '<p class="text-gray-500">Generating summary...</p>';

        try {
            const response = await fetch('http://127.0.0.1:5000/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: input_text }),
            });

            if (!response.ok) {
                // If the server responded with an error status (e.g., 400 or 500)
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // 4. Display the Result
            if (data.summary) {
                // NEW LOGIC: Map the array of sentences returned from Python 
                // to correct HTML <li> elements for proper wrapping.
                const summaryListHTML = data.summary.map(sentence => 
                    `<li class="mb-2">${sentence}</li>`
                ).join('');
                
                summaryOutput.innerHTML = `
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                        <h2 class="text-xl font-semibold mb-3 text-indigo-700">Clinical Summary:</h2>
                        <!-- Use a standard <ul> list (Tailwind: list-disc) to force correct wrapping and ensure text stays inside the box -->
                        <ul class="list-disc list-inside space-y-2 text-gray-800 leading-relaxed">
                            ${summaryListHTML}
                        </ul>
                    </div>
                `;
            } else if (data.error) {
                summaryOutput.innerHTML = `<p class="text-red-500">Error from server: ${data.error}</p>`;
            }

        } catch (error) {
            console.error('Connection Error:', error);
            summaryOutput.innerHTML = `<p class="text-red-500">Connection Error: Could not reach the Python server at http://127.0.0.1:5000/summarize. Is app.py running? (${error.message})</p>`;
        }
    });
});
