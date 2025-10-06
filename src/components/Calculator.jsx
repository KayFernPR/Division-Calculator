import { useState, useEffect, useRef } from 'react'

// Calculator - Restored to working version
const Calculator = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    jobName: '',
    carrier: '',
    division: '',
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

    // Actual Mark-up % = (Retail Price - Job Cost) / Job Cost × 100
    const actualMarkup = jobCost > 0 ? ((retailPrice - jobCost) / jobCost) * 100 : 0

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

      // This Job Is % = Your Profit Margin is % - Required Margin %
      const thisJobIs = actualContributionMargin - requiredMargin

      // Your job $ = Retail Price $ - Required Price $
      const yourJob = retailPrice - requiredPrice

      // Determine profitability status based on actual net profit vs target net profit
      let profitabilityStatus = 'neutral'
      
      if (retailPrice > 0) {
        // Calculate target net profit in dollars
        const targetNetProfitDollars = retailPrice * (targetNetProfit / 100)
        
        // Calculate difference between actual and target net profit
        const profitDifference = actualNetProfit - targetNetProfitDollars
        const profitDifferencePercent = targetNetProfitDollars > 0 ? (profitDifference / targetNetProfitDollars) * 100 : 0
        
        // Check conditions in order of priority
        if (actualNetProfit < 0 && actualNetProfit < (0 - targetNetProfitDollars)) {
          profitabilityStatus = 'below-breakeven' // STOP - Significant loss (Below break-even)
        } else if (actualNetProfit < 0 || profitDifferencePercent < (targetNetProfit / 2)) {
          profitabilityStatus = 'extreme-warning' // EXTREME WARNING - Near break-even
        } else if (actualNetProfit < 0 || profitDifferencePercent < (0 - targetNetProfit)) {
          profitabilityStatus = 'warning' // Warning - Below target but profitable
        } else if (profitDifferencePercent >= 5) {
          profitabilityStatus = 'jackpot' // 5% or More above target
        } else if (profitDifferencePercent > 0 && profitDifferencePercent < 5) {
          profitabilityStatus = 'winning' // 0-5% above target
        } else if (profitDifferencePercent === 0 || (profitDifferencePercent >= -0.1 && profitDifferencePercent <= 0.1)) {
          profitabilityStatus = 'at-budget' // 0 At Target
        } else {
          profitabilityStatus = 'warning' // Default to warning for any other case
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
      newErrors.divisionOverheads = 'Division overhead costs percentage is required and must be 0 or greater'
    }

    if (!formData.companyOverheads || parseFloat(formData.companyOverheads) < 0) {
      newErrors.companyOverheads = 'Company overhead costs percentage is required and must be 0 or greater'
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
        division: '',
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


  const getStatusText = (status) => {
    switch (status) {
      case 'jackpot':
        return "Jackpot!"
      case 'winning':
        return "You're Winning!"
      case 'at-budget':
        return "Great Job! You're at Target!"
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'jackpot':
        return "🏆"
      case 'winning':
        return "🎯"
      case 'at-budget':
        return "✅"
      case 'warning':
        return "⚠️"
      case 'extreme-warning':
        return "🚨"
      case 'below-breakeven':
        return "⛔"
      default:
        return ''
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
        return 'Above Target'
      } else if (value >= -0.1 && value <= 0.1) {
        return 'At Target'
      } else {
        return 'Below Target'
      }
    } else {
      // For "Your Job" dollar amount
      if (value > 0) {
        return 'Above Target'
      } else if (value === 0) {
        return 'At Target'
      } else {
        return 'Below Target'
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
              margin: 12px;
              line-height: 1.3;
              color: #333;
              font-size: 12px;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #249100;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .job-details, .results, .impact {
              margin-bottom: 15px;
            }
            .job-details h3, .results h3, .impact h3 {
              font-size: 14px;
              margin-bottom: 8px;
              color: #249100;
            }
            .result-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              padding: 2px 0;
              border-bottom: 1px solid #ebe6e3;
              font-size: 11px;
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
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #907c6d;
            }
            @media print {
              body { 
                margin: 8px; 
                font-size: 11px;
              }
              .no-print { display: none; }
              .header {
                margin-bottom: 12px;
                padding-bottom: 8px;
              }
              .job-details, .results, .impact {
                margin-bottom: 12px;
              }
              .result-row {
                margin-bottom: 3px;
                font-size: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="display: flex; justify-content: flex-start; align-items: flex-start; margin-bottom: 10px;">
              <!-- Logo top left -->
              <img src="/logo.svg" alt="Company Logo" style="height: 30px; width: auto;" onerror="this.src='/logo.png'; this.onerror=function(){this.style.display='none';}" />
            </div>
            
            <!-- Job # top center - compact -->
            <div style="text-align: center; margin-bottom: 8px;">
              <h2 style="margin: 0; font-size: 18px; color: #333; font-weight: bold;">Job #: ${formData.jobName || '0001'}</h2>
          </div>

            <!-- "Profitability Report" centered under Job # - compact -->
            <div style="text-align: center; margin-bottom: 6px;">
              <h1 style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">Profitability Report</h1>
          </div>

            <!-- "Generated on" centered under "Profitability Report" - compact -->
            <div style="text-align: center; margin-bottom: 10px;">
              <p style="margin: 0; font-size: 12px; color: #666; font-weight: 500;">Generated on ${new Date().toLocaleDateString()}</p>
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
              <span class="label">Sales $:</span>
              <span class="value">${formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">COGS $:</span>
              <span class="value">${formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">COGS %:</span>
              <span class="value">${formatPercentage(results.jobCostPercent)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Contribution Margin %:</span>
              <span class="value">${formatPercentage(results.actualContributionMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Mark-up %:</span>
              <span class="value">${formatPercentage(results.actualMarkup)}</span>
            </div>
            <div class="result-row">
              <span class="label">Division Overhead Costs $:</span>
              <span class="value">${formatCurrency(results.divisionOverheadsDollars)}</span>
            </div>
            <div class="result-row">
              <span class="label">Company Overhead Costs $:</span>
              <span class="value">${formatCurrency(results.companyOverheadsDollars)}</span>
            </div>
            <div class="result-row">
              <span class="label">Total Controllable Margin $:</span>
              <span class="value">${formatCurrency(results.totalControllableMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Royalty $:</span>
              <span class="value">${formatCurrency(results.royaltyDollars)}</span>
            </div>
            <div class="result-row">
              <span class="label">Actual Net Profit $:</span>
              <span class="value">${formatCurrency(results.actualNetProfit)}</span>
            </div>
            <div class="result-row">
              <span class="label">Break Even Price $:</span>
              <span class="value">${formatCurrency(results.breakEvenPrice)}</span>
            </div>
            <div class="result-row">
              <span class="label">Division Total Break-Even %:</span>
              <span class="value">${formatPercentage(results.divisionTotalBreakEven)}</span>
            </div>
            <div class="result-row">
              <span class="label">Required Price $:</span>
              <span class="value">${formatCurrency(results.requiredPrice)}</span>
            </div>
            <div class="result-row">
              <span class="label">Required Margin %:</span>
              <span class="value">${formatPercentage(results.requiredMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">Your Price $:</span>
              <span class="value">${formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
            </div>
            <div class="result-row">
              <span class="label">Your Profit Margin is %:</span>
              <span class="value">${formatPercentage(results.actualContributionMargin)}</span>
            </div>
            <div class="result-row">
              <span class="label">You are currently at:</span>
              <span class="value">${formatPercentage(results.thisJobIs)} (${results.thisJobIs > 0.1 ? 'Above Target' : results.thisJobIs >= -0.1 && results.thisJobIs <= 0.1 ? 'At Target' : 'Below Target'})</span>
            </div>
            <div class="result-row">
              <span class="label">Which is:</span>
              <span class="value">${formatCurrency(results.yourJob)} (${results.yourJob > 0 ? 'Above Target' : results.yourJob === 0 ? 'At Target' : 'Below Target'})</span>
            </div>
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
          <ul className="text-base space-y-2" style={{color: '#1F1F1F'}}>
            <li>• Set your company's break-even percentage first</li>
            <li>• Target margins should be above break-even</li>
            <li>• Use the reference table to convert margin to markup</li>
            <li>• Save jobs to track trends over time</li>
            <li>• Print this page for your records or to include in your reports</li>
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
              <span>Great Job! You're at Target! — Meeting target</span>
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
      <div className="flex lg:flex-row flex-col gap-6 items-stretch">
        {/* Calculator Form - Left */}
        <div className="card border-2 border-[#63D43E] flex flex-col w-full lg:w-1/3">
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
          
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-grow">
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

              {/* Division */}
              <div>
              <label htmlFor="division" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                Division (Optional)
                </label>
                <input
                  type="text"
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                className="input-field"
                  placeholder="Enter division name"
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
                  placeholder="Enter 0 if you don't pay fees"
                />
              {errors.royaltyRate && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.royaltyRate}</p>
              )}
              </div>

              {/* Division Overhead Costs */}
              <div>
              <label htmlFor="divisionOverheads" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                  Division Overhead Costs % *
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
                  placeholder="5.00"
                />
                {errors.divisionOverheads && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.divisionOverheads}</p>
                )}
              </div>

              {/* Company Overhead Costs */}
              <div>
              <label htmlFor="companyOverheads" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                  Company Overhead Costs % *
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
            </div>

            {/* Group 3: Target Profit */}
            <div className="space-y-4">
            <h4 className="text-md font-semibold font-subheader" style={{color: '#1F1F1F'}}>
                Target Profit
              </h4>
            
              
              {/* Target Operating Profit */}
              <div>
              <label htmlFor="targetNetProfit" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
                  Target Operating Profit % *
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

          <div className="flex gap-3 pt-4 mt-auto">
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
        <div className="card flex flex-col w-full lg:w-2/3">
        <h3 className="text-lg font-semibold mb-3 font-subheader" style={{color: '#1F1F1F'}}>
            📈 Results
          </h3>
          
        <div className="space-y-2 flex flex-col flex-grow">
          {/* Profitability Status - Only show when calculations have been performed */}
            {results.profitabilityStatus !== 'neutral' && (
            <div className="result-item bg-neutral-50 dark:bg-neutral-800 rounded-lg p-1">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium" style={{color: '#1F1F1F'}}>
                  <span>This Job is:</span>
                  <div className="relative group select-none" ref={statusHelpRef}>
                    <button
                      type="button"
                      onClick={() => setShowStatusHelp(prev => !prev)}
                      aria-expanded={showStatusHelp}
                      aria-controls="status-help-tooltip"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                      title="How status is determined"
                    >
                      {getStatusIcon(results.profitabilityStatus)}
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
          <div className="space-y-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2">
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Sales $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Sales:</strong> The total amount you charge the customer for the job.</p>
              </div>
              </div>
              </div>
              <span className="result-value">
                {formatCurrency(parseFloat(formData.retailPrice) || 0)}
              </span>
              </div>

            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>COGS $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>COGS:</strong> Your direct costs for materials, labor, and subcontractors (Cost of Goods Sold).</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(parseFloat(formData.jobCost) || 0)}
              </span>
            </div>

            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>COGS %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>COGS %:</strong> Percentage of sales that goes to direct costs (Cost of Goods Sold).</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.jobCostPercent)}
              </span>
            </div>


            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Actual Contribution Margin %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Actual Contribution Margin %:</strong> Your actual profit margin percentage after direct costs.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.actualContributionMargin)}
              </span>
            </div>
            
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Actual Mark-up %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Actual Mark-up %:</strong> How much you mark up your job costs to get the retail price.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.actualMarkup)}
              </span>
              </div>
            </div>

            {/* Group 2 - White */}
          <div className="space-y-1 bg-white dark:bg-neutral-900 rounded-lg p-2">
            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Contribution Margin $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Contribution Margin:</strong> Revenue minus direct job costs. Money available to cover overhead and profit.</p>
              </div>
              </div>
              </div>
              <span className={`result-value ${results.contributionMargin >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {formatCurrency(results.contributionMargin)}
              </span>
              </div>

            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Division Overhead Costs $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Division Overhead Costs $:</strong> Division-specific overhead costs allocated to this job.</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(results.divisionOverheadsDollars)}
              </span>
            </div>

            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Company Overhead Costs $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Company Overhead Costs $:</strong> Company-wide overhead costs allocated to this job.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(results.companyOverheadsDollars)}
              </span>
            </div>

            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Total Controllable Margin $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Total Controllable Margin $:</strong> Money left after covering all overhead costs.</p>
                  </div>
                </div>
              </div>
              <span className={`result-value ${results.totalControllableMargin >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {formatCurrency(results.totalControllableMargin)}
              </span>
            </div>

            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Royalty $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Royalty $:</strong> Royalty fees paid to franchisor or brand owner.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(results.royaltyDollars)}
              </span>
            </div>

            {/* Group 3 - Light Grey */}
          <div className="space-y-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2">
            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Actual Net Profit $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Actual Net Profit:</strong> Final profit after all costs including overhead and royalty fees.</p>
              </div>
                </div>
              </div>
              <span className={`result-value ${results.actualNetProfit >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                  {formatCurrency(results.actualNetProfit)}
                </span>
            </div>

            {/* Group 4 - White */}
          <div className="space-y-1 bg-white dark:bg-neutral-900 rounded-lg p-2">
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Break Even Price $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Break Even Price $:</strong> Minimum price needed to cover all costs with zero profit.</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(results.breakEvenPrice)}
              </span>
            </div>

            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Division Total Break-Even %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Division Total Break-Even %:</strong> Your company's minimum margin threshold to break even.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.divisionTotalBreakEven)}
              </span>
              </div>
            </div>

            {/* Group 5 - Light Grey */}
          <div className="space-y-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2">
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Required Price $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Required Price $:</strong> Price needed to achieve your target profit margin.</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(results.requiredPrice)}
              </span>
            </div>
            
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Required Margin %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Required Margin %:</strong> Total margin percentage needed to cover all costs and target profit.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.requiredMargin)}
              </span>
              </div>
            </div>

            {/* Group 6 - White */}
          <div className="space-y-1 bg-white dark:bg-neutral-900 rounded-lg p-2">
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Your Price $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Your Price $:</strong> The price you entered in the calculator (same as Retail Price).</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                {formatCurrency(parseFloat(formData.retailPrice) || 0)}
              </span>
            </div>

            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Your Profit Margin is %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Your Profit Margin is %:</strong> Your actual profit margin percentage (same as Actual Contribution Margin %).</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.actualContributionMargin)}
              </span>
              </div>
            </div>

            {/* Group 7 - Light Grey */}
          <div className="space-y-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 mt-auto">
            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>You are currently at:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>You are currently at:</strong> How your actual margin compares to your required margin (positive = above target, negative = below target).</p>
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                <span className={`result-value ${results.thisJobIs >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                    {formatPercentage(results.thisJobIs)}
                  </span>
                {results.profitabilityStatus !== 'neutral' && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getStatusIcon(results.profitabilityStatus)}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${getBudgetStatusColor(results.thisJobIs, true)} bg-opacity-10`}>
                      ({getBudgetStatus(results.thisJobIs, true)})
                  </span>
                </div>
                )}
              </div>
            </div>

            <div className="result-item">
              <div className="flex items-center gap-1">
                <span style={{color: '#1F1F1F'}}>Which is:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <p><strong>Which is:</strong> Dollar difference between your price and the required price (positive = above required, negative = below required).</p>
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                <span className={`result-value ${results.yourJob >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                    {formatCurrency(results.yourJob)}
                  </span>
                {results.profitabilityStatus !== 'neutral' && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getStatusIcon(results.profitabilityStatus)}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${getBudgetStatusColor(results.yourJob, false)} bg-opacity-10`}>
                      ({getBudgetStatus(results.yourJob, false)})
                  </span>
                  </div>
                )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

// Calculator component - trigger deployment
export default Calculator