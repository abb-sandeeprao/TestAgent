import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './PropertiesPanel.css'

const readValue = (event) => event.detail?.value ?? event.target?.value ?? ''

const PropertiesPanel = ({ element, onUpdateElement }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [positionDrafts, setPositionDrafts] = useState(() => ({
    left: String(element?.style?.left ?? ''),
    top: String(element?.style?.top ?? '')
  }))
  const positionDraftsRef = useRef(positionDrafts)
  const toggleRef = useRef(null)
  const firstInputRef = useRef(null)
  const focusedPositionFields = useRef(new Set())

  const updateDrafts = (updater) => {
    const nextDrafts = typeof updater === 'function'
      ? updater(positionDraftsRef.current)
      : updater
    positionDraftsRef.current = nextDrafts
    setPositionDrafts(nextDrafts)
  }

  useLayoutEffect(() => {
    focusedPositionFields.current.clear()
    if (!element) {
      setIsOpen(false)
      return
    }

    updateDrafts({
      ...positionDraftsRef.current,
      left: String(element.style?.left ?? ''),
      top: String(element.style?.top ?? '')
    })
  }, [element?.id])

  useEffect(() => {
    if (!element) {
      return
    }

    updateDrafts(currentDrafts => {
      const nextDrafts = { ...currentDrafts }
      for (const property of ['left', 'top']) {
        if (!focusedPositionFields.current.has(property)) {
          nextDrafts[property] = String(element.style?.[property] ?? '')
        }
      }
      return nextDrafts
    })
  }, [element?.style?.left, element?.style?.top])

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
    updateDrafts(currentDrafts => ({
      ...currentDrafts,
      [property]: rawValue
    }))
    if (rawValue.trim() === '') {
      return
    }

    const numericValue = Number(rawValue)
    if (Number.isFinite(numericValue) && numericValue >= 0) {
      onUpdateElement(element.id, {
        style: {
          [property]: numericValue
        }
      })
    }
  }

  const restorePosition = (property) => {
    const rawValue = String(positionDraftsRef.current[property] ?? '').trim()
    if (rawValue !== '') {
      const numericValue = Number(rawValue)
      if (Number.isFinite(numericValue) && numericValue >= 0) {
        onUpdateElement(element.id, {
          style: {
            [property]: numericValue
          }
        })
        updateDrafts(currentDrafts => ({
          ...currentDrafts,
          [property]: String(numericValue)
        }))
        return
      }
    }

    updateDrafts(currentDrafts => ({
      ...currentDrafts,
      [property]: String(element.style?.[property] ?? '')
    }))
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
          aria-haspopup="dialog"
          aria-controls={isOpen ? 'properties-popover' : undefined}
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
          tabIndex={-1}
          aria-modal="false"
          aria-label={`Edit ${element.type} properties`}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              closePopover()
            }
          }}
        >
          <label className="property-field" htmlFor="property-content">
            <span>Content</span>
            <input
              id="property-content"
              ref={firstInputRef}
              type="text"
              value={element.content ?? ''}
              onChange={updateContent}
            />
          </label>
          <label className="property-field" htmlFor="property-left">
            <span>Left</span>
            <input
              id="property-left"
              type="number"
              min="0"
              step="any"
              value={positionDrafts.left}
              onChange={(event) => updatePosition('left', event)}
              onFocus={() => focusedPositionFields.current.add('left')}
              onBlur={() => {
                focusedPositionFields.current.delete('left')
                restorePosition('left')
              }}
            />
          </label>
          <label className="property-field" htmlFor="property-top">
            <span>Top</span>
            <input
              id="property-top"
              type="number"
              min="0"
              step="any"
              value={positionDrafts.top}
              onChange={(event) => updatePosition('top', event)}
              onFocus={() => focusedPositionFields.current.add('top')}
              onBlur={() => {
                focusedPositionFields.current.delete('top')
                restorePosition('top')
              }}
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
