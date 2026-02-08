import React, { useState } from 'react'
import Toolbox from './components/Toolbox'
import Editor from './components/Editor'
import './App.css'

function App() {
  const [elements, setElements] = useState([])
  const [nextId, setNextId] = useState(1)

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
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
  }

  return (
    <div className="app">
      <Toolbox onAddElement={addElement} />
      <Editor 
        elements={elements}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />
    </div>
  )
}

export default App
