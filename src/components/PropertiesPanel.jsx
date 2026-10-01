import React, { useEffect, useRef, useState } from 'react'
import './PropertiesPanel.css'

const readValue = (event) => event.detail?.value ?? event.target?.value ?? ''

const PropertiesPanel = ({ element, onUpdateElement }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [positionDrafts, setPositionDrafts] = useState({ left: '', top: '' })
  const toggleRef = useRef(null)
  const firstInputRef = useRef(null)

  useEffect(() => {
    setIsOpen(false)
    if (element) {
      setPositionDrafts({
        left: String(element.style?.left ?? ''),
        top: String(element.style?.top ?? '')
      })
    }
  }, [element?.id])

  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus()
    }
  }, [isOpen])

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
    const rawValue = String(readValue(event))
    setPositionDrafts(currentDrafts => ({
      ...currentDrafts,
      [property]: rawValue
    }))
    if (rawValue === '') {
      return
    }

    const numericValue = Number(rawValue)
    if (Number.isFinite(numericValue) && numericValue >= 0) {
      onUpdateElement(element.id, {
        style: {
          ...element.style,
          [property]: numericValue
        }
      })
    }
  }

  const restorePosition = (property) => {
    const rawValue = positionDrafts[property]
    const numericValue = Number(rawValue)
    if (rawValue === '' || !Number.isFinite(numericValue) || numericValue < 0) {
      setPositionDrafts(currentDrafts => ({
        ...currentDrafts,
        [property]: String(element.style?.[property] ?? '')
      }))
    }
  }

  const closePopover = () => {
    setIsOpen(false)
    requestAnimationFrame(() => toggleRef.current?.focus())
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
          ref={toggleRef}
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
          aria-modal="false"
          aria-label={`Edit ${element.type} properties`}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              closePopover()
            }
          }}
        >
          <label className="property-field">
            <span>Content</span>
            <input
              ref={firstInputRef}
              type="text"
              value={element.content ?? ''}
              onChange={updateContent}
            />
          </label>
          <label className="property-field">
            <span>Left</span>
            <input
              type="number"
              min="0"
              value={positionDrafts.left}
              onChange={(event) => updatePosition('left', event)}
              onBlur={() => restorePosition('left')}
            />
          </label>
          <label className="property-field">
            <span>Top</span>
            <input
              type="number"
              min="0"
              value={positionDrafts.top}
              onChange={(event) => updatePosition('top', event)}
              onBlur={() => restorePosition('top')}
            />
          </label>
          <apux-button
            className="properties-close"
            variant="ghost"
            size="small"
            onClick={closePopover}
          >
            Close
          </apux-button>
        </div>
      )}
    </aside>
  )
}

export default PropertiesPanel
