const JobCard = ({ job, onDelete, formatDate }) => {
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
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'danger':
        return '❌'
      default:
        return '📊'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'On Target'
      case 'warning':
        return 'Warning'
      case 'danger':
        return 'No Bueno'
      default:
        return 'Calculating'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success-600 dark:text-success-400'
      case 'warning':
        return 'text-warning-600 dark:text-warning-400'
      case 'danger':
        return 'text-danger-600 dark:text-danger-400'
      default:
        return 'text-neutral-500 dark:text-neutral-400'
    }
  }

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Report - ${job.jobName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #249100;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .job-details, .results, .impact {
              margin-bottom: 30px;
            }
            .result-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 5px 0;
              border-bottom: 1px solid #ebe6e3;
            }
            .result-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #907c6d;
            }
            .value {
              font-family: monospace;
              font-weight: bold;
            }
            .status-success { color: #249100; }
            .status-warning { color: #f59e0b; }
            .status-danger { color: #ef4444; }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #907c6d;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Restoration Job Profitability Report</h1>
            <h2>${job.jobName}</h2>
            <p>Generated on ${formatDate(job.timestamp)}</p>
          </div>
          
          <div class="job-details">
            <h3>Job Details</h3>
            <div class="result-row">
              <span class="label">Job Name:</span>
              <span class="value">${job.jobName}</span>
            </div>
            <div class="result-row">
              <span class="label">Insurance Carrier:</span>
              <span class="value">${job.insuranceCarrier || 'N/A'}</span>
            </div>
            <div class="result-row">
              <span class="label">Retail Price:</span>
              <span class="value">${formatCurrency(job.retailPrice)}</span>
            </div>
            <div class="result-row">
              <span class="label">Job Cost:</span>
              <span class="value">${formatCurrency(job.jobCost)}</span>
            </div>
            <div class="result-row">
              <span class="label">Target Margin:</span>
              <span class="value">${formatPercentage(job.targetMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Break-Even %:</span>
              <span class="value">${formatPercentage(job.breakEvenPercent)}</span>
            </div>
          </div>
          
          <div class="results">
            <h3>Profitability Results</h3>
            <div class="result-row">
              <span class="label">Status:</span>
              <span class="value status-${job.profitabilityStatus}">${getStatusText(job.profitabilityStatus)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Margin:</span>
              <span class="value status-${job.profitabilityStatus}">${formatPercentage(job.actualMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Markup:</span>
              <span class="value">${formatPercentage(job.actualMarkup)}</span>
            </div>
            <div class="result-row">
              <span class="label">Required Price:</span>
              <span class="value">${formatCurrency(job.requiredPrice)}</span>
            </div>
            <div class="result-row">
              <span class="label">Required Markup:</span>
              <span class="value">${formatPercentage(job.requiredMarkup)}</span>
            </div>
            ${job.profitShortfall > 0 ? `
            <div class="result-row">
              <span class="label">Profit Shortfall:</span>
              <span class="value status-danger">${formatCurrency(job.profitShortfall)}</span>
            </div>
            ` : ''}
          </div>
          
          ${job.profitShortfall > 0 ? `
          <div class="impact">
            <h3>Impact to Business</h3>
            <div class="result-row">
              <span class="label">Revenue needed at 10% margin:</span>
              <span class="value">${formatCurrency(job.revenueNeeded10Percent)}</span>
            </div>
            <div class="result-row">
              <span class="label">Revenue needed at current margin:</span>
              <span class="value">${formatCurrency(job.revenueNeededCurrent)}</span>
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Generated by Restoration Profitability Calculator</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <div className="card animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {job.jobName}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(job.timestamp)}
          </p>
          {job.insuranceCarrier && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              📋 {job.insuranceCarrier}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="btn btn-success text-sm"
            title="Print to PDF"
          >
            🖨️ Print
          </button>
          <button
            onClick={onDelete}
            className="btn btn-danger text-sm"
            title="Delete job"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Profitability Status */}
      <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Status:</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${getStatusColor(job.profitabilityStatus)}`}>
              {getStatusText(job.profitabilityStatus)}
            </span>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Retail Price:</span>
          <span className="font-mono font-semibold">{formatCurrency(job.retailPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Job Cost:</span>
          <span className="font-mono font-semibold">{formatCurrency(job.jobCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Target Margin:</span>
          <span className="font-mono font-semibold">{formatPercentage(job.targetMargin)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Break-Even %:</span>
          <span className="font-mono font-semibold">{formatPercentage(job.breakEvenPercent)}</span>
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
        <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Results</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Actual Margin:</span>
            <span className={`text-sm font-mono font-semibold ${getStatusColor(job.profitabilityStatus)}`}>
              {formatPercentage(job.actualMargin)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Actual Markup:</span>
            <span className="text-sm font-mono font-semibold">
              {formatPercentage(job.actualMarkup)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Required Price:</span>
            <span className="text-sm font-mono font-semibold">
              {formatCurrency(job.requiredPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Required Markup:</span>
            <span className="text-sm font-mono font-semibold">
              {formatPercentage(job.requiredMarkup)}
            </span>
          </div>
          {job.profitShortfall > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Profit Shortfall:</span>
              <span className="text-sm font-mono font-semibold text-danger-600 dark:text-danger-400">
                {formatCurrency(job.profitShortfall)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Impact to Business (if shortfall exists) */}
      {job.profitShortfall > 0 && (
        <div className="mt-4 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
          <h5 className="font-semibold text-warning-800 dark:text-warning-200 text-sm mb-2">
            Impact to Business:
          </h5>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-warning-700 dark:text-warning-300">Revenue at 10% margin:</span>
              <span className="font-mono font-semibold text-warning-800 dark:text-warning-200">
                {formatCurrency(job.revenueNeeded10Percent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-warning-700 dark:text-warning-300">Revenue at current margin:</span>
              <span className="font-mono font-semibold text-warning-800 dark:text-warning-200">
                {formatCurrency(job.revenueNeededCurrent)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobCard 