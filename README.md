# TestAgent - FabricJS Drawing Application

A web application with FabricJS capability to draw and manipulate shapes and render SVG elements.

## Features

- **Draw Shapes**: Add rectangles, circles, triangles, and lines to the canvas
- **Manipulate Objects**: Move, resize, rotate, and modify shapes interactively
- **Customization**: Change fill color, stroke color, and stroke width
- **Export Functionality**: Export your canvas as SVG or JSON format
- **Object Management**: Delete selected objects or clear the entire canvas

## Installation

1. Clone the repository:
```bash
git clone https://github.com/abb-sandeeprao/TestAgent.git
cd TestAgent
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the local server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:8080
```

## How to Use

### Adding Shapes
- Click on any shape button (Rectangle, Circle, Triangle, Line) to add shapes to the canvas
- Each new shape will be added at a random position with the current color settings

### Manipulating Shapes
- Click on any shape to select it
- Drag to move the shape
- Use corner handles to resize
- Use the rotation handle at the top to rotate
- Hold Shift while dragging corner handles to maintain aspect ratio

### Customizing Properties
- Use the color pickers to change fill and stroke colors
- Adjust stroke width using the number input
- Changes apply to newly created shapes or selected shapes

### Canvas Actions
- **Delete Selected**: Remove the currently selected shape(s)
- **Clear Canvas**: Remove all shapes from the canvas
- **Export as SVG**: Download the canvas as an SVG file
- **Export as JSON**: Download the canvas state as a JSON file

## Technologies Used

- [FabricJS](http://fabricjs.com/) v5.3.0 - Canvas manipulation library
- HTML5 Canvas
- Vanilla JavaScript
- CSS3

## License

MIT