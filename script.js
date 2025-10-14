/**
 * Smart Ward Round Template - JavaScript Logic
 * This script handles Canvas drawing for anatomical diagrams and AI summarization calls.
 * All anatomical drawings are generated directly via the Canvas API.
 */

// --- Configuration ---
// Placeholder for the API Key - will be provided by the runtime environment
const apiKey = ""; 
const model = "gemini-2.5-flash-preview-05-20";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

// --- Drawing Utilities ---
const drawCircle = (ctx, x, y, radius, color = '#1e40af') => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.stroke();
};

const drawOutline = (ctx, path, closePath = true) => {
    ctx.beginPath();
    path(ctx);
    if (closePath) {
        ctx.closePath();
    }
    ctx.strokeStyle = '#374151'; // Dark gray outline
    ctx.lineWidth = 2;
    ctx.stroke();
};

// --- Anatomical Drawing Functions ---

/**
 * Draws two identical, mirrored lung shapes without the cardiac notch.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 */
function drawLungs(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const neckTop = height * 0.15;
    const lungHeight = height * 0.7;
    const lungWidth = width * 0.35;
    const centralSpacing = width * 0.05;

    // Drawing Path for a single lung (Patient's Right / Viewer's Left)
    const drawSingleLung = (offsetX) => (c) => {
        const x = centerX + offsetX;
        
        // Start at the rounded top-center point
        c.moveTo(x, neckTop); 
        
        // Curve for the top shoulder/apex
        c.bezierCurveTo(
            x + lungWidth * 0.5, neckTop - height * 0.05, // Control 1 (out and up)
            x + lungWidth, neckTop + height * 0.1,        // Control 2 (out and down)
            x + lungWidth, neckTop + lungHeight * 0.5     // Mid-side point
        );
        
        // Curve for the outer lower side
        c.bezierCurveTo(
            x + lungWidth * 1.1, neckTop + lungHeight * 0.8, // Control 3 (out, bottom curve)
            x + lungWidth * 0.5, neckTop + lungHeight,       // Control 4 (in, bottom curve)
            x, neckTop + lungHeight                         // Bottom center point
        );
        
        // Straight line up the medial (inner) side
        c.lineTo(x, neckTop + lungHeight); 
        
        // Inner curve toward the center (mediastinum edge)
        c.bezierCurveTo(
            x + centralSpacing * 0.5, neckTop + lungHeight * 0.7, // Control 5 (slightly in)
            x + centralSpacing * 0.5, neckTop + lungHeight * 0.3, // Control 6 (slightly in)
            x, neckTop                                           // Back to top center point
        );
    };

    // Patient's Right Lung (Viewer's Left)
    ctx.save();
    ctx.translate(0, 0); // No flip needed
    drawOutline(ctx, drawSingleLung(-centralSpacing / 2 - lungWidth));
    ctx.restore();

    // Patient's Left Lung (Viewer's Right) - Mirroring the drawing
    ctx.save();
    ctx.scale(-1, 1); // Flip horizontally
    ctx.translate(-width, 0); // Translate back to keep it centered
    drawOutline(ctx, drawSingleLung(-centralSpacing / 2 - lungWidth));
    ctx.restore();
}

/**
 * Draws a hexagonal abdomen outline with a small central umbilicus.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 */
function drawAbdomen(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const rectX = width * 0.2;
    const rectY = height * 0.2;
    const rectW = width * 0.6;
    const rectH = height * 0.6;

    const umbilicusX = width / 2;
    const umbilicusY = height / 2;
    const umbilicusRadius = 5;

    const path = (c) => {
        // Hexagon shape (simple torso)
        c.moveTo(rectX + rectW / 4, rectY);                  // Top-Left Point
        c.lineTo(rectX + rectW * 3 / 4, rectY);              // Top-Right Point
        c.lineTo(rectX + rectW, rectY + rectH / 4);          // Upper Right Corner
        c.lineTo(rectX + rectW, rectY + rectH * 3 / 4);      // Lower Right Corner
        c.lineTo(rectX + rectW * 3 / 4, rectY + rectH);      // Bottom-Right Point
        c.lineTo(rectX + rectW / 4, rectY + rectH);          // Bottom-Left Point
        c.lineTo(rectX, rectY + rectH * 3 / 4);              // Lower Left Corner
        c.lineTo(rectX, rectY + rectH / 4);                  // Upper Left Corner
    };
    
    drawOutline(ctx, path);
    drawCircle(ctx, umbilicusX, umbilicusY, umbilicusRadius, '#374151'); // Dark gray belly button
}

