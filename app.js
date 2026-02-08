// Initialize FabricJS canvas
let canvas;

// Initialize the canvas when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create FabricJS canvas
    canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
    });
    
    // Get DOM elements
    const addRectangleBtn = document.getElementById('addRectangle');
    const addCircleBtn = document.getElementById('addCircle');
    const addTriangleBtn = document.getElementById('addTriangle');
    const addLineBtn = document.getElementById('addLine');
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const clearCanvasBtn = document.getElementById('clearCanvas');
    const exportSVGBtn = document.getElementById('exportSVG');
    const exportJSONBtn = document.getElementById('exportJSON');
    const fillColorInput = document.getElementById('fillColor');
    const strokeColorInput = document.getElementById('strokeColor');
    const strokeWidthInput = document.getElementById('strokeWidth');
    const outputDiv = document.getElementById('output');
    
    // Function to get current style settings
    function getCurrentStyles() {
        return {
            fill: fillColorInput.value,
            stroke: strokeColorInput.value,
            strokeWidth: parseInt(strokeWidthInput.value)
        };
    }
    
    // Add Rectangle
    addRectangleBtn.addEventListener('click', function() {
        const styles = getCurrentStyles();
        const rect = new fabric.Rect({
            left: Math.random() * 300 + 100,
            top: Math.random() * 200 + 100,
            width: 150,
            height: 100,
            fill: styles.fill,
            stroke: styles.stroke,
            strokeWidth: styles.strokeWidth
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
    });
    
    // Add Circle
    addCircleBtn.addEventListener('click', function() {
        const styles = getCurrentStyles();
        const circle = new fabric.Circle({
            left: Math.random() * 300 + 100,
            top: Math.random() * 200 + 100,
            radius: 60,
            fill: styles.fill,
            stroke: styles.stroke,
            strokeWidth: styles.strokeWidth
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    });
    
    // Add Triangle
    addTriangleBtn.addEventListener('click', function() {
        const styles = getCurrentStyles();
        const triangle = new fabric.Triangle({
            left: Math.random() * 300 + 100,
            top: Math.random() * 200 + 100,
            width: 120,
            height: 120,
            fill: styles.fill,
            stroke: styles.stroke,
            strokeWidth: styles.strokeWidth
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
        canvas.renderAll();
    });
    
    // Add Line
    addLineBtn.addEventListener('click', function() {
        const styles = getCurrentStyles();
        const line = new fabric.Line(
            [50, 50, 200, 150],
            {
                left: Math.random() * 300 + 100,
                top: Math.random() * 200 + 100,
                stroke: styles.stroke,
                strokeWidth: styles.strokeWidth
            }
        );
        canvas.add(line);
        canvas.setActiveObject(line);
        canvas.renderAll();
    });
    
    // Delete selected object
    deleteSelectedBtn.addEventListener('click', function() {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
            activeObjects.forEach(obj => {
                canvas.remove(obj);
            });
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    });
    
    // Clear entire canvas
    clearCanvasBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the entire canvas?')) {
            canvas.clear();
            canvas.backgroundColor = '#ffffff';
            canvas.renderAll();
        }
    });
    
    // Export as SVG
    exportSVGBtn.addEventListener('click', function() {
        const svg = canvas.toSVG();
        outputDiv.innerHTML = '<h4>SVG Export:</h4>' + escapeHtml(svg);
        outputDiv.classList.add('active');
        
        // Also download the SVG file
        downloadFile(svg, 'canvas-export.svg', 'image/svg+xml');
    });
    
    // Export as JSON
    exportJSONBtn.addEventListener('click', function() {
        const json = JSON.stringify(canvas.toJSON(), null, 2);
        outputDiv.innerHTML = '<h4>JSON Export:</h4>' + json;
        outputDiv.classList.add('active');
        
        // Also download the JSON file
        downloadFile(json, 'canvas-export.json', 'application/json');
    });
    
    // Update selected object properties when color/stroke changes
    fillColorInput.addEventListener('change', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('fill', this.value);
            canvas.renderAll();
        }
    });
    
    strokeColorInput.addEventListener('change', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('stroke', this.value);
            canvas.renderAll();
        }
    });
    
    strokeWidthInput.addEventListener('change', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('strokeWidth', parseInt(this.value));
            canvas.renderAll();
        }
    });
    
    // Update color inputs when object is selected
    canvas.on('selection:created', updatePropertyInputs);
    canvas.on('selection:updated', updatePropertyInputs);
    
    function updatePropertyInputs() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (activeObject.fill) {
                fillColorInput.value = activeObject.fill;
            }
            if (activeObject.stroke) {
                strokeColorInput.value = activeObject.stroke;
            }
            if (activeObject.strokeWidth) {
                strokeWidthInput.value = activeObject.strokeWidth;
            }
        }
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Helper function to download file
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
});
