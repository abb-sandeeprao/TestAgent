import React from 'react'
import './Toolbox.css'

const Toolbox = ({ onAddElement }) => {
  const tools = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'box', label: 'Box', icon: '📦' },
  ]

  return (
    <div className="toolbox">
      <h3>Toolbox</h3>
      <div className="tool-list">
        {tools.map(tool => (
          <div 
            key={tool.type}
            className="tool-item"
            onClick={() => onAddElement(tool.type)}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Toolbox
