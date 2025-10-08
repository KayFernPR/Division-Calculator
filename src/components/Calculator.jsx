import React, { useState, useEffect, useRef } from 'react'
import JobTemplates from './JobTemplates'

const Calculator = () => {
  const [formData, setFormData] = useState({
    retailPrice: '',
    jobCost: '',
    royaltyRate: '',
    divisionVariableExpenses: '',
    divisionOverheads: '5.00',
    companyOverheads: '10.00',
    targetNetProfit: '30.00',
    interestTaxesDepreciationAmortization: ''
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
    interestTaxesDepreciationAmortization: 0,
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
      case 'neutral': return '✅'
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
    const interestTaxesDepreciationAmortization = parseFloat(formData.interestTaxesDepreciationAmortization) || 0

    // Calculation flow
    const grossProfit = retailPrice - jobCost
    const divisionVariableExpensesDollars = retailPrice * (divisionVariableExpenses / 100)
      const divisionOverheadsDollars = retailPrice * (divisionOverheads / 100)
    const royaltyDollars = retailPrice * (royaltyRate / 100)
    const contributionMargin = grossProfit - divisionVariableExpensesDollars - royaltyDollars
    const controllableMargin = contributionMargin - divisionOverheadsDollars
      const companyOverheadsDollars = retailPrice * (companyOverheads / 100)
    const operatingIncome = controllableMargin - companyOverheadsDollars
    const actualNetProfit = operatingIncome - interestTaxesDepreciationAmortization

    // Break-even and target analysis
    const yourProfitMargin = retailPrice > 0 ? (contributionMargin / retailPrice) * 100 : 0
    const divisionTotalBreakEven = companyOverheads + royaltyRate + divisionOverheads
    const breakEvenPrice = jobCost / (1 - divisionTotalBreakEven / 100)
    const requiredMargin = companyOverheads + royaltyRate + divisionOverheads + targetNetProfit
    const requiredPrice = jobCost / (1 - requiredMargin / 100)
    const yourPrice = retailPrice
    const thisJobIs = requiredMargin - yourProfitMargin
      const yourJob = retailPrice - requiredPrice

    // Profitability status
      let profitabilityStatus = 'neutral'
    if (yourProfitMargin > requiredMargin + 5) profitabilityStatus = 'excellent'
    else if (yourProfitMargin > requiredMargin + 2) profitabilityStatus = 'good'
    else if (yourProfitMargin > requiredMargin - 2) profitabilityStatus = 'thin'
    else profitabilityStatus = 'poor'

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
      interestTaxesDepreciationAmortization,
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
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.retailPrice || parseFloat(formData.retailPrice) <= 0) {
      newErrors.retailPrice = 'Retail Price must be greater than 0'
    }

    if (!formData.jobCost || parseFloat(formData.jobCost) <= 0) {
      newErrors.jobCost = 'Job Cost must be greater than 0'
    }

    if (!formData.royaltyRate || parseFloat(formData.royaltyRate) < 0) {
      newErrors.royaltyRate = 'Royalty Rate must be 0 or greater'
    }

    if (!formData.divisionVariableExpenses || parseFloat(formData.divisionVariableExpenses) < 0) {
      newErrors.divisionVariableExpenses = 'Division Variable Expenses must be 0 or greater'
    }

    if (!formData.divisionOverheads || parseFloat(formData.divisionOverheads) < 0) {
      newErrors.divisionOverheads = 'Division Fixed Expenses must be 0 or greater'
    }

    if (!formData.companyOverheads || parseFloat(formData.companyOverheads) < 0) {
      newErrors.companyOverheads = 'Company Overhead Costs must be 0 or greater'
    }
    
    if (!formData.targetNetProfit || parseFloat(formData.targetNetProfit) < 0) {
      newErrors.targetNetProfit = 'Target Net Profit must be 0 or greater'
    }
    
    if (!formData.interestTaxesDepreciationAmortization || parseFloat(formData.interestTaxesDepreciationAmortization) < 0) {
      newErrors.interestTaxesDepreciationAmortization = 'Interest, Taxes, Depreciation, and Amortization must be 0 or greater'
    }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let processedValue = value
    
    // Auto-format currency inputs
    if (name === 'retailPrice' || name === 'jobCost' || name === 'interestTaxesDepreciationAmortization') {
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

  const applyTemplate = (templateValues) => {
    setFormData(prev => ({
      ...prev,
      ...templateValues
    }))
  }

  const resetForm = () => {
    setFormData({
      retailPrice: '',
      jobCost: '',
      royaltyRate: '',
      divisionVariableExpenses: '',
      divisionOverheads: '5.00',
      companyOverheads: '10.00',
      targetNetProfit: '30.00',
      interestTaxesDepreciationAmortization: ''
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
      interestTaxesDepreciationAmortization: 0,
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
          
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Section 1: JOB DETAILS */}
            <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-neutral-900 ">
                    JOB DETAILS
                  </h3>
                  
                  <div className="space-y-3">
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
                      <label htmlFor="retailPrice" className="block text-sm font-medium text-neutral-700  mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.retailPrice ? 'border-red-500' : 'border-neutral-300'
                        }`}
                placeholder="10,400.00"
                />
                {errors.retailPrice && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.retailPrice}</p>
                )}
              </div>

              <div>
                      <label htmlFor="jobCost" className="block text-sm font-medium text-neutral-700  mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.jobCost ? 'border-red-500' : 'border-neutral-300'
                        }`}
                placeholder="8,400.00"
                />
                {errors.jobCost && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobCost}</p>
                )}
                    </div>
              </div>
            </div>

                {/* Section 2: OVERHEAD COSTS */}
            <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-neutral-900 ">
                    OVERHEAD COSTS
                  </h3>
                  
                  <div className="space-y-3">
              <div>
                      <label htmlFor="royaltyRate" className="block text-sm font-medium text-neutral-700  mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.royaltyRate ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="Enter 0 if you don't pay fees"
                />
              {errors.royaltyRate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.royaltyRate}</p>
              )}
              </div>

              <div>
                      <label htmlFor="divisionVariableExpenses" className="block text-sm font-medium text-neutral-700  mb-1">
                        Division Variable Expenses % *
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
                        placeholder="0.00"
                      />
                      {errors.divisionVariableExpenses && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.divisionVariableExpenses}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="divisionOverheads" className="block text-sm font-medium text-neutral-700  mb-1">
                        Division Fixed Expenses % *
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
                  placeholder="5.00"
                />
                {errors.divisionOverheads && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.divisionOverheads}</p>
                )}
              </div>

              <div>
                      <label htmlFor="companyOverheads" className="block text-sm font-medium text-neutral-700  mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.companyOverheads ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="10.00"
                />
                {errors.companyOverheads && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyOverheads}</p>
                )}
                    </div>
              </div>
            </div>

                {/* Section 3: TARGET PROFIT */}
            <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-neutral-900 ">
                    TARGET PROFIT
                  </h3>
                  
                  <div className="space-y-3">
              <div>
                      <label htmlFor="targetNetProfit" className="block text-sm font-medium text-neutral-700  mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500    ${
                          errors.targetNetProfit ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="30.00"
                />
              {errors.targetNetProfit && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetNetProfit}</p>
                )}
                    </div>
              </div>
            </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
              <button
                    type="button"
                    className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    style={{backgroundColor: '#63D43E', borderColor: '#63D43E', color: '#1F1F1F', borderWidth: '1px', borderStyle: 'solid'}}
              >
                    <span>💾</span>
                    Save Job
              </button>
          <button
            type="button"
                    className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    style={{backgroundColor: '#EBE6E3', borderColor: '#EBE6E3', color: '#1F1F1F', borderWidth: '1px', borderStyle: 'solid'}}
          >
                    <span>🖨️</span>
                    Print
          </button>
            </div>
          </form>
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
                <span className="text-2xl">✅</span>
                  <span className="text-sm"><strong>Great Job You're At Target!</strong></span>
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
            </h2>
              
              <div className="space-y-2">
                {/* GROUP 1: Calculation Flow - with spacing */}
                <div className="mt-4">
                {/* Sales $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-400 bg-neutral-100  rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Sales $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                </div>
                  <span className="font-mono text-sm">{formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
              </div>

                {/* COGS $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">COGS $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
              </div>

                {/* COGS % */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">COGS %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.jobCostPercent)}</span>
            </div>

                {/* Actual Gross Profit Margin % */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Actual Gross Profit Margin %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.yourProfitMargin)}</span>
            </div>

                {/* Actual Mark-up % */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Actual Mark-up %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.actualMarkup)}</span>
            </div>
            
                {/* Actual Gross Profit $ */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Actual Gross Profit $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.contributionMargin)}</span>
            </div>

                {/* Division Variable Expenses $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Variable Expenses $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.divisionVariableExpensesDollars)}</span>
              </div>

                {/* Royalty $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Royalty $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.royaltyDollars)}</span>
            </div>

                {/* Division Controllable Margin $ */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Controllable Margin $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.controllableMargin)}</span>
            </div>

                {/* Division Fixed Expenses $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Fixed Expenses $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.divisionOverheadsDollars)}</span>
            </div>

                {/* Company Overhead Costs $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Company Overhead Costs $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.companyOverheadsDollars)}</span>
                </div>
            </div>

                {/* GROUP 2: Net Profit - with increased spacing */}
                <div className="mt-6 mb-6">
                {/* Actual Net Profit $ */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700" style={{fontWeight: 'bold'}}>Actual Net Profit $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm" style={{fontWeight: 'bold'}}>{formatCurrency(results.actualNetProfit)}</span>
                </div>
            </div>

                {/* GROUP 3: Break-Even and Target Analysis - with spacing */}
                <div className="mt-4">
                {/* Break Even Price $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Break Even Price $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.breakEvenPrice)}</span>
            </div>

                {/* Division Total Break-Even % */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Division Total Break-Even %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.divisionTotalBreakEven)}</span>
            </div>

                {/* Required Price $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Required Price $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.requiredPrice)}</span>
            </div>
            
                {/* Required Margin % */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Required Margin %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.requiredMargin)}</span>
            </div>

                {/* Your Price $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Your Price $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
              </div>
                  <span className="font-mono text-sm">{formatCurrency(results.yourPrice)}</span>
            </div>

                {/* Your Profit Margin is % */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Your Profit Margin is %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.yourProfitMargin)}</span>
            </div>

                {/* You are currently at */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">You are currently at:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                </div>
                  <span className="font-mono text-sm">{formatPercentage(results.thisJobIs)}</span>
            </div>

                {/* Which is */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white  rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 ">Which is:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600   text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.yourJob)}</span>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Job Templates */}
        <div className="mb-8">
          <JobTemplates onApplyTemplate={applyTemplate} />
        </div>
      </div>
    </div>
    </div>
  )
}

export default Calculator