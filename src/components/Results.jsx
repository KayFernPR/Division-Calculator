import { useState, useRef, useEffect } from 'react'

const Results = ({ results = {} }) => {
  const [showStatusHelp, setShowStatusHelp] = useState(false)
  const statusHelpRef = useRef(null)

  // Don't render if no results yet
  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4 font-title" style={{color: '#1F1F1F'}}>
          📈 Results
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
          Enter job details to see results
        </p>
      </div>
    )
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusHelpRef.current && !statusHelpRef.current.contains(event.target)) {
        setShowStatusHelp(false)
      }
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowStatusHelp(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'jackpot':
        return '🏆'
      case 'warning':
        return '⚠️'
      case 'thin':
        return '🧊'
      case 'no-bueno':
        return '⛔'
      default:
        return '📊'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'jackpot':
        return "Jackpot!"
      case 'warning':
        return 'Warning!'
      case 'thin':
        return 'On Thin Ice'
      case 'no-bueno':
        return 'No Bueno - Game Over'
      default:
        return 'Calculating'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'jackpot':
        return 'text-success-600 dark:text-success-400'
      case 'warning':
        return 'text-warning-600 dark:text-warning-400'
      case 'thin':
        return 'text-orange-600 dark:text-orange-400'
      case 'no-bueno':
        return 'text-danger-600 dark:text-danger-400'
      default:
        return 'text-neutral-500 dark:text-neutral-400'
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 font-title" style={{color: '#1F1F1F'}}>
        📈 Results
      </h3>
      
      <div className="space-y-3">
        {/* Profitability Status */}
        <div className="result-item bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
              <span>Profitability Status:</span>
              <div className="relative group select-none" ref={statusHelpRef}>
                <button
                  type="button"
                  onClick={() => setShowStatusHelp(prev => !prev)}
                  aria-expanded={showStatusHelp}
                  aria-controls="status-help-tooltip"
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                  title="How status is determined"
                >
                  i
                </button>
                <div
                  id="status-help-tooltip"
                  className={`absolute z-10 ${showStatusHelp ? 'block' : 'hidden'} md:group-hover:block top-6 left-0 w-72 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700`}
                >
                  <p className="mb-1"><strong>Break-even %</strong>: Your company threshold entered above. If actual margin is below this, you are below company break-even.</p>
                  <p className="mb-1"><strong>Overhead coverage</strong>: Gross Profit ($) must be ≥ Overhead Cost ($) entered above.</p>
                  <p className="mt-1"><strong>Statuses</strong>: Jackpot (≥ target and covers overhead), Warning (below target but ≥ break-even and covers overhead), On Thin Ice (margin ≥ 0 but below break-even or overhead not covered), No Bueno (negative margin).</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStatusIcon(results.profitabilityStatus)}</span>
              <span className={`font-bold ${getStatusColor(results.profitabilityStatus)}`}>
                {getStatusText(results.profitabilityStatus)}
              </span>
            </div>
          </div>
          {results.profitabilityStatus === 'thin' && !results.coversOverhead && (
            <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
              Overhead not covered by current gross profit.
            </p>
          )}
        </div>
        
        <div className="result-item">
          <span className="text-neutral-700 dark:text-neutral-300">Actual Margin:</span>
          <span className={`result-value ${getStatusColor(results.profitabilityStatus)}`}>
            {formatPercentage(results.actualMargin)}
          </span>
        </div>
        
        <div className="result-item">
          <span className="text-neutral-700 dark:text-neutral-300">Actual Markup:</span>
          <span className="result-value">
            {formatPercentage(results.actualMarkup)}
          </span>
        </div>

        <div className="result-item">
          <span className="text-neutral-700 dark:text-neutral-300">Gross Profit ($):</span>
          <span className="result-value">
            {formatCurrency(results.grossProfit)}
          </span>
        </div>
        
        <div className="result-item">
          <span className="text-neutral-700 dark:text-neutral-300">Required Price:</span>
          <span className="result-value">
            {formatCurrency(results.requiredPrice)}
          </span>
        </div>
        
        <div className="result-item">
          <span className="text-neutral-700 dark:text-neutral-300">Required Markup:</span>
          <span className="result-value">
            {formatPercentage(results.requiredMarkup)}
          </span>
        </div>
        
        {results.profitShortfall > 0 && (
          <>
            <div className="result-item">
              <span className="text-neutral-700 dark:text-neutral-300">Profit Shortfall:</span>
              <span className="result-value text-danger-600 dark:text-danger-400">
                {formatCurrency(results.profitShortfall)}
              </span>
            </div>
            
            <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-warning-800 dark:text-warning-200">Impact to Business:</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-warning-700 dark:text-warning-300">Revenue needed at 10% margin:</span>
                  <span className="font-mono font-semibold text-warning-800 dark:text-warning-200">
                    {formatCurrency(results.revenueNeeded10Percent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning-700 dark:text-warning-300">Revenue needed at current margin:</span>
                  <span className="font-mono font-semibold text-warning-800 dark:text-warning-200">
                    {formatCurrency(results.revenueNeededCurrent)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Results
