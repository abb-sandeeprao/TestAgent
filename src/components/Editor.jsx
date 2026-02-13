import React, { useState } from 'react'
import './Editor.css'

const Editor = ({ elements, onUpdateElement, onDeleteElement }) => {
  const [selectedId, setSelectedId] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e, id) => {
    if (e.target.classList.contains('delete-btn') || e.target.tagName === 'APUX-BUTTON') return
    
    const element = elements.find(el => el.id === id)
    if (!element) return

    setDraggedId(id)
    setSelectedId(id)
    
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!draggedId) return

    const editorRect = e.currentTarget.getBoundingClientRect()
    const newLeft = e.clientX - editorRect.left - dragOffset.x
    const newTop = e.clientY - editorRect.top - dragOffset.y

    onUpdateElement(draggedId, {
      style: {
        position: 'absolute',
        left: Math.max(0, newLeft),
        top: Math.max(0, newTop)
      }
    })
  }

  const handleMouseUp = () => {
    setDraggedId(null)
  }

  const handleContentChange = (id, newContent) => {
    onUpdateElement(id, { content: newContent })
  }

  const handleInputChange = (e, id) => {
    const newContent = e.target.value
    onUpdateElement(id, { content: newContent })
  }

  const renderElement = (element) => {
    const isSelected = selectedId === element.id

    return (
      <div
        key={element.id}
        className={`editor-element ${isSelected ? 'selected' : ''}`}
        style={element.style}
        onMouseDown={(e) => handleMouseDown(e, element.id)}
      >
        <apux-button 
          className="delete-btn"
          variant="ghost"
          size="extra-small"
          onClick={() => onDeleteElement(element.id)}
        >
          ×
        </apux-button>
        {element.type === 'text' && (
          <apux-input
            type="text"
            value={element.content}
            onInput={(e) => handleInputChange(e, element.id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {element.type === 'button' && (
          <apux-button variant="primary" size="medium">
            {element.content}
          </apux-button>
        )}
        {element.type === 'image' && (
          <div className="image-placeholder">{element.content}</div>
        )}
        {element.type === 'box' && (
          <div className="box-element">{element.content}</div>
        )}
      </div>
    )
  }

  return (
    <div 
      className="editor"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="editor-header">
        <h3>Editor Area</h3>
        <span className="element-count">{elements.length} element(s)</span>
      </div>
      <div className="editor-canvas">
        {elements.map(renderElement)}
      </div>
    </div>
  )
}

export default Editor
