import { useState, useEffect, useRef } from 'react'

const Calculator = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    jobName: '',
    breakEvenPercent: '',
    retailPrice: '',
    jobCost: '',
    overheadCost: '',
    targetMargin: '',
    insuranceCarrier: ''
  })

  const [results, setResults] = useState({
    actualMargin: 0,
    actualMarkup: 0,
    grossProfit: 0,
    requiredPrice: 0,
    requiredMarkup: 0,
    profitShortfall: 0,
    revenueNeeded10Percent: 0,
    revenueNeededCurrent: 0,
    profitabilityStatus: 'neutral',
    coversOverhead: true
  })

  const [showStatusHelp, setShowStatusHelp] = useState(false)
  const statusHelpRef = useRef(null)

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

  const [errors, setErrors] = useState({})

  // Calculate results whenever form data changes
  useEffect(() => {
    calculateResults()
  }, [formData])

  const calculateResults = () => {
    const retailPrice = parseFloat(formData.retailPrice) || 0
    const jobCost = parseFloat(formData.jobCost) || 0
    const targetMargin = parseFloat(formData.targetMargin) || 0
    const breakEvenPercent = parseFloat(formData.breakEvenPercent) || 0
    const overheadCost = parseFloat(formData.overheadCost) || 0

    // Actual Margin = ((Retail Price - Job Cost) / Retail Price) × 100
    const actualMargin = retailPrice > 0 ? ((retailPrice - jobCost) / retailPrice) * 100 : 0

    // Actual Markup = ((Retail Price - Job Cost) / Job Cost) × 100
    const actualMarkup = jobCost > 0 ? ((retailPrice - jobCost) / jobCost) * 100 : 0

    // Gross Profit Dollars
    const grossProfit = Math.max(retailPrice - jobCost, retailPrice >= 0 && jobCost >= 0 ? retailPrice - jobCost : 0)

    // Required Retail Price to hit Target Margin = Job Cost / (1 - Target Margin)
    const requiredPrice = jobCost > 0 && targetMargin < 100 ? jobCost / (1 - targetMargin / 100) : 0

    // Required Markup = ((Required Price - Job Cost) / Job Cost) × 100
    const requiredMarkup = jobCost > 0 ? ((requiredPrice - jobCost) / jobCost) * 100 : 0

    // Profit Shortfall = Required Price - Retail Price (only if below target)
    const profitShortfall = actualMargin < targetMargin ? requiredPrice - retailPrice : 0

    // Revenue needed at 10% margin = Shortfall ÷ 0.10
    const revenueNeeded10Percent = profitShortfall > 0 ? profitShortfall / 0.10 : 0

    // Revenue needed at current margin = Shortfall ÷ (Actual Margin ÷ 100)
    const revenueNeededCurrent = profitShortfall > 0 && actualMargin > 0 ? profitShortfall / (actualMargin / 100) : 0

    // Determine profitability status
    // Jackpot! (green): at/above target and gross profit covers overhead
    // Warning! (yellow): below target but at/above break-even and covers overhead
    // On Thin Ice (orange): below break-even OR does not cover overhead, but non-negative margin
    // No Bueno - Game Over (red): negative margin
    let profitabilityStatus = 'neutral'
    const coversOverhead = overheadCost <= 0 || grossProfit >= overheadCost
    if (actualMargin >= targetMargin && coversOverhead) {
      profitabilityStatus = 'jackpot'
    } else if (actualMargin >= breakEvenPercent && coversOverhead) {
      profitabilityStatus = 'warning'
    } else if (actualMargin >= 0) {
      profitabilityStatus = 'thin'
    } else {
      profitabilityStatus = 'no-bueno'
    }

    setResults({
      actualMargin,
      actualMarkup,
      grossProfit,
      requiredPrice,
      requiredMarkup,
      profitShortfall,
      revenueNeeded10Percent,
      revenueNeededCurrent,
      profitabilityStatus,
      coversOverhead
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.jobName.trim()) {
      newErrors.jobName = 'Job name is required'
    }

    if (!formData.breakEvenPercent || parseFloat(formData.breakEvenPercent) < 0) {
      newErrors.breakEvenPercent = 'Break-even percentage must be 0 or greater'
    }

    if (!formData.retailPrice || parseFloat(formData.retailPrice) <= 0) {
      newErrors.retailPrice = 'Retail price must be greater than 0'
    }

    if (!formData.jobCost || parseFloat(formData.jobCost) < 0) {
      newErrors.jobCost = 'Job cost cannot be negative'
    }

    if (formData.overheadCost && parseFloat(formData.overheadCost) < 0) {
      newErrors.overheadCost = 'Overhead cost cannot be negative'
    }

    const retailPrice = parseFloat(formData.retailPrice) || 0
    const jobCost = parseFloat(formData.jobCost) || 0

    if (jobCost > retailPrice) {
      newErrors.jobCost = 'Job cost cannot exceed retail price'
    }

    if (formData.targetMargin && (parseFloat(formData.targetMargin) < 0 || parseFloat(formData.targetMargin) >= 100)) {
      newErrors.targetMargin = 'Target margin must be between 0 and 99.99'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onAddJob({
        ...formData,
        breakEvenPercent: parseFloat(formData.breakEvenPercent),
        retailPrice: parseFloat(formData.retailPrice),
        jobCost: parseFloat(formData.jobCost),
        targetMargin: formData.targetMargin ? parseFloat(formData.targetMargin) : null,
        ...results
      })

      // Reset form
      setFormData({
        jobName: '',
        breakEvenPercent: '',
        retailPrice: '',
        jobCost: '',
        overheadCost: '',
        targetMargin: '',
        insuranceCarrier: ''
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Report - ${formData.jobName}</title>
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
            .status-jackpot { color: #249100; }
            .status-warning { color: #f59e0b; }
            .status-thin { color: #ea580c; }
            .status-no-bueno { color: #ef4444; }
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
            <h1>🏗️ Restoration Job Profitability Report</h1>
            <h2>${formData.jobName}</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="job-details">
            <h3>Job Details</h3>
            <div class="result-row">
              <span class="label">Job Name:</span>
              <span class="value">${formData.jobName}</span>
            </div>
            <div class="result-row">
              <span class="label">Insurance Carrier:</span>
              <span class="value">${formData.insuranceCarrier || 'N/A'}</span>
            </div>
            <div class="result-row">
              <span class="label">Retail Price:</span>
              <span class="value">${formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Job Cost:</span>
              <span class="value">${formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Target Margin:</span>
              <span class="value">${formatPercentage(parseFloat(formData.targetMargin) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Overhead Cost:</span>
              <span class="value">${formatCurrency(parseFloat(formData.overheadCost) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Break-Even %:</span>
              <span class="value">${formatPercentage(parseFloat(formData.breakEvenPercent) || 0)}</span>
            </div>
          </div>
          
          <div class="results">
            <h3>Profitability Results</h3>
            <div class="result-row">
              <span class="label">Actual Margin:</span>
              <span class="value status-${results.profitabilityStatus}">${formatPercentage(results.actualMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Markup:</span>
              <span class="value">${formatPercentage(results.actualMarkup)}</span>
            </div>
            <div class="result-row">
              <span class="label">Gross Profit ($):</span>
              <span class="value">${formatCurrency(results.grossProfit)}</span>
            </div>
            ${(!results.coversOverhead && results.actualMargin >= 0) ? `
            <div class="result-row">
              <span class="label">Overhead Coverage:</span>
              <span class="value status-thin">Overhead not covered</span>
            </div>
            ` : ''}
            <div class="result-row">
              <span class="label">Gross Profit ($):</span>
              <span class="value">${formatCurrency(results.grossProfit)}</span>
            </div>
            <div class="result-row">
              <span class="label">Required Price:</span>
              <span class="value">${formatCurrency(results.requiredPrice)}</span>
            </div>
            <div class="result-row">
              <span class="label">Required Markup:</span>
              <span class="value">${formatPercentage(results.requiredMarkup)}</span>
            </div>
            ${results.profitShortfall > 0 ? `
            <div class="result-row">
              <span class="label">Profit Shortfall:</span>
              <span class="value status-danger">${formatCurrency(results.profitShortfall)}</span>
            </div>
            ` : ''}
          </div>
          
          ${results.profitShortfall > 0 ? `
          <div class="impact">
            <h3>Impact to Business</h3>
            <div class="result-row">
              <span class="label">Revenue needed at 10% margin:</span>
              <span class="value">${formatCurrency(results.revenueNeeded10Percent)}</span>
            </div>
            <div class="result-row">
              <span class="label">Revenue needed at current margin:</span>
              <span class="value">${formatCurrency(results.revenueNeededCurrent)}</span>
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
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <div className="card">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 font-header">
          🧮 Job Calculator
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Name */}
          <div>
            <label htmlFor="jobName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Job Name or Number *
            </label>
            <input
              type="text"
              id="jobName"
              name="jobName"
              value={formData.jobName}
              onChange={handleInputChange}
              className={`input-field ${errors.jobName ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter job name or number"
            />
            {errors.jobName && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.jobName}</p>
            )}
          </div>

          {/* Insurance Carrier */}
          <div>
            <label htmlFor="insuranceCarrier" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Insurance Carrier or Client Name (Optional)
            </label>
            <input
              type="text"
              id="insuranceCarrier"
              name="insuranceCarrier"
              value={formData.insuranceCarrier}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter carrier or client name"
            />
          </div>

          {/* Break-Even Percentage */}
          <div>
            <label htmlFor="breakEvenPercent" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Company Break-Even (%) *
            </label>
            <input
              type="number"
              id="breakEvenPercent"
              name="breakEvenPercent"
              value={formData.breakEvenPercent}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="100"
              className={`input-field ${errors.breakEvenPercent ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="35.00"
            />
            {errors.breakEvenPercent && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.breakEvenPercent}</p>
            )}
          </div>

          {/* Retail Price */}
          <div>
            <label htmlFor="retailPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Retail Price ($) *
            </label>
            <input
              type="number"
              id="retailPrice"
              name="retailPrice"
              value={formData.retailPrice}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.retailPrice ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="10,400.00"
            />
            {errors.retailPrice && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.retailPrice}</p>
            )}
          </div>

          {/* Job Cost */}
          <div>
            <label htmlFor="jobCost" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Job Cost ($) *
            </label>
            <input
              type="number"
              id="jobCost"
              name="jobCost"
              value={formData.jobCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.jobCost ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="8,400.00"
            />
            {errors.jobCost && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.jobCost}</p>
            )}
          </div>

          {/* Overhead Cost (Optional) */}
          <div>
            <label htmlFor="overheadCost" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Overhead Cost ($) (Optional)
            </label>
            <input
              type="number"
              id="overheadCost"
              name="overheadCost"
              value={formData.overheadCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.overheadCost ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="500.00"
            />
            {errors.overheadCost && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.overheadCost}</p>
            )}
          </div>

          {/* Target Margin */}
          <div>
            <label htmlFor="targetMargin" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Target Gross Profit Margin (%) *
            </label>
            <input
              type="number"
              id="targetMargin"
              name="targetMargin"
              value={formData.targetMargin}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="99.99"
              className={`input-field ${errors.targetMargin ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="45.00"
            />
            {errors.targetMargin && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.targetMargin}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              💾 Save Job
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-secondary"
            >
              🖨️ Print
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 font-title">
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
                    <p className="mt-1"><strong>Statuses</strong>: Jackpot (≥ target and covers overhead), Warning (below target but ≥ break-even and covers overhead), On Thin Ice (margin ≥ 0 but below break-even or overhead not covered), No Bueno (margin < 0).</p>
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
    </div>
  )
}

export default Calculator 