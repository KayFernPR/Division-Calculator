const JobCard = ({ job, onDelete, formatDate }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return '🏆'
      case 'good':
        return '🎯'
      case 'neutral':
        return '✅'
      case 'thin':
        return '⚠️'
      case 'poor':
        return '🚨'
      default:
        return '📊'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent'
      case 'good':
        return 'Good'
      case 'neutral':
        return 'Neutral'
      case 'thin':
        return 'Thin'
      case 'poor':
        return 'Poor'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'neutral':
        return 'text-gray-600'
      case 'thin':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-neutral-500'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-800">
            {job.jobName || 'Unnamed Job'}
          </h3>
          <p className="text-sm text-neutral-500">
            {formatDate(job.timestamp)}
          </p>
          {job.clientName && (
            <p className="text-sm text-neutral-600">
              📋 {job.clientName}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(job.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className={`flex items-center gap-2 ${getStatusColor(job.results?.profitabilityStatus || 'neutral')}`}>
          <span className="text-xl">{getStatusIcon(job.results?.profitabilityStatus || 'neutral')}</span>
          <span className="font-semibold">{getStatusText(job.results?.profitabilityStatus || 'neutral')}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-neutral-500">Revenue</div>
          <div className="font-bold text-lg">{formatCurrency(job.retailPrice)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-neutral-500">Cost</div>
          <div className="font-bold text-lg">{formatCurrency(job.jobCost)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-neutral-500">Margin</div>
          <div className="font-bold text-lg">{formatPercentage(job.results?.yourProfitMargin || 0)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-neutral-500">Net Profit</div>
          <div className="font-bold text-lg">{formatCurrency(job.results?.actualNetProfit || 0)}</div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b border-neutral-200 last:border-b-0">
          <span className="text-sm text-neutral-600">Target Margin:</span>
          <span className="font-mono font-semibold">{formatPercentage(job.targetNetProfit || 0)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-200 last:border-b-0">
          <span className="text-sm text-neutral-600">Actual Markup:</span>
          <span className="font-mono font-semibold">{formatPercentage(job.results?.actualMarkup || 0)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-200 last:border-b-0">
          <span className="text-sm text-neutral-600">Required Price:</span>
          <span className="font-mono font-semibold">{formatCurrency(job.results?.requiredPrice || 0)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-200 last:border-b-0">
          <span className="text-sm text-neutral-600">Margin Difference:</span>
          <span className={`font-mono font-semibold ${(job.results?.thisJobIs || 0) > 0 ? 'text-green-600' : (job.results?.thisJobIs || 0) < 0 ? 'text-red-600' : 'text-neutral-500'}`}>
            {formatPercentage(job.results?.thisJobIs || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default JobCard