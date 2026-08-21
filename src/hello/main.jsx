import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './hello.css'

function HelloPage() {
  const [inputValue, setInputValue] = useState('1')

  const count = useMemo(() => {
    const parsed = Number(inputValue)
    return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0
  }, [inputValue])

  return (
    <main className="hello-page">
      <section className="hello-card">
        <h1>Hello Counter</h1>
        <label htmlFor="hello-count">How many times should Hello be printed?</label>
        <input
          id="hello-count"
          type="number"
          min="0"
          step="1"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />

        <p className="hello-summary">
          Printing "Hello" {count} {count !== 1 ? 'time' : 'times'}
        </p>

        <div className="hello-output" aria-live="polite">
          {count === 0 ? (
            <p className="hello-empty">Enter a non-negative whole number.</p>
          ) : (
            Array.from({ length: count }, (_, index) => (
              <p key={index}>Hello</p>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelloPage />
  </React.StrictMode>,
)
