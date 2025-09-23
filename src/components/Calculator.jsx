import { useState, useEffect, useRef } from 'react'

const Calculator = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    jobName: '',
    carrier: '',
    retailPrice: '',
    jobCost: '',
    divisionOverheads: '',
    companyOverheads: '',
    royaltyRate: '',
    targetNetProfit: ''
  })

  const [results, setResults] = useState({
    actualMargin: 0,
    actualNetMargin: 0,
    actualMarkup: 0,
    grossProfit: 0,
    netProfit: 0,
    overheadCostDollars: 0,
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
    const targetNetProfit = parseFloat(formData.targetNetProfit) || 0
    const divisionOverheads = parseFloat(formData.divisionOverheads) || 0
    const companyOverheads = parseFloat(formData.companyOverheads) || 0
    const royaltyRate = parseFloat(formData.royaltyRate) || 0

    // Calculate total overhead cost percentage
    const totalOverheadPercent = divisionOverheads + companyOverheads + royaltyRate

    // Calculate actual overhead cost in dollars (percentage of retail price)
    const overheadCostDollars = retailPrice * (totalOverheadPercent / 100)

    // Actual Gross Margin = ((Retail Price - Job Cost) / Retail Price) × 100
    const actualGrossMargin = retailPrice > 0 ? ((retailPrice - jobCost) / retailPrice) * 100 : 0

    // Actual Net Margin = ((Retail Price - Job Cost - Overhead) / Retail Price) × 100
    const actualNetMargin = retailPrice > 0 ? ((retailPrice - jobCost - overheadCostDollars) / retailPrice) * 100 : 0

    // Actual Markup = ((Retail Price - Job Cost) / Job Cost) × 100
    const actualMarkup = jobCost > 0 ? ((retailPrice - jobCost) / jobCost) * 100 : 0

    // Gross Profit Dollars (before overhead)
    const grossProfit = retailPrice - jobCost

    // Net Profit Dollars (after overhead)
    const netProfit = grossProfit - overheadCostDollars

    // Required Retail Price to hit Target Net Profit = (Job Cost + Overhead) / (1 - Target Net Profit)
    const requiredPriceForNetProfit = (jobCost + overheadCostDollars) > 0 && targetNetProfit < 100 ? 
      (jobCost + overheadCostDollars) / (1 - targetNetProfit / 100) : 0

    // Use the net profit required price as primary (since it includes overhead)
    const requiredPrice = requiredPriceForNetProfit

    // Required Markup = ((Required Price - Job Cost) / Job Cost) × 100
    const requiredMarkup = jobCost > 0 ? ((requiredPrice - jobCost) / jobCost) * 100 : 0

    // Profit Shortfall = Required Price - Retail Price (only if below target)
    const profitShortfall = (actualNetMargin < targetNetProfit && requiredPrice > retailPrice) ? requiredPrice - retailPrice : 0

    // Additional revenue needed to cover shortfall at 10% margin
    const revenueNeeded10Percent = profitShortfall > 0 ? profitShortfall / 0.10 : 0

    // Additional revenue needed to cover shortfall at current margin
    const revenueNeededCurrent = profitShortfall > 0 && actualNetMargin > 0 ? profitShortfall / (actualNetMargin / 100) : 0

    // Determine profitability status based on NET margin and overhead coverage
    // Only calculate status if we have meaningful data (retail price > 0)
    let profitabilityStatus = 'neutral'
    const coversOverhead = overheadCostDollars <= 0 || netProfit >= 0
    
    if (retailPrice > 0) {
      // Jackpot! (green): above target net profit and overhead is covered
      // Warning! (yellow): below target net profit but overhead is covered
      // On Thin Ice (orange): below target net profit and not covering overhead
      // No Bueno (red): negative net profit (not covering overhead or negative margin)
      if (actualNetMargin >= targetNetProfit && coversOverhead) {
        profitabilityStatus = 'jackpot'
      } else if (actualNetMargin < targetNetProfit && coversOverhead) {
        profitabilityStatus = 'warning'
      } else if (actualNetMargin < targetNetProfit && !coversOverhead) {
        profitabilityStatus = 'thin'
      } else {
        profitabilityStatus = 'no-bueno'
      }
    }

    setResults({
      actualMargin: actualGrossMargin, // Keep for backward compatibility
      actualNetMargin,
      actualMarkup,
      grossProfit,
      netProfit,
      overheadCostDollars,
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
      newErrors.jobName = 'Job name or number is required'
    }

    if (!formData.retailPrice || parseFloat(formData.retailPrice) <= 0) {
      newErrors.retailPrice = 'Retail price must be greater than 0'
    }

    if (!formData.jobCost || parseFloat(formData.jobCost) < 0) {
      newErrors.jobCost = 'Job cost cannot be negative'
    }

    if (!formData.divisionOverheads || parseFloat(formData.divisionOverheads) < 0) {
      newErrors.divisionOverheads = 'Division overheads percentage is required and must be 0 or greater'
    }

    if (!formData.companyOverheads || parseFloat(formData.companyOverheads) < 0) {
      newErrors.companyOverheads = 'Company overheads percentage is required and must be 0 or greater'
    }

    if (!formData.royaltyRate || parseFloat(formData.royaltyRate) < 0) {
      newErrors.royaltyRate = 'Royalty rate percentage is required and must be 0 or greater'
    }

    if (!formData.targetNetProfit || parseFloat(formData.targetNetProfit) < 0 || parseFloat(formData.targetNetProfit) >= 100) {
      newErrors.targetNetProfit = 'Target net profit percentage is required and must be between 0 and 99.99'
    }

    const retailPrice = parseFloat(formData.retailPrice) || 0
    const jobCost = parseFloat(formData.jobCost) || 0

    if (jobCost > retailPrice) {
      newErrors.jobCost = 'Job cost cannot exceed retail price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onAddJob({
        ...formData,
        retailPrice: parseFloat(formData.retailPrice),
        jobCost: parseFloat(formData.jobCost),
        divisionOverheads: parseFloat(formData.divisionOverheads),
        companyOverheads: parseFloat(formData.companyOverheads),
        royaltyRate: parseFloat(formData.royaltyRate),
        targetNetProfit: parseFloat(formData.targetNetProfit),
        ...results
      })

      // Reset form
      setFormData({
        jobName: '',
        carrier: '',
        retailPrice: '',
        jobCost: '',
        divisionOverheads: '',
        companyOverheads: '',
        royaltyRate: '',
        targetNetProfit: ''
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
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
              <img src="/logo.svg" alt="Company Logo" style="height: 60px; width: auto;" onerror="this.src='/logo.png'; this.onerror=function(){this.style.display='none';}" />
              <div style="text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Restoration Job Profitability Report</h1>
                <h2 style="margin: 5px 0; font-size: 18px; color: #666;">${formData.jobName}</h2>
                <p style="margin: 0; font-size: 14px; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
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
              <span class="label">Target Net Margin:</span>
              <span class="value">${formatPercentage(parseFloat(formData.targetNetMargin) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Target Gross Margin:</span>
              <span class="value">${formatPercentage(parseFloat(formData.targetMargin) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Overhead Cost (%):</span>
              <span class="value">${formatPercentage(parseFloat(formData.overheadCost) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Break-Even %:</span>
              <span class="value">${formatPercentage(parseFloat(formData.breakEvenPercent) || 0)}</span>
            </div>
          </div>
          
          <div class="results">
            <h3>Profitability Results</h3>
            ${results.profitabilityStatus !== 'neutral' ? `
            <div class="result-row">
              <span class="label">Profitability Status:</span>
              <span class="value status-${results.profitabilityStatus}">${getStatusText(results.profitabilityStatus)}</span>
            </div>
            ` : ''}
            <div class="result-row">
              <span class="label">Actual Gross Margin:</span>
              <span class="value">${formatPercentage(results.actualMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Net Margin:</span>
              <span class="value status-${results.profitabilityStatus}">${formatPercentage(results.actualNetMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Markup:</span>
              <span class="value">${formatPercentage(results.actualMarkup)}</span>
            </div>
            <div class="result-row">
              <span class="label">Gross Profit ($):</span>
              <span class="value">${formatCurrency(results.grossProfit)}</span>
            </div>
            <div class="result-row">
              <span class="label">Overhead Cost ($):</span>
              <span class="value">${formatCurrency(results.overheadCostDollars)}</span>
            </div>
            <div class="result-row">
              <span class="label">Net Profit ($):</span>
              <span class="value ${results.netProfit >= 0 ? 'status-jackpot' : 'status-no-bueno'}">${formatCurrency(results.netProfit)}</span>
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
      {/* Top Section: Quick Tips and Status Indicators */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Tips - Top Left */}
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <h3 className="text-lg font-semibold mb-3 font-subheader" style={{color: '#1F1F1F'}}>
            💡 Quick Tips
          </h3>
          <ul className="text-sm space-y-2" style={{color: '#1F1F1F'}}>
            <li>• Set your company's break-even percentage first</li>
            <li>• Target margins should be above break-even</li>
            <li>• Use the reference table to convert margin to markup</li>
            <li>• Save jobs to track trends over time</li>
          </ul>
        </div>
        
        {/* Status Indicators - Top Right */}
        <div className="card bg-neutral-50 dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-3 font-subheader" style={{color: '#1F1F1F'}}>
            🚨 Status Indicators
          </h3>
          <div className="space-y-2 text-sm" style={{color: '#1F1F1F'}}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Jackpot! — You're above target and your overhead is covered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span>Warning! — You're below target, but your break-even and overhead are covered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧊</span>
              <span>On Thin Ice — You're below target and break-even, but your overhead is covered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛔</span>
              <span>No Bueno — You're in the red</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Calculator and Results Side by Side */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator Form - Left */}
        <div className="card border-2 border-[#63D43E]">
        <h2 className="text-2xl font-bold mb-6 font-header flex items-center gap-3" style={{color: '#1F1F1F'}}>
          <div className="calculator-icon flex-shrink-0">
            <div className="calc-screen">0</div>
            <div className="calc-buttons">
              <div className="calc-btn">7</div>
              <div className="calc-btn">8</div>
              <div className="calc-btn">9</div>
              <div className="calc-btn">+</div>
              <div className="calc-btn">-</div>
              <div className="calc-btn clear">C</div>
              <div className="calc-btn">×</div>
              <div className="calc-btn">÷</div>
              <div className="calc-btn equals">=</div>
            </div>
          </div>
          Job Calculator
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Job Details */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold font-subheader" style={{color: '#1F1F1F'}}>
              Job Details
            </h4>
            
            {/* Job Name */}
            <div>
              <label htmlFor="jobName" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
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
              <label htmlFor="carrier" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Insurance Carrier or Client Name (Optional)
              </label>
              <input
                type="text"
                id="carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter carrier or client name"
              />
            </div>

            {/* Retail Price */}
            <div>
              <label htmlFor="retailPrice" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Retail Price / Charge Out $ *
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
              <label htmlFor="jobCost" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Job Cost / COGS $ *
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
          </div>

          {/* Group 2: Overhead Costs */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold font-subheader" style={{color: '#1F1F1F'}}>
              Overhead Costs
            </h4>
            
            {/* Division Overheads */}
            <div>
              <label htmlFor="divisionOverheads" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Division Overheads % *
              </label>
              <input
                type="number"
                id="divisionOverheads"
                name="divisionOverheads"
                value={formData.divisionOverheads}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className={`input-field ${errors.divisionOverheads ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="15.00"
              />
              {errors.divisionOverheads && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.divisionOverheads}</p>
              )}
            </div>

            {/* Company Overheads */}
            <div>
              <label htmlFor="companyOverheads" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Company Overheads % *
              </label>
              <input
                type="number"
                id="companyOverheads"
                name="companyOverheads"
                value={formData.companyOverheads}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className={`input-field ${errors.companyOverheads ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="10.00"
              />
              {errors.companyOverheads && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.companyOverheads}</p>
              )}
            </div>

            {/* Royalty Rate */}
            <div>
              <label htmlFor="royaltyRate" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Royalty Rate % *
              </label>
              <input
                type="number"
                id="royaltyRate"
                name="royaltyRate"
                value={formData.royaltyRate}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className={`input-field ${errors.royaltyRate ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="5.00"
              />
              {errors.royaltyRate && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.royaltyRate}</p>
              )}
            </div>
          </div>

          {/* Group 3: Target Profit */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold font-subheader" style={{color: '#1F1F1F'}}>
              Target Profit
            </h4>
            
            {/* Target Net Profit */}
            <div>
              <label htmlFor="targetNetProfit" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Target Net Profit % *
              </label>
              <input
                type="number"
                id="targetNetProfit"
                name="targetNetProfit"
                value={formData.targetNetProfit}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="99.99"
                className={`input-field ${errors.targetNetProfit ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="30.00"
              />
              {errors.targetNetProfit && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.targetNetProfit}</p>
              )}
            </div>
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

        {/* Results - Right */}
        <div className="card">
        <h3 className="text-lg font-semibold mb-3 font-subheader" style={{color: '#1F1F1F'}}>
          📈 Results
        </h3>
        
        <div className="space-y-3">
          {/* Profitability Status - Only show when calculations have been performed */}
          {results.profitabilityStatus !== 'neutral' && (
            <div className="result-item bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium" style={{color: '#1F1F1F'}}>
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
                      <p className="mb-1"><strong>Break-even %</strong>: Your company threshold entered above. If actual net margin is below this, you are below company break-even.</p>
                      <p className="mb-1"><strong>Overhead coverage</strong>: Net Profit ($) must be ≥ 0 (after subtracting overhead cost from gross profit).</p>
                      <p className="mt-1"><strong>Statuses</strong>: Jackpot (above target net margin, above break-even, and covers overhead), Warning (below target net margin but above break-even and covers overhead), On Thin Ice (below target net margin, below break-even, but covers overhead), No Bueno (below everything - not covering overhead or negative margin).</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
          )}
          
          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Actual Gross Margin:</span>
            <span className="result-value">
              {formatPercentage(results.actualMargin)}
            </span>
          </div>

          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Actual Net Margin:</span>
            <span className={`result-value ${getStatusColor(results.profitabilityStatus)}`}>
              {formatPercentage(results.actualNetMargin)}
            </span>
          </div>
          
          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Actual Markup:</span>
            <span className="result-value">
              {formatPercentage(results.actualMarkup)}
            </span>
          </div>

          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Gross Profit ($):</span>
            <span className="result-value">
              {formatCurrency(results.grossProfit)}
            </span>
          </div>

          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Overhead Cost ($):</span>
            <span className="result-value">
              {formatCurrency(results.overheadCostDollars)}
            </span>
          </div>

          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Net Profit ($):</span>
            <span className={`result-value ${results.netProfit >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
              {formatCurrency(results.netProfit)}
            </span>
          </div>
          
          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Required Price:</span>
            <span className="result-value">
              {formatCurrency(results.requiredPrice)}
            </span>
          </div>
          
          <div className="result-item">
            <span style={{color: '#1F1F1F'}}>Required Markup:</span>
            <span className="result-value">
              {formatPercentage(results.requiredMarkup)}
            </span>
          </div>
          
          {results.profitShortfall > 0 && (
            <>
              <div className="result-item">
                <span style={{color: '#1F1F1F'}}>Profit Shortfall:</span>
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
    </div>
  )
}

export default Calculator 