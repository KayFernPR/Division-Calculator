import React, { useState, useEffect, useRef } from 'react'

const Calculator = () => {
  const [formData, setFormData] = useState({
    retailPrice: '',
    jobCost: '',
    royaltyRate: '',
    divisionOverheads: '5.00',
    companyOverheads: '10.00',
    targetNetProfit: '30.00',
    interestTaxesDepreciationAmortization: ''
  })

  const [results, setResults] = useState({
    grossProfit: 0,
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
      const divisionOverheads = parseFloat(formData.divisionOverheads) || 0
      const companyOverheads = parseFloat(formData.companyOverheads) || 0
    const targetNetProfit = parseFloat(formData.targetNetProfit) || 0
    const interestTaxesDepreciationAmortization = parseFloat(formData.interestTaxesDepreciationAmortization) || 0

    // Calculation flow
    const grossProfit = retailPrice - jobCost
      const divisionOverheadsDollars = retailPrice * (divisionOverheads / 100)
    const royaltyDollars = retailPrice * (royaltyRate / 100)
    const contributionMargin = grossProfit - divisionOverheadsDollars - royaltyDollars
    const controllableMargin = contributionMargin
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

    if (!formData.divisionOverheads || parseFloat(formData.divisionOverheads) < 0) {
      newErrors.divisionOverheads = 'Division Overhead Costs must be 0 or greater'
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
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      divisionOverheads: '5.00',
      companyOverheads: '10.00',
      targetNetProfit: '30.00',
      interestTaxesDepreciationAmortization: ''
    })
    setResults({
      grossProfit: 0,
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 text-center">
          Restoration Division: Profitability Calculator
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 text-center">
          Calculate job profitability, track margins, and visualize trends for restoration contractors
        </p>
        
        {/* Navigation Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-1">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md">
              <span>🧮</span>
              Calculator
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md">
              <span>📄</span>
              History
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md">
              <span>📊</span>
              Charts
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md">
              <span>📋</span>
              Reference
            </button>
            </div>
          </div>

        {/* Quick Tips and Status Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">💡</span>
              Quick Tips
            </h2>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Set your company's break-even percentage first</li>
            <li>• Target margins should be above break-even</li>
            <li>• Use the reference table to convert margin to markup</li>
            <li>• Save jobs to track trends over time</li>
          </ul>
        </div>
        
          {/* Status Indicators */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
              <span className="text-red-500">📈</span>
              Status Indicators
            </h2>
            <div className="space-y-3 text-red-800 dark:text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
                <span className="text-sm"><strong>5% or More — Above Target Profit - Jackpot</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
                <span className="text-sm"><strong>0 - 5% — You're Winning</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
                <span className="text-sm"><strong>0 At Margin — Great Job You're At Target</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
                <span className="text-sm"><strong>0 to (Net Profit)% — Warning — You're Cutting Into Profits</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚨</span>
                <span className="text-sm"><strong>0 to (Net profit/2) — EXTREME WARNING — You're Almost Paying For The Job</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛔</span>
                <span className="text-sm"><strong>0 - net profit (negative) — Below Break-Even - STOP - DON'T PAY TO DO THE WORK</strong></span>
            </div>
          </div>
        </div>
      </div>

        {/* Calculator and Results */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Panel - Job Calculator */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-green-600">🧮</span>
          Job Calculator
          </h2>
          
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: JOB DETAILS */}
            <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    JOB DETAILS
                  </h3>
                  
                  <div className="space-y-4">
              <div>
                      <label htmlFor="jobName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Job Name or Number *
                </label>
                <input
                  type="text"
                  id="jobName"
                  name="jobName"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                placeholder="Enter job name or number"
                />
              </div>

              <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Insurance Carrier or Client Name (Optional)
                </label>
                <input
                  type="text"
                        id="clientName"
                        name="clientName"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                placeholder="Enter carrier or client name"
                />
              </div>

              <div>
                      <label htmlFor="division" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Division (Optional)
                </label>
                <input
                  type="text"
                  id="division"
                  name="division"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  placeholder="Enter division name"
                />
              </div>

              <div>
                      <label htmlFor="retailPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                          errors.retailPrice ? 'border-red-500' : 'border-neutral-300'
                        }`}
                placeholder="10,400.00"
                />
                {errors.retailPrice && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.retailPrice}</p>
                )}
              </div>

              <div>
                      <label htmlFor="jobCost" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
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
            <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    OVERHEAD COSTS
                  </h3>
                  
                  <div className="space-y-4">
              <div>
                      <label htmlFor="royaltyRate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                          errors.royaltyRate ? 'border-red-500' : 'border-neutral-300'
                        }`}
                  placeholder="Enter 0 if you don't pay fees"
                />
              {errors.royaltyRate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.royaltyRate}</p>
              )}
              </div>

                    <div>
                      <label htmlFor="divisionOverheads" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                          errors.divisionOverheads ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="5.00"
                      />
                      {errors.divisionOverheads && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.divisionOverheads}</p>
                      )}
                    </div>

              <div>
                      <label htmlFor="companyOverheads" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
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
            <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    TARGET PROFIT
                  </h3>
                  
                  <div className="space-y-4">
              <div>
                      <label htmlFor="targetNetProfit" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
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
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                    <span>💾</span>
                    Save Job
              </button>
          <button
            type="button"
                    className="flex-1 bg-neutral-500 text-white py-2 px-4 rounded-md hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
                    <span>🖨️</span>
                    Print
          </button>
            </div>
          </form>
        </div>

            {/* Right Panel - Results */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                RESULTS
              </h2>
              
              <div className="space-y-3">
                {/* Sales $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sales $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(parseFloat(formData.retailPrice) || 0)}</span>
                </div>

                {/* COGS $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">COGS $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(parseFloat(formData.jobCost) || 0)}</span>
                </div>

                {/* COGS % */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">COGS %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.jobCostPercent)}</span>
                </div>

                {/* Division Overhead Costs $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Division Overhead Costs $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.divisionOverheadsDollars)}</span>
                </div>

                {/* Company Overhead Costs $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Company Overhead Costs $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.companyOverheadsDollars)}</span>
                </div>

                {/* Royalty $ */}
                <div className="flex justify-between items-center p-3 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Royalty $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.royaltyDollars)}</span>
                </div>

                {/* Actual Contribution Margin % */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Actual Contribution Margin %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.yourProfitMargin)}</span>
                </div>

                {/* Actual Mark-up % */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Actual Mark-up %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.actualMarkup)}</span>
                </div>

                {/* Contribution Margin $ */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Contribution Margin $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.contributionMargin)}</span>
                </div>

                {/* Total Controllable Margin $ */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Total Controllable Margin $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.controllableMargin)}</span>
                </div>

                {/* Actual Net Profit $ */}
                <div className="flex justify-between items-center p-3 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Actual Net Profit $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.actualNetProfit)}</span>
                </div>

                {/* Break Even Price $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Break Even Price $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.breakEvenPrice)}</span>
                </div>

                {/* Division Total Break-Even % */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Division Total Break-Even %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.divisionTotalBreakEven)}</span>
                </div>

                {/* Required Price $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Required Price $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.requiredPrice)}</span>
                </div>

                {/* Required Margin % */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Required Margin %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.requiredMargin)}</span>
                </div>

                {/* Your Price $ */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Your Price $:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.yourPrice)}</span>
                </div>

                {/* Your Profit Margin is % */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Your Profit Margin is %:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.yourProfitMargin)}</span>
                </div>

                {/* You are currently at */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">You are currently at:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatPercentage(results.thisJobIs)}</span>
                </div>

                {/* Which is */}
                <div className="flex justify-between items-center p-3 border border-neutral-300 bg-white dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Which is:</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">i</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(results.yourJob)}</span>
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