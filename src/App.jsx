import { useState, useEffect } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-center mb-6">
            <h1 className="text-4xl font-bold font-header text-center whitespace-nowrap" style={{color: '#1F1F1F'}}>
              Restoration Division: Profitability Calculator
            </h1>
          </div>
          <p className="text-lg text-center" style={{color: '#1F1F1F'}}>
            Calculate job profitability, track margins, and visualize trends for restoration contractors
          </p>
        </header>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#1F1F1F'}}>
            Calculator is loading...
          </h2>
          <p style={{color: '#1F1F1F'}}>
            If you see this message, the basic app is working. The full calculator will be restored shortly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App