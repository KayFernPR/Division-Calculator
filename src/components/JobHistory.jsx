import { useState, useMemo } from 'react'
import JobCard from './JobCard'
import ExportTools from './ExportTools'

const JobHistory = ({ jobs, onDeleteJob, onClearHistory }) => {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterCarrier, setFilterCarrier] = useState('')
  const [showAverages, setShowAverages] = useState(false)

  console.log('JobHistory component rendered with jobs:', jobs)

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get unique carriers for filter
  const carriers = useMemo(() => {
    const uniqueCarriers = [...new Set(jobs.map(job => job.clientName).filter(Boolean))]
    return uniqueCarriers.sort()
  }, [jobs])

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs

    // Filter by carrier
    if (filterCarrier) {
      filtered = filtered.filter(job => job.clientName === filterCarrier)
    }

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
          break
        case 'margin':
          aValue = a.results?.yourProfitMargin || 0
          bValue = b.results?.yourProfitMargin || 0
          break
        case 'name':
          aValue = a.jobName.toLowerCase()
          bValue = b.jobName.toLowerCase()
          break
        case 'carrier':
          aValue = (a.clientName || '').toLowerCase()
          bValue = (b.clientName || '').toLowerCase()
          break
        default:
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [jobs, sortBy, sortOrder, filterCarrier])

  // Calculate averages
  const averages = useMemo(() => {
    if (!showAverages || filteredAndSortedJobs.length === 0) return null

    const totalMargin = filteredAndSortedJobs.reduce((sum, job) => sum + (job.results?.yourProfitMargin || 0), 0)
    const totalMarkup = filteredAndSortedJobs.reduce((sum, job) => sum + (job.results?.actualMarkup || 0), 0)
    const totalProfit = filteredAndSortedJobs.reduce((sum, job) => sum + (job.retailPrice - job.jobCost), 0)

    return {
      avgMargin: totalMargin / filteredAndSortedJobs.length,
      avgMarkup: totalMarkup / filteredAndSortedJobs.length,
      avgProfit: totalProfit / filteredAndSortedJobs.length,
      totalJobs: filteredAndSortedJobs.length
    }
  }, [filteredAndSortedJobs, showAverages])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`
  }

  if (jobs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
          📋 Job History
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-neutral-600 dark:text-neutral-400">
            No jobs saved yet. Start by calculating your first job!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          📋 Job History ({filteredAndSortedJobs.length})
        </h2>
        <button
          onClick={onClearHistory}
          className="btn btn-danger text-sm"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Export Tools */}
      <ExportTools jobs={filteredAndSortedJobs} />

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium style={{color: '#1F1F1F'}} mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date">Date</option>
              <option value="margin">Margin %</option>
              <option value="name">Job Name</option>
              <option value="carrier">Carrier</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium style={{color: '#1F1F1F'}} mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Filter by Carrier */}
          <div>
            <label className="block text-sm font-medium style={{color: '#1F1F1F'}} mb-2">
              Filter by Carrier
            </label>
            <select
              value={filterCarrier}
              onChange={(e) => setFilterCarrier(e.target.value)}
              className="input-field"
            >
              <option value="">All Carriers</option>
              {carriers.map(carrier => (
                <option key={carrier} value={carrier}>{carrier}</option>
              ))}
            </select>
          </div>

          {/* Show Averages Toggle */}
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAverages}
                onChange={(e) => setShowAverages(e.target.checked)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm style={{color: '#1F1F1F'}}">
                Show Averages
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Averages Display */}
      {averages && (
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-4">
            📊 Averages ({averages.totalJobs} jobs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(averages.avgMargin)}
              </div>
              <div className="text-sm text-primary-700 dark:text-primary-300">
                Average Margin
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(averages.avgMarkup)}
              </div>
              <div className="text-sm text-primary-700 dark:text-primary-300">
                Average Markup
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(averages.avgProfit)}
              </div>
              <div className="text-sm text-primary-700 dark:text-primary-300">
                Average Profit
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredAndSortedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={() => onDeleteJob(job.id)}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredAndSortedJobs.length === 0 && jobs.length > 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-neutral-600 dark:text-neutral-400">
            No jobs match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default JobHistory 