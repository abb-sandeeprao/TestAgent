import React, { useEffect, useState } from 'react'
import './PropertiesPanel.css'

const readValue = (event) => event.detail?.value ?? event.target?.value ?? ''

const PropertiesPanel = ({ element, onUpdateElement }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [element?.id])

  if (!element) {
    return (
      <aside className="properties-panel" aria-label="Properties panel">
        <h3>Properties</h3>
        <p>Select an element to edit its properties.</p>
      </aside>
    )
  }

  const updateContent = (event) => {
    onUpdateElement(element.id, { content: String(readValue(event)) })
  }

  const updatePosition = (property, event) => {
    const rawValue = readValue(event)
    const numericValue = Number(rawValue)
    if (rawValue !== '' && Number.isFinite(numericValue)) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          [property]: numericValue
        }
      })
    }
  }

  return (
    <aside className="properties-panel" aria-label="Properties panel">
      <div className="properties-panel-header">
        <div>
          <h3>Properties</h3>
          <span className="properties-selection">{element.type} selected</span>
        </div>
        <apux-button
          className="properties-toggle"
          variant="primary"
          size="small"
          aria-expanded={isOpen}
          aria-controls="properties-popover"
          onClick={() => setIsOpen(open => !open)}
        >
          {isOpen ? 'Hide' : 'Edit'}
        </apux-button>
      </div>

      {isOpen && (
        <div
          id="properties-popover"
          className="properties-popover"
          role="dialog"
          aria-label={`Edit ${element.type} properties`}
        >
          <label className="property-field">
            <span>Content</span>
            <input
              type="text"
              value={element.content ?? ''}
              onChange={updateContent}
            />
          </label>
          <label className="property-field">
            <span>Left</span>
            <input
              type="number"
              value={Number(element.style?.left ?? 0)}
              onChange={(event) => updatePosition('left', event)}
            />
          </label>
          <label className="property-field">
            <span>Top</span>
            <input
              type="number"
              value={Number(element.style?.top ?? 0)}
              onChange={(event) => updatePosition('top', event)}
            />
          </label>
          <apux-button
            className="properties-close"
            variant="ghost"
            size="small"
            onClick={() => setIsOpen(false)}
          >
            Close
          </apux-button>
        </div>
      )}
    </aside>
  )
}

export default PropertiesPanel
