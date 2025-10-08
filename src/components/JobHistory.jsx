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
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">
          📋 Job History
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-neutral-600">
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
        <h2 className="text-2xl font-bold text-neutral-800">
          📋 Job History ({filteredAndSortedJobs.length})
        </h2>
        <button
          onClick={onClearHistory}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 text-sm"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Export Tools */}
      <ExportTools jobs={filteredAndSortedJobs} />

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="margin">Margin %</option>
              <option value="name">Job Name</option>
              <option value="carrier">Carrier</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Filter by Carrier */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Carrier
            </label>
            <select
              value={filterCarrier}
              onChange={(e) => setFilterCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-neutral-700">
                Show Averages
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Averages Display */}
      {averages && (
        <div className="bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            📊 Averages ({averages.totalJobs} jobs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(averages.avgMargin)}
              </div>
              <div className="text-sm text-blue-700">
                Average Margin
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(averages.avgMarkup)}
              </div>
              <div className="text-sm text-blue-700">
                Average Markup
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(averages.avgProfit)}
              </div>
              <div className="text-sm text-blue-700">
                Average Profit
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List - Temporarily simplified for testing */}
      <div className="space-y-4">
        {filteredAndSortedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-2">
              {job.jobName || 'Unnamed Job'}
            </h3>
            <p className="text-sm text-neutral-500 mb-2">
              {formatDate(job.timestamp)}
            </p>
            {job.clientName && (
              <p className="text-sm text-neutral-600 mb-2">
                📋 {job.clientName}
              </p>
            )}
            {/* Financial Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-sm text-neutral-500">Revenue:</span>
                <span className="font-bold ml-2">${(job.retailPrice || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Job Cost:</span>
                <span className="font-bold ml-2">${(job.jobCost || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Gross Profit:</span>
                <span className="font-bold ml-2">${(job.results?.grossProfit || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Net Profit:</span>
                <span className="font-bold ml-2">${(job.results?.actualNetProfit || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Margin Analysis */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-sm text-neutral-500">Actual Margin:</span>
                <span className="font-bold ml-2 text-blue-600">{(job.results?.yourProfitMargin || 0).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Actual Markup:</span>
                <span className="font-bold ml-2 text-green-600">{(job.results?.actualMarkup || 0).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Target Margin:</span>
                <span className="font-bold ml-2">{(job.targetNetProfit || 0).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Break-Even:</span>
                <span className="font-bold ml-2">{(job.results?.divisionTotalBreakEven || 0).toFixed(2)}%</span>
              </div>
            </div>

            {/* Status and Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-sm text-neutral-500 mr-2">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  job.results?.profitabilityStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                  job.results?.profitabilityStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                  job.results?.profitabilityStatus === 'neutral' ? 'bg-gray-100 text-gray-800' :
                  job.results?.profitabilityStatus === 'thin' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {(job.results?.profitabilityStatus || 'neutral').toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Required Price:</span>
                <span className="font-bold ml-2">${(job.results?.requiredPrice || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Job Is:</span>
                <span className="font-bold ml-2">{(job.results?.thisJobIs || 0).toFixed(2)}%</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank')
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>Job Report - ${job.jobName}</title>
                        <style>
                          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
                          .header { text-align: center; border-bottom: 2px solid #249100; padding-bottom: 20px; margin-bottom: 30px; }
                          .section { margin-bottom: 30px; }
                          .row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px solid #ebe6e3; }
                          .row:last-child { border-bottom: none; }
                          .label { font-weight: bold; color: #907c6d; }
                          .value { font-family: monospace; font-weight: bold; }
                          .status-excellent { color: #249100; }
                          .status-good { color: #3b82f6; }
                          .status-neutral { color: #6b7280; }
                          .status-thin { color: #f59e0b; }
                          .status-poor { color: #ef4444; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <h1>Restoration Job Profitability Report</h1>
                          <h2>${job.jobName}</h2>
                          <p>Generated on ${new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <div class="section">
                          <h3>Job Details</h3>
                          <div class="row">
                            <span class="label">Job Name:</span>
                            <span class="value">${job.jobName}</span>
                          </div>
                          <div class="row">
                            <span class="label">Insurance Carrier:</span>
                            <span class="value">${job.clientName || 'N/A'}</span>
                          </div>
                          <div class="row">
                            <span class="label">Division:</span>
                            <span class="value">${job.division || 'N/A'}</span>
                          </div>
                          <div class="row">
                            <span class="label">Retail Price:</span>
                            <span class="value">$${(job.retailPrice || 0).toLocaleString()}</span>
                          </div>
                          <div class="row">
                            <span class="label">Job Cost:</span>
                            <span class="value">$${(job.jobCost || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div class="section">
                          <h3>Profitability Results</h3>
                          <div class="row">
                            <span class="label">Status:</span>
                            <span class="value status-${job.results?.profitabilityStatus || 'neutral'}">${(job.results?.profitabilityStatus || 'neutral').toUpperCase()}</span>
                          </div>
                          <div class="row">
                            <span class="label">Gross Profit:</span>
                            <span class="value">$${(job.results?.grossProfit || 0).toLocaleString()}</span>
                          </div>
                          <div class="row">
                            <span class="label">Actual Net Profit:</span>
                            <span class="value">$${(job.results?.actualNetProfit || 0).toLocaleString()}</span>
                          </div>
                          <div class="row">
                            <span class="label">Actual Margin:</span>
                            <span class="value">${(job.results?.yourProfitMargin || 0).toFixed(2)}%</span>
                          </div>
                          <div class="row">
                            <span class="label">Actual Markup:</span>
                            <span class="value">${(job.results?.actualMarkup || 0).toFixed(2)}%</span>
                          </div>
                          <div class="row">
                            <span class="label">Target Margin:</span>
                            <span class="value">${(job.targetNetProfit || 0).toFixed(2)}%</span>
                          </div>
                          <div class="row">
                            <span class="label">Break-Even %:</span>
                            <span class="value">${(job.results?.divisionTotalBreakEven || 0).toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        <div class="section">
                          <h3>Financial Impact</h3>
                          <div class="row">
                            <span class="label">Required Price:</span>
                            <span class="value">$${(job.results?.requiredPrice || 0).toLocaleString()}</span>
                          </div>
                          <div class="row">
                            <span class="label">Your Job Is:</span>
                            <span class="value">${(job.results?.thisJobIs || 0).toFixed(2)}%</span>
                          </div>
                          <div class="row">
                            <span class="label">Which Is:</span>
                            <span class="value">$${(job.results?.yourJob || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </body>
                    </html>
                  `)
                  printWindow.document.close()
                  printWindow.focus()
                  printWindow.print()
                }}
                className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-sm"
              >
                🖨️ Print
              </button>
              <button
                onClick={() => onDeleteJob(job.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredAndSortedJobs.length === 0 && jobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-neutral-600">
            No jobs match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default JobHistory 