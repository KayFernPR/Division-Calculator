import { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import JobHistory from './components/JobHistory'
import MarginMarkupTable from './components/MarginMarkupTable'
import ProfitChart from './components/ProfitChart'
import MobileEnhancements from './components/MobileEnhancements'

function App() {
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('calculator')
  const [error, setError] = useState(null)


  // Load jobs from localStorage
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem('profitabilityJobs')
      if (savedJobs) {
        setJobs(JSON.parse(savedJobs))
      }
    } catch (err) {
      console.error('Error loading jobs:', err)
    }
  }, [])


  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    try {
      localStorage.setItem('profitabilityJobs', JSON.stringify(jobs))
    } catch (err) {
      console.error('Error saving jobs:', err)
    }
  }, [jobs])

  const addJob = (jobData) => {
    try {
      console.log('addJob function called with:', jobData)
      const newJob = {
        id: Date.now(),
        ...jobData,
        timestamp: new Date().toISOString()
      }
      console.log('Created new job:', newJob)
      setJobs(prevJobs => [newJob, ...prevJobs])
      
      // Auto-scroll to results after saving
      setTimeout(() => {
        console.log('Switching to history tab')
        setActiveTab('history')
      }, 500)
    } catch (error) {
      console.error('Error in addJob function:', error)
      setError('Failed to save job. Please try again.')
    }
  }

  const deleteJob = (jobId) => {
    try {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Error deleting job:', error)
      setError('Failed to delete job. Please try again.')
    }
  }

  const clearHistory = () => {
    try {
      setJobs([])
    } catch (error) {
      console.error('Error clearing history:', error)
      setError('Failed to clear history. Please try again.')
    }
  }

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: '🔢' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'chart', label: 'Charts', icon: '📊' },
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
            Restoration Division: Profitability Calculator
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
            <Calculator onAddJob={addJob} />
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                <p className="text-sm">Debug: Jobs count: {jobs.length}</p>
                <p className="text-sm">Debug: Active tab: {activeTab}</p>
                {jobs.length > 0 && (
                  <p className="text-sm">Debug: First job: {JSON.stringify(jobs[0], null, 2)}</p>
                )}
              </div>
              <JobHistory 
                jobs={jobs} 
                onDeleteJob={deleteJob} 
                onClearHistory={clearHistory}
              />
            </div>
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
        <footer className="text-center mt-12 pt-8 border-t border-neutral-200">
          <p style={{color: '#1F1F1F'}}>
            © 2024 Restoration Profitability Calculator. Built with React + Tailwind CSS
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