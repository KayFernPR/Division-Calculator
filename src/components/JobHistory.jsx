import { useState, useMemo } from 'react'
import JobCard from './JobCard'
import ExportTools from './ExportTools'

const JobHistory = ({ jobs, onDeleteJob, onClearHistory }) => {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterCarrier, setFilterCarrier] = useState('')
  const [showAverages, setShowAverages] = useState(false)

  console.log('JobHistory component rendered with jobs:', jobs)

  // Simple test render to see if component loads at all
  return (
    <div className="p-6 bg-red-100 border-2 border-red-500 rounded-lg">
      <h2 className="text-2xl font-bold text-red-800 mb-4">
        🚨 JobHistory Component Test
        </h2>
      <p className="text-red-700 mb-2">Jobs count: {jobs.length}</p>
      <p className="text-red-700 mb-2">Jobs data: {JSON.stringify(jobs, null, 2)}</p>
      <p className="text-red-700">If you can see this, the component is rendering!</p>
    </div>
  )
}

export default JobHistory 