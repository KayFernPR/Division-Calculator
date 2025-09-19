import { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import JobHistory from './components/JobHistory'
import MarginMarkupTable from './components/MarginMarkupTable'
import ProfitChart from './components/ProfitChart'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('calculator')

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Load jobs from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem('profitabilityJobs')
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs))
    }
  }, [])

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem('profitabilityJobs', JSON.stringify(jobs))
  }, [jobs])

  const addJob = (jobData) => {
    const newJob = {
      id: Date.now(),
      ...jobData,
      timestamp: new Date().toISOString()
    }
    setJobs(prevJobs => [newJob, ...prevJobs])
    
    // Auto-scroll to results after saving
    setTimeout(() => {
      setActiveTab('history')
    }, 500)
  }

  const deleteJob = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
  }

  const clearHistory = () => {
    setJobs([])
  }

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: '🧮', iconSrc: '/calculator.svg' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'chart', label: 'Charts', icon: '📈' },
    { id: 'reference', label: 'Reference', icon: '📊' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-3 font-header">
              <img src="/logo.svg" alt="Brand Logo" className="h-10 w-10"
                   onError={(e) => { if (e.currentTarget.getAttribute('data-fallback') !== 'png') { e.currentTarget.setAttribute('data-fallback','png'); e.currentTarget.src = '/logo.png'; } else { e.currentTarget.style.display='none'; } }} />
              Restoration Profitability Calculator
            </h1>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Calculate job profitability, track margins, and visualize trends for restoration contractors
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                }`}
              >
                <span className="mr-2 flex items-center">
                  {tab.iconSrc ? (
                    <img src={tab.iconSrc} alt="icon" className="w-5 h-5" onError={(e) => { const triedPng = e.currentTarget.getAttribute('data-fallback') === 'png'; if (!triedPng) { e.currentTarget.setAttribute('data-fallback','png'); e.currentTarget.src = '/calculator.png'; } else { e.currentTarget.style.display='none'; } }} />
                  ) : (
                    <span>{tab.icon}</span>
                  )}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Calculator onAddJob={addJob} />
              <div className="space-y-6">
                <div className="card bg-primary-50 dark:bg-primary-900/20">
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 font-subheader">
                    💡 Quick Tips
                  </h3>
                  <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-2">
                    <li>• Set your company's break-even percentage first</li>
                    <li>• Target margins should be above break-even</li>
                    <li>• Use the reference table to convert margin to markup</li>
                    <li>• Save jobs to track trends over time</li>
                    <li>• Print reports for client presentations</li>
                  </ul>
                </div>
                
                <div className="card bg-neutral-50 dark:bg-neutral-800">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3 font-subheader">
                    📊 Status Indicators
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <span className="text-neutral-700 dark:text-neutral-300">Jackpot! — At/above target and overhead covered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      <span className="text-neutral-700 dark:text-neutral-300">Warning! — Below target but ≥ break-even and overhead covered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧊</span>
                      <span className="text-neutral-700 dark:text-neutral-300">On Thin Ice — Below break-even or overhead not covered (margin ≥ 0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⛔</span>
                      <span className="text-neutral-700 dark:text-neutral-300">No Bueno — Negative margin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <JobHistory 
              jobs={jobs} 
              onDeleteJob={deleteJob} 
              onClearHistory={clearHistory}
            />
          )}

          {/* Chart Tab */}
          {activeTab === 'chart' && (
            <ProfitChart jobs={jobs} />
          )}

          {/* Reference Tab */}
          {activeTab === 'reference' && (
            <MarginMarkupTable />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-600 dark:text-neutral-400">
            © 2024 Restoration Profitability Calculator. Built with React + Tailwind CSS
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
            Designed specifically for restoration contractors
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App 