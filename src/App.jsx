import React, { useState } from 'react'
import Toolbox from './components/Toolbox'
import Editor from './components/Editor'
import PropertiesPanel from './components/PropertiesPanel'
import './App.css'

function App() {
  const [elements, setElements] = useState([])
  const [nextId, setNextId] = useState(1)
  const [selectedId, setSelectedId] = useState(null)

  const addElement = (type) => {
    const newElement = {
      id: `element-${nextId}`,
      type: type,
      content: `New ${type}`,
      style: {
        position: 'absolute',
        left: 50,
        top: 50 + (elements.length * 20),
      }
    }
    setElements([...elements, newElement])
    setNextId(nextId + 1)
  }

  const updateElement = (id, updates) => {
    setElements(currentElements => currentElements.map(el =>
      el.id === id
        ? {
            ...el,
            ...updates,
            ...(updates.style ? { style: { ...el.style, ...updates.style } } : {})
          }
        : el
    ))
  }

  const deleteElement = (id) => {
    setElements(currentElements => currentElements.filter(el => el.id !== id))
    setSelectedId(currentSelectedId => currentSelectedId === id ? null : currentSelectedId)
  }

  const selectedElement = elements.find(element => element.id === selectedId)

  return (
    <div className="app">
      <Toolbox onAddElement={addElement} />
      <Editor 
        elements={elements}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
        selectedElementId={selectedId}
        onSelectElement={setSelectedId}
      />
      <PropertiesPanel
        key={selectedElement?.id ?? 'no-selection'}
        element={selectedElement}
        onUpdateElement={updateElement}
      />
    </div>
  )
}

export default App
