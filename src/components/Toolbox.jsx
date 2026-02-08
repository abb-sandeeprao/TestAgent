import React, { useState, useEffect } from 'react'
import './Toolbox.css'

const Toolbox = ({ onAddElement }) => {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load palette configuration from JSON
    fetch('/palette-config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load configuration (${response.status})`)
        }
        return response.json()
      })
      .then(data => {
        setTools(data.palette)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading palette configuration:', error)
        setError(error.message)
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

  if (error) {
    return (
      <div className="toolbox">
        <h3>Toolbox</h3>
        <div className="toolbox-error">
          <p>Unable to load toolbox configuration.</p>
          <p className="error-detail">{error}</p>
        </div>
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
            <img 
              src={tool.icon} 
              alt={tool.description || `${tool.label} icon`} 
              className="tool-icon" 
            />
            <span className="tool-label">{tool.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Toolbox
