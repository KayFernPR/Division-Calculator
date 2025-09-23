import { useState, useEffect, useRef } from 'react'

// Updated form structure with grouped fields
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
    // Legacy fields for backward compatibility
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
    coversOverhead: true,
    
    // New calculated fields
    jobCostPercent: 0,
    actualContributionMargin: 0,
    contributionMargin: 0,
    divisionOverheadsDollars: 0,
    companyOverheadsDollars: 0,
    totalControllableMargin: 0,
    royaltyDollars: 0,
    actualNetProfit: 0,
    divisionTotalBreakEven: 0,
    breakEvenPrice: 0,
    requiredMargin: 0,
    thisJobIs: 0,
    yourJob: 0
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

    // Job Cost % = Job Cost $ / Retail Price $
    const jobCostPercent = retailPrice > 0 ? (jobCost / retailPrice) * 100 : 0

    // Actual Contribution Margin % = 1 - (Job Cost $ / Retail Price $)
    const actualContributionMargin = retailPrice > 0 ? (1 - (jobCost / retailPrice)) * 100 : 0

    // Actual Mark-up % = Actual Contribution Margin % / (1 - Actual Contribution Margin %)
    const actualMarkup = actualContributionMargin > 0 ? (actualContributionMargin / (1 - actualContributionMargin / 100)) * 100 : 0

    // Contribution Margin $ = Retail Price $ - Job Cost $
    const contributionMargin = retailPrice - jobCost

    // Division Overheads $ = Retail Price $ * Division Overheads %
    const divisionOverheadsDollars = retailPrice * (divisionOverheads / 100)

    // Company Overheads $ = Retail Price $ * Company Overheads %
    const companyOverheadsDollars = retailPrice * (companyOverheads / 100)

    // Total Controllable Margin $ = Contribution Margin $ - Division Overheads $ - Company Overheads $
    const totalControllableMargin = contributionMargin - divisionOverheadsDollars - companyOverheadsDollars

    // Royalty $ = Retail Price $ * Royalty rate %
    const royaltyDollars = retailPrice * (royaltyRate / 100)

    // Actual Net Profit $ = Total Controllable Margin $ - Royalty $
    const actualNetProfit = totalControllableMargin - royaltyDollars

    // Division Total Break-Even % = Division Overheads % + Company Overheads % + Royalty rate %
    const divisionTotalBreakEven = divisionOverheads + companyOverheads + royaltyRate

    // Break Even Price $ = Job Cost $ / (1 - Division Total Break-Even %)
    const breakEvenPrice = divisionTotalBreakEven < 100 ? jobCost / (1 - divisionTotalBreakEven / 100) : 0

    // Required Margin % = Division Overheads % + Company Overheads % + Royalty rate % + Target Net Profit %
    const requiredMargin = divisionOverheads + companyOverheads + royaltyRate + targetNetProfit

    // Required Price $ = Job Cost $ / (1 - Required Margin %)
    const requiredPrice = requiredMargin < 100 ? jobCost / (1 - requiredMargin / 100) : 0

    // This Job Is % = Required Margin % - Your Profit Margin is %
    const thisJobIs = requiredMargin - actualContributionMargin

    // Your job $ = Retail Price $ - Required Price $
    const yourJob = retailPrice - requiredPrice

    // Determine profitability status based on "This Job Is" percentage
    let profitabilityStatus = 'neutral'
    
    if (retailPrice > 0) {
      if (thisJobIs >= 5) {
        profitabilityStatus = 'jackpot' // Above Target Profit - Jackpot
      } else if (thisJobIs >= 0 && thisJobIs < 5) {
        profitabilityStatus = 'winning' // You're Winning
      } else if (thisJobIs >= -0.1 && thisJobIs <= 0.1) {
        profitabilityStatus = 'at-budget' // Great Job You're At Budget
      } else if (thisJobIs > -targetNetProfit && thisJobIs < 0) {
        profitabilityStatus = 'warning' // Warning - You're Cutting Into Profits
      } else if (thisJobIs > -targetNetProfit/2 && thisJobIs <= -targetNetProfit) {
        profitabilityStatus = 'extreme-warning' // EXTREME WARNING - You're Almost Paying For The Job
      } else {
        profitabilityStatus = 'below-breakeven' // Below Break-Even - STOP - DON'T PAY TO DO THE WORK
      }
    }

    setResults({
      // Legacy fields for backward compatibility
      actualMargin: actualContributionMargin,
      actualNetMargin: actualContributionMargin,
      actualMarkup,
      grossProfit: contributionMargin,
      netProfit: actualNetProfit,
      overheadCostDollars: divisionOverheadsDollars + companyOverheadsDollars + royaltyDollars,
      requiredPrice,
      requiredMarkup: actualMarkup,
      profitShortfall: yourJob < 0 ? Math.abs(yourJob) : 0,
      revenueNeeded10Percent: 0,
      revenueNeededCurrent: 0,
      profitabilityStatus,
      coversOverhead: actualNetProfit >= 0,
      
      // New calculated fields
      jobCostPercent,
      actualContributionMargin,
      contributionMargin,
      divisionOverheadsDollars,
      companyOverheadsDollars,
      totalControllableMargin,
      royaltyDollars,
      actualNetProfit,
      divisionTotalBreakEven,
      breakEvenPrice,
      requiredMargin,
      thisJobIs,
      yourJob
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
      case 'winning':
        return "You're Winning!"
      case 'at-budget':
        return "Great Job! You're at Budget!"
      case 'warning':
        return "Warning - You're Cutting Into Profits!"
      case 'extreme-warning':
        return "EXTREME WARNING - You're Almost Paying For The Job"
      case 'below-breakeven':
        return "STOP - DON'T PAY TO DO THE WORK!!"
      default:
        return 'Calculating'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'jackpot':
        return 'text-success-600 dark:text-success-400'
      case 'winning':
        return 'text-success-500 dark:text-success-300'
      case 'at-budget':
        return 'text-blue-600 dark:text-blue-400'
      case 'warning':
        return 'text-warning-600 dark:text-warning-400'
      case 'extreme-warning':
        return 'text-orange-600 dark:text-orange-400'
      case 'below-breakeven':
        return 'text-danger-600 dark:text-danger-400'
      default:
        return 'text-neutral-500 dark:text-neutral-400'
    }
  }

  const getBudgetStatus = (value, isPercentage = true) => {
    if (isPercentage) {
      // For "This Job Is" percentage
      if (value > 0.1) {
        return 'Above Budget'
      } else if (value >= -0.1 && value <= 0.1) {
        return 'At Budget'
      } else {
        return 'Below Budget'
      }
    } else {
      // For "Your Job" dollar amount
      if (value > 0) {
        return 'Above Budget'
      } else if (value === 0) {
        return 'At Budget'
      } else {
        return 'Below Budget'
      }
    }
  }

  const getBudgetStatusColor = (value, isPercentage = true) => {
    if (isPercentage) {
      // For "This Job Is" percentage
      if (value > 0.1) {
        return 'text-success-600 dark:text-success-400'
      } else if (value >= -0.1 && value <= 0.1) {
        return 'text-blue-600 dark:text-blue-400'
      } else {
        return 'text-danger-600 dark:text-danger-400'
      }
    } else {
      // For "Your Job" dollar amount
      if (value > 0) {
        return 'text-success-600 dark:text-success-400'
      } else if (value === 0) {
        return 'text-blue-600 dark:text-blue-400'
      } else {
        return 'text-danger-600 dark:text-danger-400'
      }
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
              <span>Jackpot! — 5% or More Above Target Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>You're Winning! — 0 - 5% Above Target Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Great Job! You're at Budget! — Meeting target</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span>Warning - You're Cutting Into Profits! — Below target but profitable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚨</span>
              <span>EXTREME WARNING - You're Almost Paying For The Job — Near break-even</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛔</span>
              <span>STOP - DON'T PAY TO DO THE WORK!! — Significant loss</span>
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
          {/* Group 1: Job Details - Updated Form Structure */}
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
        
        <div className="space-y-4">
          {/* Profitability Status - Only show when calculations have been performed */}
          {results.profitabilityStatus !== 'neutral' && (
            <div className="result-item bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium" style={{color: '#1F1F1F'}}>
                  <span>This Job is:</span>
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
          
          {/* Group 1 - Light Grey */}
          <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Retail Price $:</span>
              <span className="result-value">
                {formatCurrency(parseFloat(formData.retailPrice) || 0)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Job Cost $:</span>
              <span className="result-value">
                {formatCurrency(parseFloat(formData.jobCost) || 0)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Job Cost %:</span>
              <span className="result-value">
                {formatPercentage(results.jobCostPercent)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Actual Contribution Margin %:</span>
              <span className="result-value">
                {formatPercentage(results.actualContributionMargin)}
              </span>
            </div>
            
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Actual Mark-up %:</span>
              <span className="result-value">
                {formatPercentage(results.actualMarkup)}
              </span>
            </div>
          </div>

          {/* Group 2 - White */}
          <div className="space-y-2 bg-white dark:bg-neutral-900 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Contribution Margin $:</span>
              <span className="result-value">
                {formatCurrency(results.contributionMargin)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Division Overheads $:</span>
              <span className="result-value">
                {formatCurrency(results.divisionOverheadsDollars)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Company Overheads $:</span>
              <span className="result-value">
                {formatCurrency(results.companyOverheadsDollars)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Total Controllable Margin $:</span>
              <span className="result-value">
                {formatCurrency(results.totalControllableMargin)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Royalty $:</span>
              <span className="result-value">
                {formatCurrency(results.royaltyDollars)}
              </span>
            </div>
          </div>

          {/* Group 3 - Light Grey */}
          <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Actual Net Profit $:</span>
              <span className={`result-value ${results.actualNetProfit >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {formatCurrency(results.actualNetProfit)}
              </span>
            </div>
          </div>

          {/* Group 4 - White */}
          <div className="space-y-2 bg-white dark:bg-neutral-900 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Break Even Price $:</span>
              <span className="result-value">
                {formatCurrency(results.breakEvenPrice)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Division Total Break-Even %:</span>
              <span className="result-value">
                {formatPercentage(results.divisionTotalBreakEven)}
              </span>
            </div>
          </div>

          {/* Group 5 - Light Grey */}
          <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Required Price $:</span>
              <span className="result-value">
                {formatCurrency(results.requiredPrice)}
              </span>
            </div>
            
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Required Margin %:</span>
              <span className="result-value">
                {formatPercentage(results.requiredMargin)}
              </span>
            </div>
          </div>

          {/* Group 6 - White */}
          <div className="space-y-2 bg-white dark:bg-neutral-900 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Your Price $:</span>
              <span className="result-value">
                {formatCurrency(parseFloat(formData.retailPrice) || 0)}
              </span>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Your Profit Margin is %:</span>
              <span className="result-value">
                {formatPercentage(results.actualContributionMargin)}
              </span>
            </div>
          </div>

          {/* Group 7 - Light Grey */}
          <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>This Job is:</span>
              <div className="flex items-center gap-2">
                <span className="result-value text-success-600 dark:text-success-400">
                  {formatPercentage(results.thisJobIs)}
                </span>
                {results.profitabilityStatus !== 'neutral' && (
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getBudgetStatusColor(results.thisJobIs, true)} bg-opacity-10`}>
                    {getBudgetStatus(results.thisJobIs, true)}
                  </span>
                )}
              </div>
            </div>

            <div className="result-item">
              <span style={{color: '#1F1F1F'}}>Your Job is:</span>
              <div className="flex items-center gap-2">
                <span className={`result-value ${results.yourJob >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                  {formatCurrency(results.yourJob)}
                </span>
                {results.profitabilityStatus !== 'neutral' && (
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getBudgetStatusColor(results.yourJob, false)} bg-opacity-10`}>
                    {getBudgetStatus(results.yourJob, false)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
        </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator 