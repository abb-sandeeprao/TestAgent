import React, { useRef, useState } from 'react'
import Toolbox from './components/Toolbox'
import Editor from './components/Editor'
import PropertiesPanel from './components/PropertiesPanel'
import './App.css'

function App() {
  const [elements, setElements] = useState([])
  const nextIdRef = useRef(1)
  const [selectedId, setSelectedId] = useState(null)

  const addElement = (type) => {
    const id = `element-${nextIdRef.current++}`
    setElements(currentElements => [
      ...currentElements,
      {
        id,
        type,
        content: `New ${type}`,
        style: {
          position: 'absolute',
          left: 50,
          top: 50 + (currentElements.length * 20),
        }
      }
    ])
    setSelectedId(id)
  }

  const updateElement = (id, updates) => {
    const { style: styleUpdates, ...otherUpdates } = updates
    const hasStyleUpdates = Boolean(styleUpdates && Object.keys(styleUpdates).length > 0)
    setElements(currentElements => currentElements.map(el =>
      el.id === id
        ? {
            ...el,
            ...otherUpdates,
            ...(hasStyleUpdates ? { style: { ...el.style, ...styleUpdates } } : {})
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
        element={selectedElement}
        onUpdateElement={updateElement}
      />
    </div>
  )
}

export default App
