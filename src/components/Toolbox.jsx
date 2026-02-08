import React, { useState, useEffect } from 'react'
import './Toolbox.css'

const Toolbox = ({ onAddElement }) => {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load palette configuration from JSON
    fetch('/palette-config.json')
      .then(response => response.json())
      .then(data => {
        setTools(data.palette)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading palette configuration:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="toolbox">
        <h3>Toolbox</h3>
        <div className="toolbox-loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="toolbox">
      <h3>Toolbox</h3>
      <div className="tool-list">
        {tools.map(tool => (
          <div 
            key={tool.type}
            className="tool-item"
            onClick={() => onAddElement(tool.type)}
            title={tool.description}
          >
            <img src={tool.icon} alt={tool.label} className="tool-icon" />
            <span className="tool-label">{tool.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Toolbox
