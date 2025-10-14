document.addEventListener('DOMContentLoaded', () => {
    // FIX: IDs must match the index.html file exactly:
    const notesInput = document.getElementById('current-notes');
    const summarizeButton = document.getElementById('summarize-btn');
    const summaryOutput = document.getElementById('summary-output');

    // --- Annotation Canvas Setup ---
    const canvases = [
        { id: 'canvas-lungs', drawShape: drawLungs },
        { id: 'canvas-abdomen', drawShape: drawAbdomen },
        { id: 'canvas-legs', drawShape: drawLegs }
    ];

    /**
     * Sets up a canvas for drawing, including shape rendering and touch/mouse event listeners.
     */
    function setupCanvas(canvasId, drawShape) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        // Draw the background shape first
        drawShape(ctx, canvas.width, canvas.height);

        // Drawing event handlers for mouse
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.moveTo(e.offsetX, e.offsetY);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        // Touch events for mobile annotation (Essential for touch devices)
        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            // Calculate touch position relative to the canvas
            ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
            e.preventDefault(); // Prevent scrolling while drawing
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDrawing) return;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
            e.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            isDrawing = false;
        });
    }

    // --- Drawing Functions (Draws the base clinical shapes) ---
    function drawLungs(ctx, w, h) {
        ctx.fillStyle = '#f0f9ff'; // Blue-50 background
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        
        const cX = w / 2;
        
        ctx.save();
        ctx.translate(cX, h / 2);
        ctx.scale(0.8, 0.8);
        
        // Left Lung shape
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.bezierCurveTo(-40, -80, -20, -130, -50, -100);
        ctx.bezierCurveTo(-100, -160, -100, 100, -20, 100);
        ctx.lineTo(-20, 0);
        ctx.closePath();
        ctx.stroke();

        // Right Lung shape
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.bezierCurveTo(40, -80, 20, -130, 50, -100);
        ctx.bezierCurveTo(100, -160, 100, 100, 20, 100);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
        ctx.font = '10px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Tap/Click to annotate murmurs, creps, or rubs.', 10, h - 10);
    }

    function drawAbdomen(ctx, w, h) {
        ctx.fillStyle = '#f0fdf4'; // Green-50 background
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;

        const cX = w / 2;
        const cY = h / 2;
        const radiusX = 100;
        const radiusY = 120;

        // Oval shape for abdomen
        ctx.beginPath();
        ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Quadrants cross
        ctx.beginPath();
        ctx.moveTo(cX, cY - radiusY);
        ctx.lineTo(cX, cY + radiusY);
        ctx.moveTo(cX - radiusX, cY);
        ctx.lineTo(cX + radiusX, cY);
        ctx.strokeStyle = '#d1d5db';
        ctx.stroke();

        ctx.font = '10px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Tap/Click to mark tenderness, masses, or rigidity.', 10, h - 10);
    }

    function drawLegs(ctx, w, h) {
        ctx.fillStyle = '#fefce8'; // Yellow-50 background
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;

        const cX = w / 2;
        const startY = 30;
        const height = 180;
        const width = 40;

        // Left Leg
        ctx.beginPath();
        ctx.rect(cX - width - 10, startY, width, height);
        ctx.stroke();
        
        // Right Leg
        ctx.beginPath();
        ctx.rect(cX + 10, startY, width, height);
        ctx.stroke();
        
        // Feet (simplified)
        ctx.beginPath();
        ctx.rect(cX - width - 10, startY + height, width, 20);
        ctx.rect(cX + 10, startY + height, width, 20);
        ctx.stroke();

        ctx.font = '10px Inter';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Tap/Click to mark erythema, swelling, or DVT signs.', 10, h - 10);
    }
    
    // --- Summarization Logic (Function runs on click and on load) ---
    const runSummarization = async () => {
        // Log to confirm JS is executing
        console.log("--- Executing v1.6 Final Request ---"); 
        
        const input_text = notesInput.value.trim();

        if (input_text.length < 50) {
            // Only show a friendly error if the user tries to click the button with empty notes
            if (event && event.type === 'click') {
                summaryOutput.innerHTML = '<p class="text-red-500">Please enter at least 50 characters of notes to summarize.</p>';
            }
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
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // 4. Display the Result
            if (data.summary && Array.isArray(data.summary)) {
                // Map the array of sentences to <li> elements
                const summaryListHTML = data.summary.map(sentence => 
                    `<li class="mb-2">${sentence}</li>`
                ).join('');
                
                // Use a standard <ul> list to ensure text wrapping is correct
                summaryOutput.innerHTML = `
                    <div class="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow-inner">
                        <h2 class="text-xl font-semibold mb-3 text-yellow-800">Clinical Summary:</h2>
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
            // Informative error message for the user
            summaryOutput.innerHTML = `<p class="text-red-500">Connection Error: Could not reach the Python server at http://127.0.0.1:5000/summarize. Please ensure <b>app.py</b> is running in a separate terminal.</p>`;
        }
    };

    // Attach summarization function to the button
    summarizeButton.addEventListener('click', runSummarization);
    
    // --- Initialization ---
    
    // 1. Setup all annotation canvases
    canvases.forEach(item => setupCanvas(item.id, item.drawShape));

    // 2. Populate notes (for automatic summary) and run initial summary automatically (as requested)
    // NOTE: This text is just a placeholder to ensure the automatic summary runs on load. 
    notesInput.value = "Patient A. Johnson is stable post-procedure. Current vital sign monitoring is unremarkable, but his heart rate is trending slightly higher at 88 bpm. We started him on his morning dose of oral antibiotics. The primary concern is that he has not had sufficient fluid intake in the last 12 hours. We need to collect a new set of blood culture samples first thing in the morning due to the fever spike two days ago. He is showing good mobility but reports 4/10 pain at the surgical site. The social work consult is scheduled for 10 AM to finalize the post-acute care options. Current plan is for a provisional discharge on Thursday, pending confirmation from the team review.";
    
    // Run the summary automatically when the page loads
    // We wrap this in a timeout to ensure all browser rendering is finished first.
    setTimeout(runSummarization, 50); 
});
