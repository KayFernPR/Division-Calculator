import { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import JobHistory from './components/JobHistory'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [jobs, setJobs] = useState([])

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
  }

  const deleteJob = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
  }

  const clearHistory = () => {
    setJobs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              💰 Profitability Calculator
            </h1>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Calculate job profitability with ease
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <div className="space-y-6">
            <Calculator onAddJob={addJob} />
          </div>

          {/* Job History Section */}
          <div className="space-y-6">
            <JobHistory 
              jobs={jobs} 
              onDeleteJob={deleteJob} 
              onClearHistory={clearHistory}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 Profitability Calculator. Built with React + Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App 