/**
 * Draws two simple, separate leg shapes (upper thighs).
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 */
function drawLegs(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const legWidth = width * 0.35;
    const legHeight = height * 0.7;
    const gap = width * 0.05;
    const topY = height * 0.15;

    // Leg 1 (Viewer's Left)
    const leg1X = width / 2 - legWidth - gap / 2;
    const path1 = (c) => {
        c.rect(leg1X, topY, legWidth, legHeight);
    };
    drawOutline(ctx, path1, false);

    // Leg 2 (Viewer's Right)
    const leg2X = width / 2 + gap / 2;
    const path2 = (c) => {
        c.rect(leg2X, topY, legWidth, legHeight);
    };
    drawOutline(ctx, path2, false);
}


// --- Main Initialization and Event Handlers ---

/**
 * Resizes the canvas to its container's aspect-square dimensions.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
function resizeCanvas(canvas) {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = size;
    canvas.height = size;
    return size;
}

/**
 * Redraws all anatomical diagrams.
 */
function redrawAll() {
    const canvases = [
        { id: 'canvas-lungs', draw: drawLungs },
        { id: 'canvas-abdomen', draw: drawAbdomen },
        { id: 'canvas-legs', draw: drawLegs }
    ];

    canvases.forEach(({ id, draw }) => {
        const canvas = document.getElementById(id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const size = resizeCanvas(canvas);
            draw(ctx, size, size);
        }
    });
}

/**
 * Handles the AI summarization process.
 */
async function handleSummarization() {
    const notesInput = document.getElementById('current-notes');
    const summaryOutput = document.getElementById('summary-output');
    const summarizeBtn = document.getElementById('summarize-btn');
    
    const notes = notesInput.value.trim();

    if (!notes) {
        summaryOutput.innerHTML = '<p class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">Please enter clinical notes before generating a summary.</p>';
        return;
    }

    summarizeBtn.disabled = true;
    summarizeBtn.textContent = 'Generating Summary...';
    summaryOutput.innerHTML = '<p class="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">Processing notes with AI...</p>';

    const systemPrompt = `You are a highly experienced clinician. Review the patient's daily clinical notes provided. Based ONLY on the input, generate a concise, professional, single-paragraph summary suitable for a handover or senior review. Focus on key progress, concerns, and status changes.`;
    
    const userQuery = `Summarize the following clinical notes in a single paragraph, focusing on patient status and progress:\n\n---\n${notes}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    const maxRetries = 3;
    let response;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                break; // Success!
            }
            
            // Wait with exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));

        } catch (error) {
            console.error(`Attempt ${attempt + 1}: Fetch failed`, error);
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }

    summarizeBtn.disabled = false;
    summarizeBtn.textContent = 'Generate/Refresh AI Summary';

    if (!response || !response.ok) {
        summaryOutput.innerHTML = '<p class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">Error: Could not connect to AI service or response failed.</p>';
        return;
    }

    try {
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            summaryOutput.innerHTML = `
                <h3 class="text-lg font-medium text-gray-800 mt-4">AI Clinical Summary:</h3>
                <p class="mt-2 p-3 bg-green-50 text-green-800 rounded-md whitespace-pre-wrap">${text}</p>
            `;
        } else {
             summaryOutput.innerHTML = '<p class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">Error: AI returned an empty or invalid summary.</p>';
        }
    } catch (e) {
        console.error("Error parsing AI response:", e);
        summaryOutput.innerHTML = '<p class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">Error: Failed to parse AI response.</p>';
    }
}

/**
 * Sets the current timestamp.
 */
function setTimestamp() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    document.getElementById('timestamp-output').textContent = `Documented on: ${now.toLocaleTimeString('en-US', options)}`;
}

// Initial setup on load
window.onload = function() {
    setTimestamp();
    redrawAll();

    // Event listeners
    document.getElementById('summarize-btn').addEventListener('click', handleSummarization);
    window.addEventListener('resize', redrawAll);
};
