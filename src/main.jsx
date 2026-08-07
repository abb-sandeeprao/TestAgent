import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    (
    ["Hi", "Hello", "Welcome", "to", "the", "Graphics", "Editor"].map(word => <span style={{ width: '50px', height: '50px', border: '1px solid black' }}>{word}</span>)
    )
  </React.StrictMode>,
)

