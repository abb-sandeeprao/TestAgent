import React, { useRef, useState } from 'react'
import './Editor.css'

const Editor = ({
  elements,
  onUpdateElement,
  onDeleteElement,
  selectedElementId,
  onSelectElement
}) => {
  const [draggedId, setDraggedId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const editorRef = useRef(null)

  const handleMouseDown = (e, id) => {
    // Prevent dragging if clicking on delete button or any button within the element
    if (e.target.closest('.delete-btn') || (e.target.tagName === 'APUX-BUTTON' && e.target.classList.contains('delete-btn'))) {
      return
    }
    
    const element = elements.find(el => el.id === id)
    if (!element) return

    setDraggedId(id)
    onSelectElement(id)
    
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

  const handleInputChange = (e, id) => {
    // Support both synthetic events (e.target.value) and custom events (e.detail.value)
    const newContent = e.target.value !== undefined ? e.target.value : e.detail?.value
    if (newContent !== undefined) {
      onUpdateElement(id, { content: newContent })
    }
  }

  const handleDelete = (id) => {
    onDeleteElement(id)
    requestAnimationFrame(() => editorRef.current?.focus())
  }

  const renderElement = (element) => {
    const isSelected = selectedElementId === element.id

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
          aria-label={`Delete ${element.type} element`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => handleDelete(element.id)}
        >
          ×
        </apux-button>
        {element.type === 'text' && (
          <apux-input
            type="text"
            value={element.content}
            onInput={(e) => handleInputChange(e, element.id)}
            onMouseDown={(e) => e.stopPropagation()}
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
      ref={editorRef}
      tabIndex={-1}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="editor-header">
        <h3>Editor Area</h3>
        <span className="element-count">{elements.length} element(s)</span>
      </div>
      <div
        className="editor-canvas"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onSelectElement(null)
          }
        }}
      >
        {elements.map(renderElement)}
      </div>
    </div>
  )
}

export default Editor
