# React Editor Application

A modern, interactive ReactJS editor application featuring a toolbox and an editor area where you can add, edit, move, and delete various UI elements.

## Features

- **Dynamic Toolbox Panel**: Loaded from JSON configuration
  - Text - Add editable text fields
  - Button - Add interactive buttons
  - Image - Add image placeholders
  - Box - Add container boxes
  - Icons loaded from SVG files
  - Fully customizable via `public/palette-config.json`

- **Editor Area**: Interactive canvas where you can:
  - Add elements by clicking tools in the toolbox
  - Move elements by dragging them around
  - Edit text content in real-time
  - Delete elements with the × button
  - Visual feedback with grid background
  - Selection highlighting

## Configuration

The toolbox is dynamically populated from `public/palette-config.json`. You can customize the available tools by editing this file:

```json
{
  "palette": [
    {
      "type": "text",
      "label": "Text",
      "icon": "/icons/text.svg",
      "description": "Add text element"
    }
  ]
}
```

Each tool requires:
- `type`: Unique identifier for the element type
- `label`: Display name in the toolbox
- `icon`: Path to the icon file (SVG recommended)
- `description`: Tooltip text (optional)

## Screenshots

### Dynamic Toolbox with Icon Images
![Dynamic Toolbox](https://github.com/user-attachments/assets/d5fa143e-b1d9-41e3-ba1b-7f68ed82debe)

### With Elements
![With Elements](https://github.com/user-attachments/assets/add26c24-ab76-4917-b0b6-7b8a8c9fe490)

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

### Development Mode
Start the development server:
```bash
npm run dev
```

Then open your browser to `http://localhost:5173/`

### Build for Production
Build the application for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
TestAgent/
├── public/
│   ├── palette-config.json    # Toolbox configuration
│   └── icons/                 # Icon files for tools
│       ├── text.svg
│       ├── button.svg
│       ├── image.svg
│       └── box.svg
├── src/
│   ├── components/
│   │   ├── Toolbox.jsx       # Dynamic toolbox component
│   │   ├── Toolbox.css        # Toolbox styles
│   │   ├── Editor.jsx         # Editor area component
│   │   └── Editor.css         # Editor styles
│   ├── App.jsx                # Main application component
│   ├── App.css                # App styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Project dependencies
```

## Technologies Used

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **CSS3** - Styling

## How to Use the Editor

1. **Add Elements**: Click on any tool in the toolbox to add it to the editor area
2. **Move Elements**: Click and drag any element to reposition it
3. **Edit Text**: Click on text inputs to edit their content
4. **Delete Elements**: Click the red × button on any element to remove it
5. **Select Elements**: Click on any element to select it (green border)

## License

ISC