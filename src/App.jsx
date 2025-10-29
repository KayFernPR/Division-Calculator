import { useState } from 'react'
import Calculator from './components/Calculator'
import MarginMarkupTable from './components/MarginMarkupTable'
import MobileEnhancements from './components/MobileEnhancements'

function App() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: '🔢' },
    { id: 'reference', label: 'Reference', icon: '📈' }
  ]

  // Error boundary component
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <img src="/logo.svg" alt="Brand Logo" className="h-16 w-auto"
                 onError={(e) => { if (e.currentTarget.getAttribute('data-fallback') !== 'png') { e.currentTarget.setAttribute('data-fallback','png'); e.currentTarget.src = '/logo.png'; } else { e.currentTarget.style.display='none'; } }} />
          </div>
        </header>

        {/* Main Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Profitability Calculator: Restoration Job by Division
          </h1>
          <p className="text-lg text-neutral-600">
            Calculate job profitability, track margins, and visualize trends for restoration contractors
          </p>
        </div>

        {/* Tab Navigation - Positioned below title and subtitle */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                <span className="mr-2 flex items-center justify-center w-5 h-5">
                  <span className="text-lg">{tab.icon}</span>
                </span>
                <span style={{color: '#1F1F1F'}}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <Calculator />
          )}

          {/* Reference Tab */}
          {activeTab === 'reference' && (
            <MarginMarkupTable />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-neutral-200">
          <p style={{color: '#1F1F1F'}}>
            © 2025 Restoration Profitability Calculator
          </p>
          <p className="text-sm mt-2" style={{color: '#1F1F1F'}}>
            Designed specifically for restoration contractors
          </p>
        </footer>
      </div>
      
      {/* Mobile Enhancements */}
      <MobileEnhancements />
    </div>
  )
}

export default App