import React, { useState, useEffect, useRef } from 'react'

const Calculator = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    retailPrice: '',
    jobCost: '',
    royaltyRate: '',
    divisionVariableExpenses: '',
    divisionOverheads: '',
    companyOverheads: '',
    targetNetProfit: ''
  })

  const [results, setResults] = useState({
    grossProfit: 0,
    divisionVariableExpensesDollars: 0,
    divisionOverheadsDollars: 0,
    royaltyDollars: 0,
    contributionMargin: 0,
    controllableMargin: 0,
    companyOverheadsDollars: 0,
    operatingIncome: 0,
    actualNetProfit: 0,
    yourPrice: 0,
    yourProfitMargin: 0,
    divisionTotalBreakEven: 0,
    breakEvenPrice: 0,
    requiredMargin: 0,
    requiredPrice: 0,
    thisJobIs: 0,
    yourJob: 0,
    profitabilityStatus: 'neutral',
    coversOverhead: false,
    jobCostPercent: 0,
    actualMarkup: 0
  })

  const [errors, setErrors] = useState({})
  const [isCalculated, setIsCalculated] = useState(false)
  const resultsRef = useRef(null)

  // Real-time calculation updates
  useEffect(() => {
    if (formData.retailPrice && formData.jobCost) {
      calculateResults()
    }
  }, [formData])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return '🏆'
      case 'good': return '🎯'
      case 'neutral': return <img src="/profitable-restorer-emblem.png.png" alt="Profitable Restorer" className="w-5 h-5 inline-block" />
      case 'thin': return '⚠️'
      case 'poor': return '🚨'
      default: return '⚪'
    }
  }

  const getBudgetStatus = (value, isPercentage) => {
    if (isPercentage) {
      if (value > 0.1) return 'Above Target'
      if (value >= -0.1 && value <= 0.1) return 'At Target'
      return 'Below Target'
    } else {
      if (value > 0) return 'Above Required'
      if (value === 0) return 'At Required'
      return 'Below Required'
    }
  }

  const getBudgetStatusColor = (value, isPercentage) => {
    if (isPercentage) {
      if (value > 0.1) return 'text-success-600 dark:text-success-400'
      if (value >= -0.1 && value <= 0.1) return 'text-blue-600 dark:text-blue-400'
      return 'text-danger-600 dark:text-danger-400'
    } else {
      if (value > 0) return 'text-success-600 dark:text-success-400'
      if (value === 0) return 'text-blue-600 dark:text-blue-400'
      return 'text-danger-600 dark:text-danger-400'
    }
  }

  const calculateResults = () => {
      const retailPrice = parseFloat(formData.retailPrice) || 0
      const jobCost = parseFloat(formData.jobCost) || 0
    const royaltyRate = parseFloat(formData.royaltyRate) || 0
    const divisionVariableExpenses = parseFloat(formData.divisionVariableExpenses) || 0
      const divisionOverheads = parseFloat(formData.divisionOverheads) || 0
      const companyOverheads = parseFloat(formData.companyOverheads) || 0
    const targetNetProfit = parseFloat(formData.targetNetProfit) || 0

    // Calculation flow - Updated to match Excel formulas
    const grossProfit = retailPrice - jobCost
    const divisionVariableExpensesDollars = (divisionVariableExpenses / 100) * retailPrice
    const divisionOverheadsDollars = (divisionOverheads / 100) * retailPrice
    const royaltyDollars = (royaltyRate / 100) * retailPrice
    const contributionMargin = (retailPrice - jobCost) - (divisionVariableExpenses / 100) * retailPrice - (royaltyRate / 100) * retailPrice
    const controllableMargin = retailPrice * (1 - divisionVariableExpenses / 100 - royaltyRate / 100 - divisionOverheads / 100) - jobCost
    const companyOverheadsDollars = (companyOverheads / 100) * retailPrice
    const operatingIncome = retailPrice * (1 - divisionVariableExpenses / 100 - divisionOverheads / 100 - companyOverheads / 100 - royaltyRate / 100) - jobCost
    const actualNetProfit = operatingIncome

    // Break-even and target analysis - Updated formulas
    const yourProfitMargin = retailPrice > 0 ? ((retailPrice - jobCost) / retailPrice) * 100 : 0
    const divisionTotalBreakEven = royaltyRate + divisionVariableExpenses + divisionOverheads + companyOverheads
    const breakEvenPrice = jobCost / (1 - (divisionVariableExpenses + divisionOverheads + companyOverheads + royaltyRate) / 100)
    const requiredPrice = jobCost / (1 - (divisionVariableExpenses + divisionOverheads + companyOverheads + royaltyRate + targetNetProfit) / 100)
    const requiredMargin = ((requiredPrice - jobCost) / requiredPrice) * 100
    const yourPrice = retailPrice
    const thisJobIs = yourProfitMargin - requiredMargin
      const yourJob = retailPrice - requiredPrice

    // Profitability status - Balanced thresholds using marginDifference (yourProfitMargin - requiredMargin)
      let profitabilityStatus = 'neutral'
    const marginDifference = yourProfitMargin - requiredMargin
    
    if (actualNetProfit < 0) {
      profitabilityStatus = 'loss' // Special case for negative profit
    } else if (marginDifference >= 5) {
      profitabilityStatus = 'excellent' // ≥ 5% (5%+ above target)
    } else if (marginDifference >= 1) {
      profitabilityStatus = 'good' // ≥ 1% (1-5% above target)
    } else if (marginDifference >= -1) {
      profitabilityStatus = 'neutral' // ≥ -1% (within 1% of target)
    } else if (marginDifference >= -5) {
      profitabilityStatus = 'thin' // ≥ -5% (1-5% below target) - Warning
    } else if (marginDifference >= -10) {
      profitabilityStatus = 'poor' // ≥ -10% (5-10% below target) - Extreme Warning
        } else {
      profitabilityStatus = 'loss' // < -10% (10%+ below target) - Stop
    }

    const coversOverhead = grossProfit >= companyOverheadsDollars
    const jobCostPercent = retailPrice > 0 ? (jobCost / retailPrice) * 100 : 0
    const actualMarkup = jobCost > 0 ? ((retailPrice - jobCost) / jobCost) * 100 : 0

      setResults({
      grossProfit,
      divisionVariableExpensesDollars,
        divisionOverheadsDollars,
        royaltyDollars,
      contributionMargin,
      controllableMargin,
      companyOverheadsDollars,
      operatingIncome,
        actualNetProfit,
      yourPrice,
      yourProfitMargin,
        divisionTotalBreakEven,
        breakEvenPrice,
        requiredMargin,
      requiredPrice,
        thisJobIs,
      yourJob,
      profitabilityStatus,
      coversOverhead,
      jobCostPercent,
      actualMarkup
    })
    
    // Set isCalculated to true when results are calculated
    setIsCalculated(true)
  }

  const validateForm = () => {
    const newErrors = {}

    // Retail Price validation
    if (!formData.retailPrice || formData.retailPrice.trim() === '') {
      newErrors.retailPrice = 'Retail Price is required'
    } else {
      const retailPrice = parseFloat(formData.retailPrice)
      if (isNaN(retailPrice)) {
        newErrors.retailPrice = 'Retail Price must be a valid number'
      } else if (retailPrice <= 0) {
      newErrors.retailPrice = 'Retail Price must be greater than 0'
      } else if (retailPrice > 10000000) {
        newErrors.retailPrice = 'Retail Price seems unusually high (>$10M)'
      }
    }

    // Job Cost validation
    if (!formData.jobCost || formData.jobCost.trim() === '') {
      newErrors.jobCost = 'Job Cost is required'
    } else {
      const jobCost = parseFloat(formData.jobCost)
      if (isNaN(jobCost)) {
        newErrors.jobCost = 'Job Cost must be a valid number'
      } else if (jobCost <= 0) {
      newErrors.jobCost = 'Job Cost must be greater than 0'
      } else if (jobCost > 10000000) {
        newErrors.jobCost = 'Job Cost seems unusually high (>$10M)'
      } else if (parseFloat(formData.retailPrice) > 0 && jobCost >= parseFloat(formData.retailPrice)) {
        newErrors.jobCost = 'Job Cost should be less than Retail Price'
      }
    }

    // Royalty Rate validation
    const royaltyRate = parseFloat(formData.royaltyRate)
    if (isNaN(royaltyRate)) {
      newErrors.royaltyRate = 'Royalty Rate must be a valid number'
    } else if (royaltyRate < 0) {
      newErrors.royaltyRate = 'Royalty Rate must be 0 or greater'
    } else if (royaltyRate > 50) {
      newErrors.royaltyRate = 'Royalty Rate seems unusually high (>50%)'
    }

    // Division Variable Expenses validation
    const divisionVariableExpenses = parseFloat(formData.divisionVariableExpenses)
    if (isNaN(divisionVariableExpenses)) {
      newErrors.divisionVariableExpenses = 'Division Variable Expenses must be a valid number'
    } else if (divisionVariableExpenses < 0) {
      newErrors.divisionVariableExpenses = 'Division Variable Expenses must be 0 or greater'
    } else if (divisionVariableExpenses > 30) {
      newErrors.divisionVariableExpenses = 'Division Variable Expenses seems unusually high (>30%)'
    }

    // Division Fixed Expenses validation
    const divisionOverheads = parseFloat(formData.divisionOverheads)
    if (isNaN(divisionOverheads)) {
      newErrors.divisionOverheads = 'Division Fixed Expenses must be a valid number'
    } else if (divisionOverheads < 0) {
      newErrors.divisionOverheads = 'Division Fixed Expenses must be 0 or greater'
    } else if (divisionOverheads > 20) {
      newErrors.divisionOverheads = 'Division Fixed Expenses seems unusually high (>20%)'
    }

    // Company Overhead Costs validation
    const companyOverheads = parseFloat(formData.companyOverheads)
    if (isNaN(companyOverheads)) {
      newErrors.companyOverheads = 'Company Overhead Costs must be a valid number'
    } else if (companyOverheads < 0) {
      newErrors.companyOverheads = 'Company Overhead Costs must be 0 or greater'
    } else if (companyOverheads > 25) {
      newErrors.companyOverheads = 'Company Overhead Costs seems unusually high (>25%)'
    }
    
    // Target Net Profit validation
    const targetNetProfit = parseFloat(formData.targetNetProfit)
    if (isNaN(targetNetProfit)) {
      newErrors.targetNetProfit = 'Target Net Profit must be a valid number'
    } else if (targetNetProfit < 0) {
      newErrors.targetNetProfit = 'Target Net Profit must be 0 or greater'
    } else if (targetNetProfit > 50) {
      newErrors.targetNetProfit = 'Target Net Profit seems unusually high (>50%)'
    }
    
    console.log('Validation errors:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      calculateResults()
      setIsCalculated(true)
      
      // Scroll to results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  const handleSaveJob = () => {
    // Check if calculation fields are valid and results are calculated
    const isCalculationValid = validateForm()
    console.log('Calculation validation result:', isCalculationValid)
    console.log('Form data:', formData)
    console.log('Is calculated:', isCalculated)
    
    if (!isCalculationValid) {
      alert('Please fill in all required calculation fields and calculate results before saving.')
      return
    }

    if (!isCalculated) {
      alert('Please calculate results before saving the job.')
      return
    }

    // Check if job name is provided (required for saving to history)
    const jobNameInput = document.getElementById('jobName')
    const jobName = jobNameInput ? jobNameInput.value.trim() : ''
    
    if (!jobName) {
      alert('Please enter a Job Name or Number to save this job to history.')
      return
    }

    // Get optional field values directly from DOM
    const clientNameInput = document.getElementById('clientName')
    const divisionInput = document.getElementById('division')
    
    // Prepare job data to save
    const jobData = {
      ...formData,
      jobName: jobName,
      clientName: clientNameInput ? clientNameInput.value : '',
      division: divisionInput ? divisionInput.value : '',
      results: results,
      timestamp: new Date().toISOString()
    }

    // Call the onAddJob function passed from App component
    if (onAddJob) {
      onAddJob(jobData)
      alert('Job saved successfully!')
    }
  }

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    // Get current form data and results
    const jobNameInput = document.getElementById('jobName')
    const clientNameInput = document.getElementById('clientName')
    const divisionInput = document.getElementById('division')
    
    const jobName = jobNameInput ? jobNameInput.value.trim() : 'Unnamed Job'
    const clientName = clientNameInput ? clientNameInput.value.trim() : ''
    const division = divisionInput ? divisionInput.value.trim() : ''
    
    // Create print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Report - ${jobName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0; 
              padding: 15px; 
              line-height: 1.4;
              color: #000;
              font-size: 12px;
              background: white;
            }
            .header-top {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 12px;
            }
            .date-time {
              font-size: 12px;
              color: #000;
            }
            .job-report-title {
              font-size: 12px;
              color: #000;
              font-weight: bold;
            }
            .logo-section {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            .logo-image {
              height: 50px;
              width: auto;
              margin-right: 12px;
            }
            .main-title {
              text-align: center;
              margin: 15px 0;
            }
            .job-number {
              font-size: 20px;
              font-weight: bold;
              color: #000;
              margin-bottom: 5px;
            }
            .profitability-report {
              font-size: 16px;
              font-weight: bold;
              color: #000;
              margin-bottom: 5px;
            }
            .generated-date {
              font-size: 11px;
              color: #000;
            }
            .separator {
              border-bottom: 1px solid #63D43E;
              margin: 15px 0;
            }
            .section { 
              margin-bottom: 15px;
            }
            .section h2 { 
              color: #63D43E; 
              border-bottom: 1px solid #63D43E; 
              padding-bottom: 5px; 
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: bold;
            }
            .field { 
              display: flex;
              justify-content: space-between;
              margin: 6px 0; 
              padding: 3px 0; 
            }
            .field-label { 
              font-weight: normal; 
              color: #000;
              flex: 1;
              font-size: 11px;
            }
            .field-value { 
              font-weight: normal;
              color: #000;
              text-align: right;
              flex: 1;
              font-size: 11px;
            }
            .status-excellent { color: #16a34a; }
            .status-good { color: #16a34a; }
            .status-neutral { color: #000; }
            .status-thin { color: #dc2626; }
            .status-poor { color: #dc2626; }
            .status-loss { color: #dc2626; }
            .status-indicator {
              font-size: 11px;
              font-weight: bold;
              color: #dc2626;
              margin: 6px 0;
            }
            .negative-value {
              color: #dc2626;
            }
            .below-target {
              color: #dc2626;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
              color: #666;
            }
            .copyright {
              font-size: 10px;
              color: #666;
            }
            .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .compact-section {
              margin-bottom: 8px;
            }
            @media print { 
              body { margin: 0; padding: 12px; font-size: 11px; }
              .section { page-break-inside: avoid; margin-bottom: 12px; }
              .field { margin: 4px 0; padding: 2px 0; }
              .logo-image { height: 45px; }
            }
          </style>
        </head>
        <body>
          <div class="logo-section">
            <img src="/logo.svg" alt="Company Logo" class="logo-image" 
                 onerror="this.onerror=null; this.src='/logo.png.png'; this.style.display='none';" />
            </div>
            
          <div class="main-title">
            <div class="job-number">Job #: ${jobName}</div>
            <div class="profitability-report">Profitability Report</div>
          </div>

          <div class="separator"></div>
          
          <div class="section">
            <h2>Job Details</h2>
            <div class="field">
              <span class="field-label">Job Name:</span>
              <span class="field-value">${jobName || ''}</span>
            </div>
            <div class="field">
              <span class="field-label">Insurance Carrier:</span>
              <span class="field-value">${clientName || 'N/A'}</span>
          </div>
            <div class="field">
              <span class="field-label">Retail Price:</span>
              <span class="field-value">${formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Job Cost:</span>
              <span class="field-value">${formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Target Net Margin:</span>
              <span class="field-value">${formatPercentage(parseFloat(formData.targetNetProfit) || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Target Gross Margin:</span>
              <span class="field-value">${formatPercentage(results.yourProfitMargin || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Overhead Cost (%):</span>
              <span class="field-value">${formatPercentage((parseFloat(formData.divisionOverheads) || 0) + (parseFloat(formData.companyOverheads) || 0))}</span>
            </div>
            <div class="field">
              <span class="field-label">Break-Even %:</span>
              <span class="field-value">${formatPercentage(results.divisionTotalBreakEven || 0)}</span>
            </div>
          </div>

          <div class="section">
            <h2>Profitability Results</h2>
            <div class="field">
              <span class="field-label">Profitability Status:</span>
              <span class="field-value status-${results.profitabilityStatus || 'neutral'}">
                ${results.profitabilityStatus === 'excellent' ? 'JACKPOT - ABOVE TARGET PROFIT!' :
                  results.profitabilityStatus === 'good' ? 'YOU\'RE WINNING!' :
                  results.profitabilityStatus === 'neutral' ? 'GREAT JOB YOU\'RE AT TARGET!' :
                  results.profitabilityStatus === 'thin' ? 'WARNING! YOU\'RE CUTTING INTO PROFITS' :
                  results.profitabilityStatus === 'poor' ? 'EXTREME WARNING! YOU\'RE ALMOST PAYING FOR THE JOB' :
                  'STOP - DON\'T PAY TO DO THE WORK!!'}
              </span>
            </div>
            <div class="field">
              <span class="field-label">Sales $:</span>
              <span class="field-value">${formatCurrency(results.yourPrice || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">COGS $:</span>
              <span class="field-value">${formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">COGS %:</span>
              <span class="field-value">${formatPercentage(results.jobCostPercent || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Gross Profit $:</span>
              <span class="field-value">${formatCurrency(results.grossProfit || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Contribution Margin %:</span>
              <span class="field-value">${formatPercentage(results.yourProfitMargin || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Mark-up %:</span>
              <span class="field-value">${formatPercentage(results.actualMarkup || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Variable Costs $:</span>
              <span class="field-value">${formatCurrency(results.divisionVariableExpensesDollars || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Fixed Costs $:</span>
              <span class="field-value">${formatCurrency(results.companyOverheadsDollars || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Controllable Margin $:</span>
              <span class="field-value ${(results.controllableMargin || 0) < 0 ? 'negative-value' : ''}">${formatCurrency(results.controllableMargin || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Royalty $:</span>
              <span class="field-value">${formatCurrency(results.royaltyDollars || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Operating Profit $:</span>
              <span class="field-value ${(results.operatingIncome || 0) < 0 ? 'negative-value' : ''}">${formatCurrency(results.operatingIncome || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Break Even Price $:</span>
              <span class="field-value">${formatCurrency(results.breakEvenPrice || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Total Break-Even %:</span>
              <span class="field-value">${formatPercentage(results.divisionTotalBreakEven || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Required Price $:</span>
              <span class="field-value">${formatCurrency(results.requiredPrice || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Required Margin %:</span>
              <span class="field-value">${formatPercentage(results.requiredMargin || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Your Price $:</span>
              <span class="field-value">${formatCurrency(results.yourPrice || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">Your Profit Margin %:</span>
              <span class="field-value">${formatPercentage(results.yourProfitMargin || 0)}</span>
            </div>
            <div class="field">
              <span class="field-label">You are currently at:</span>
              <span class="field-value ${results.thisJobIs < 0 ? 'below-target' : ''}">${formatPercentage(results.thisJobIs || 0)} (${results.thisJobIs > 1 ? 'Above Target' : results.thisJobIs < -1 ? 'Below Target' : 'On Target'})</span>
            </div>
            <div class="field">
              <span class="field-label">Which is:</span>
              <span class="field-value ${results.yourJob < 0 ? 'below-target' : ''}">${formatCurrency(results.yourJob || 0)} (${results.yourJob > 200 ? 'Above Target' : results.yourJob < -200 ? 'Below Target' : 'On Target'})</span>
            </div>
          </div>

          <div class="footer">
            <div>Generated by Restoration Profitability Calculator</div>
            <div class="copyright">© 2024 All rights reserved</div>
          </div>
        </body>
      </html>
    `
    
    // Write content to print window
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    printWindow.onload = () => {
    printWindow.print()
      printWindow.close()
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let processedValue = value
    
    // Auto-format currency inputs
    if (name === 'retailPrice' || name === 'jobCost') {
      // Remove non-numeric characters except decimal point
      processedValue = value.replace(/[^0-9.]/g, '')
      // Ensure only one decimal point
      const parts = processedValue.split('.')
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('')
      }
    }
    
    // Auto-format percentage inputs
    if (name === 'royaltyRate' || name === 'divisionVariableExpenses' || 
        name === 'divisionOverheads' || name === 'companyOverheads' || 
        name === 'targetNetProfit') {
      // Remove non-numeric characters except decimal point
      processedValue = value.replace(/[^0-9.]/g, '')
      // Ensure only one decimal point
      const parts = processedValue.split('.')
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('')
      }
      // Limit to 2 decimal places
      if (processedValue.includes('.')) {
        const [integer, decimal] = processedValue.split('.')
        if (decimal && decimal.length > 2) {
          processedValue = integer + '.' + decimal.substring(0, 2)
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }


  const resetForm = () => {
    setFormData({
      retailPrice: '',
      jobCost: '',
      royaltyRate: '',
      divisionVariableExpenses: '',
      divisionOverheads: '5.00',
      companyOverheads: '10.00',
      targetNetProfit: '30.00'
    })
    setResults({
      grossProfit: 0,
      divisionVariableExpensesDollars: 0,
      divisionOverheadsDollars: 0,
      royaltyDollars: 0,
      contributionMargin: 0,
      controllableMargin: 0,
      companyOverheadsDollars: 0,
      operatingIncome: 0,
      actualNetProfit: 0,
      yourPrice: 0,
      yourProfitMargin: 0,
      divisionTotalBreakEven: 0,
      breakEvenPrice: 0,
      requiredMargin: 0,
      requiredPrice: 0,
      thisJobIs: 0,
      yourJob: 0,
      profitabilityStatus: 'neutral',
      coversOverhead: false,
      jobCostPercent: 0,
      actualMarkup: 0
    })
    setErrors({})
    setIsCalculated(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="w-full px-4">
        {/* Main Layout - Two Column Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
    <div className="space-y-6">
          {/* Quick Tips */}
            <div className="border rounded-lg p-6" style={{backgroundColor: '#e0f5d9', borderColor: '#CCF5BC'}}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#1F1F1F'}}>
              <span className="text-yellow-500">💡</span>
              Quick Tips
            </h2>
            <ul className="space-y-2" style={{color: '#1F1F1F'}}>
            <li>• Set your company's break-even percentage first</li>
            <li>• Target margins should be above break-even</li>
            <li>• Use the reference table to convert margin to markup</li>
            <li>• Save jobs to track trends over time</li>
            <li>• Print this page for your records</li>
              <li>• Review status indicators for job profitability</li>
          </ul>
        </div>
        
          {/* Job Calculator */}
            <div className="bg-white rounded-lg shadow-lg p-6" style={{borderColor: '#63D43E', borderWidth: '2px', borderStyle: 'solid'}} data-calculator-section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <img src="/Calculator.png" alt="Calculator" className="w-6 h-6" />
          Job Calculator
          </h2>
          
              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Section 1: JOB DETAILS */}
            <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-900 ">
                    JOB DETAILS
                  </h3>
                  
                  <div className="space-y-2">
              <div>
                      <label htmlFor="jobName" className="block text-sm font-medium text-neutral-700  mb-1">
                Job Name or Number *
                </label>
                <input
                  type="text"
                  id="jobName"
                  name="jobName"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500   "
                placeholder="Enter job name or number"
                />
              </div>

              <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-neutral-700  mb-1">
                Insurance Carrier or Client Name
                </label>
                <input
                  type="text"
                        id="clientName"
                        name="clientName"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500   "
                placeholder="Enter carrier or client name"
                />
              </div>

              <div>
                      <label htmlFor="division" className="block text-sm font-medium text-neutral-700  mb-1">
                Division
                </label>
                <input
                  type="text"
                  id="division"
                  name="division"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500   "
                  placeholder="Enter division name"
                />
              </div>

              <div>
                      <label htmlFor="retailPrice" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                  Retail Price / Charge Out $ *
                  <div className="relative group">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                      The total amount you charge the customer for this job. This is your revenue before any costs are deducted.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  id="retailPrice"
                  name="retailPrice"
                  value={formData.retailPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                          errors.retailPrice 
                            ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                            : 'border-neutral-300 focus:ring-blue-500'
                        }`}
                placeholder="Enter your job Retail Price/Charge Out ($)"
                />
                {errors.retailPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.retailPrice}</p>
                )}
              </div>

              <div>
                      <label htmlFor="jobCost" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                Job Cost / COGS $ *
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Direct costs to complete the job: materials, labor, equipment, subcontractors. This is your Cost of Goods Sold (COGS).
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
                </label>
                <input
                  type="number"
                  id="jobCost"
                  name="jobCost"
                  value={formData.jobCost}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                          errors.jobCost 
                            ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                            : 'border-neutral-300 focus:ring-blue-500'
                        }`}
                placeholder="Enter your job Cost / COGS ($)"
                />
                {errors.jobCost && (
                        <p className="mt-1 text-sm text-red-600">{errors.jobCost}</p>
                )}
                    </div>
              </div>
            </div>

                {/* Section 2: OVERHEAD COSTS */}
            <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-900 ">
                    OVERHEAD COSTS
                  </h3>
                  
                  <div className="space-y-2">
              <div>
                      <label htmlFor="royaltyRate" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                Royalty Rate % *
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Percentage of revenue paid to franchisor, brand, or licensing fees. Enter 0 if you don't pay any royalties or fees.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
                </label>
                <input
                  type="number"
                  id="royaltyRate"
                  name="royaltyRate"
                  value={formData.royaltyRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.royaltyRate ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="Enter 0 if you don't pay fees"
                />
              {errors.royaltyRate && (
                        <p className="mt-1 text-sm text-red-600">{errors.royaltyRate}</p>
              )}
              </div>

              <div>
                      <label htmlFor="divisionVariableExpenses" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                        Division Variable Expenses % *
                        <div className="relative group">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                            Variable costs that change with job volume: fuel, vehicle maintenance, job-specific supplies, temporary labor.
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </label>
                      <input
                        type="number"
                        id="divisionVariableExpenses"
                        name="divisionVariableExpenses"
                        value={formData.divisionVariableExpenses}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.divisionVariableExpenses ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="Enter your Division Variable Expenses (%)"
                      />
                      {errors.divisionVariableExpenses && (
                        <p className="mt-1 text-sm text-red-600">{errors.divisionVariableExpenses}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="divisionOverheads" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                        Division Fixed Expenses % *
                        <div className="relative group">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                            Fixed costs for your division: rent, utilities, insurance, equipment leases, permanent staff salaries.
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                </label>
                <input
                  type="number"
                  id="divisionOverheads"
                  name="divisionOverheads"
                  value={formData.divisionOverheads}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.divisionOverheads ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="Enter your Division Fixed Expenses (%)"
                />
                {errors.divisionOverheads && (
                        <p className="mt-1 text-sm text-red-600">{errors.divisionOverheads}</p>
                )}
              </div>

              <div>
                      <label htmlFor="companyOverheads" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                  Company Overhead Costs % *
                  <div className="relative group">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                      Corporate overhead costs: administrative staff, office rent, accounting, legal, marketing, executive salaries.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  id="companyOverheads"
                  name="companyOverheads"
                  value={formData.companyOverheads}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.companyOverheads ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="Enter your Company Overhead Costs (%)"
                />
                {errors.companyOverheads && (
                        <p className="mt-1 text-sm text-red-600">{errors.companyOverheads}</p>
                )}
                    </div>
              </div>
            </div>

                {/* Section 3: TARGET PROFIT */}
            <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-900 ">
                    TARGET PROFIT
                  </h3>
                  
                  <div className="space-y-2">
              <div>
                      <label htmlFor="targetNetProfit" className="block text-sm font-medium text-neutral-700  mb-1 flex items-center gap-2">
                  Target Operating Profit % *
                  <div className="relative group">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                      Your desired profit margin percentage. This is the minimum profit you want to achieve on each job to meet business goals.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                id="targetNetProfit"
                name="targetNetProfit"
                value={formData.targetNetProfit}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.targetNetProfit ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="Enter a % that represents your Target Operating Profit"
                />
              {errors.targetNetProfit && (
                        <p className="mt-1 text-sm text-red-600">{errors.targetNetProfit}</p>
                )}
                    </div>
              </div>
            </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
              <button
                    type="button"
                    onClick={handleSaveJob}
                    className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    style={{backgroundColor: '#63D43E', borderColor: '#63D43E', color: '#1F1F1F', borderWidth: '1px', borderStyle: 'solid'}}
              >
                    <span>💾</span>
                    Save Job
              </button>
          <button
            type="button"
            onClick={handlePrint}
                    className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    style={{backgroundColor: '#EBE6E3', borderColor: '#EBE6E3', color: '#1F1F1F', borderWidth: '1px', borderStyle: 'solid'}}
          >
                    <span>🖨️</span>
                    Print
          </button>
            </div>
          </form>
          
          {/* Additional padding to match Results box height */}
          <div className="pt-8"></div>
            </div>
        </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Indicators */}
            <div className="rounded-lg p-6" style={{backgroundColor: '#F9F9F8', borderColor: '#E4E4E3', borderWidth: '1px', borderStyle: 'solid'}}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#1F1F1F'}}>
                <span style={{color: '#1F1F1F'}}>🔍</span>
                Status Indicators
              </h2>
              <div style={{color: '#1F1F1F'}}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm"><strong>Jackpot! Above Target Profit</strong></span>
                    </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-sm"><strong>You're Winning!</strong></span>
                  </div>
                <div className="flex items-center gap-2">
                  <img src="/profitable-restorer-emblem.png.png" alt="Profitable Restorer" className="w-6 h-8 flex-shrink-0" />
                  <span className="text-sm"><strong>Great Job You are a Profitable Restorer!</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="text-sm"><strong>Warning! You're Cutting Into Profits</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  <span className="text-sm"><strong>EXTREME WARNING! You're Almost Paying For The Job</strong></span>
              </div>
                <div className="flex items-center gap-2 -mb-2">
                  <span className="text-2xl">⛔</span>
                  <span className="text-sm"><strong>STOP! DON'T PAY TO DO THE WORK!</strong></span>
              </div>
              </div>
        </div>

          {/* Results */}
            <div className="bg-white  rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-neutral-900  mb-4 flex items-center gap-2">
              <span className="text-blue-600">💲</span>
              Results
              {isCalculated && (
                <span className="ml-2 text-lg font-semibold">
                  {results.profitabilityStatus === 'excellent' && '🏆 Jackpot! Above Target Profit'}
                  {results.profitabilityStatus === 'good' && '🎯 You\'re Winning!'}
                  {results.profitabilityStatus === 'neutral' && (
                    <span className="flex items-center gap-2">
                      <img src="/profitable-restorer-emblem.png.png" alt="Profitable Restorer" className="w-6 h-8 flex-shrink-0" />
                      Great Job You are a Profitable Restorer!
                    </span>
                  )}
                  {results.profitabilityStatus === 'thin' && '⚠️ Warning! You\'re Cutting Into Profits'}
                  {results.profitabilityStatus === 'poor' && '🚨 EXTREME WARNING! You\'re Almost Paying For The Job'}
                  {results.profitabilityStatus === 'loss' && '⛔ STOP! DON\'T PAY TO DO THE WORK!'}
                </span>
              )}
            </h2>
              
              <div className="space-y-2">
                {/* GROUP 1: Calculation Flow - with spacing */}
                <div className="mt-4">
                {/* Sales $ */}
                <div className="flex justify-between items-center p-2 border border-neutral-400 bg-neutral-100  rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Sales $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Total revenue from this job - the amount you charge the customer.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
              </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
              </div>

                {/* COGS $ */}
                <div className="flex justify-between items-center p-2 border border-red-500 bg-red-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">COGS $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Cost of Goods Sold - direct costs to complete the job (materials, labor, equipment).
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
            </div>

                {/* COGS % */}
                <div className="flex justify-between items-center p-2 border border-red-500 bg-red-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">COGS %:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        COGS as a percentage of sales. Lower is better for profitability.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatPercentage(results.jobCostPercent)}</span>
            </div>

                {/* Actual Gross Profit Margin % */}
                <div className="flex justify-between items-center p-2 border border-green-500 bg-green-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Actual Gross Profit Margin %:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Your actual profit margin: (Sales - COGS) ÷ Sales × 100. Higher is better.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatPercentage(results.yourProfitMargin)}</span>
            </div>
            
                {/* Actual Mark-up % */}
                <div className="flex justify-between items-center p-2 border border-green-500 bg-green-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Actual Mark-up %:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Mark-up percentage: (Sales - COGS) ÷ COGS × 100. Shows profit as % of cost.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatPercentage(results.actualMarkup)}</span>
            </div>

                {/* Actual Gross Profit $ */}
                <div className="flex justify-between items-center p-2 border border-green-500 bg-green-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Actual Gross Profit $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Gross profit amount: Sales minus COGS. This is your profit before overhead costs.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
              </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.grossProfit)}</span>
              </div>

                {/* Division Variable Expenses $ */}
                <div className="flex justify-between items-center p-2 border border-red-500 bg-red-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Variable Expenses $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Variable expenses for this job: fuel, vehicle maintenance, job-specific supplies, temporary labor.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.divisionVariableExpensesDollars)}</span>
            </div>

                {/* Royalty $ */}
                <div className="flex justify-between items-center p-2 border border-red-500 bg-red-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Royalty $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Royalty or franchise fees paid on this job based on your royalty rate percentage.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.royaltyDollars)}</span>
            </div>

                {/* Division Contribution Margin $ */}
                <div className="flex justify-between items-center p-2 border border-green-500 bg-green-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Contribution Margin $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Gross profit minus variable expenses and royalties. Shows contribution to fixed costs.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.contributionMargin)}</span>
            </div>

                {/* Division Fixed Expenses $ */}
                <div className="flex justify-between items-center p-2 border border-red-500 bg-red-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Fixed Expenses $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Fixed division expenses allocated to this job: rent, utilities, insurance, equipment leases, permanent staff.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.divisionOverheadsDollars)}</span>
            </div>

                {/* Division Controllable Margin $ */}
                <div className="flex justify-between items-center p-2 border border-green-500 bg-green-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Controllable Margin $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Profit after all division costs (variable, fixed, royalties). What division controls.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.controllableMargin)}</span>
            </div>

                {/* Company Overhead Costs $ */}
                <div className="flex justify-between items-center p-2 border border-red-500 bg-red-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Company Overhead Costs $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Corporate overhead allocated to this job: admin staff, office rent, accounting, legal, marketing.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.companyOverheadsDollars)}</span>
                </div>
            </div>

                {/* GROUP 2: Net Profit - with increased spacing */}
                <div className="mt-6 mb-6">
                {/* Operating Income $ */}
                <div className="flex justify-between items-center p-2 border border-green-500 bg-green-50 rounded-lg mb-1" style={{borderWidth: '0.5px'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700" style={{fontWeight: 'bold'}}>Operating Income $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Final profit after all costs: gross profit minus all expenses and overhead. Your net operating income.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm" style={{fontWeight: 'bold'}}>{formatCurrency(results.actualNetProfit)}</span>
              </div>
            </div>

                {/* GROUP 3: Break-Even and Target Analysis - with spacing */}
                <div className="mt-4">
                {/* Break Even Price $ */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Break Even Price $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Minimum price needed to cover all costs with zero profit. Break-even point.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.breakEvenPrice)}</span>
            </div>
            
                {/* Division Total Break-Even % */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Total Break-Even %:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Total percentage of sales needed to cover all division costs (COGS + variable + fixed + royalties).
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatPercentage(results.divisionTotalBreakEven)}</span>
              </div>

                {/* Required Price $ */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Required Price $:</span>
                    <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Price needed to achieve your target profit margin. Minimum price for target profitability.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.requiredPrice)}</span>
            </div>

                {/* Required Margin % */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Required Margin %:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Profit margin percentage needed to achieve your target profit. Based on required price.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatPercentage(results.requiredMargin)}</span>
            </div>

                {/* Your Price $ */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Your Price $:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Your actual selling price for this job (same as Retail Price).
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.yourPrice)}</span>
              </div>

                {/* Your Profit Margin is % */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Your Profit Margin is %:</span>
                    <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Your actual profit margin: (Sales - COGS) divided by Sales times 100. Your current performance.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.yourProfitMargin)}</span>
            </div>

                {/* You are currently at */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">You are currently at:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        How much above or below your target profit margin. Positive = above target, negative = below target.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${
                      results.thisJobIs > 1 ? 'text-green-600' : // Above target (positive means above)
                      results.thisJobIs < -1 ? 'text-red-600' : // Below target (negative means below)
                      'text-neutral-800' // On target (within 1%) or default black
                    }`}>{formatPercentage(results.thisJobIs)}</span>
                    <span className={`text-xs font-medium ${
                      results.thisJobIs > 1 ? 'text-green-600' : // Above target (positive means above)
                      results.thisJobIs < -1 ? 'text-red-600' : // Below target (negative means below)
                      'text-neutral-800' // On target (within 1%)
                    }`}>
                      ({results.thisJobIs > 1 ? 'above target' : 
                        results.thisJobIs < -1 ? 'below target' : 
                        'on target'})
                  </span>
              </div>
            </div>

                {/* Which is */}
                <div className="flex justify-between items-center p-2 border border-neutral-300 bg-white  rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Which is:</span>
                <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-xs cursor-help">i</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                        Dollar amount above or below your required price. Positive = above target, negative = below target.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${
                      results.yourJob > 200 ? 'text-green-600' : // Above target (positive means above)
                      results.yourJob < -200 ? 'text-red-600' : // Below target (negative means below)
                      'text-neutral-800' // On target (within $200) or default black
                    }`}>{formatCurrency(results.yourJob)}</span>
                    <span className={`text-xs font-medium ${
                      results.yourJob > 200 ? 'text-green-600' : // Above target (positive means above)
                      results.yourJob < -200 ? 'text-red-600' : // Below target (negative means below)
                      'text-neutral-800' // On target (within $200)
                    }`}>
                      ({results.yourJob > 200 ? 'above target' : 
                        results.yourJob < -200 ? 'below target' : 
                        'on target'})
                  </span>
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

export default Calculator

