import React, { useState, useEffect, useRef } from 'react'

const Calculator = () => {
  const [formData, setFormData] = useState({
    retailPrice: '',
    jobCost: '',
    royaltyRate: '',
    divisionVariableExpenses: '',
    divisionFixedExpenses: '',
    companyOverheads: '',
    targetNetProfit: '',
    interestTaxesDepreciationAmortization: ''
  })

  const [results, setResults] = useState({
    grossProfit: 0,
    divisionVariableExpensesDollars: 0,
    royaltyDollars: 0,
    contributionMargin: 0,
    divisionFixedExpensesDollars: 0,
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
      case 'excellent': return '🟢'
      case 'good': return '🟡'
      case 'thin': return '🟠'
      case 'poor': return '🔴'
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
    const divisionFixedExpenses = parseFloat(formData.divisionFixedExpenses) || 0
    const companyOverheads = parseFloat(formData.companyOverheads) || 0
    const targetNetProfit = parseFloat(formData.targetNetProfit) || 0
    const interestTaxesDepreciationAmortization = parseFloat(formData.interestTaxesDepreciationAmortization) || 0

    // Calculation flow
    const grossProfit = retailPrice - jobCost
    const divisionVariableExpensesDollars = retailPrice * (divisionVariableExpenses / 100)
    const royaltyDollars = retailPrice * (royaltyRate / 100)
    const contributionMargin = grossProfit - divisionVariableExpensesDollars - royaltyDollars
    const divisionFixedExpensesDollars = retailPrice * (divisionFixedExpenses / 100)
    const controllableMargin = contributionMargin - divisionFixedExpensesDollars
      const companyOverheadsDollars = retailPrice * (companyOverheads / 100)
    const operatingIncome = controllableMargin - companyOverheadsDollars
    const actualNetProfit = operatingIncome - interestTaxesDepreciationAmortization

    // Break-even and target analysis
    const yourProfitMargin = retailPrice > 0 ? (contributionMargin / retailPrice) * 100 : 0
    const divisionTotalBreakEven = companyOverheads + royaltyRate
    const breakEvenPrice = jobCost / (1 - divisionTotalBreakEven / 100)
    const requiredMargin = companyOverheads + royaltyRate + targetNetProfit
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
      royaltyDollars,
        contributionMargin,
      divisionFixedExpensesDollars,
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
    
    if (!formData.divisionFixedExpenses || parseFloat(formData.divisionFixedExpenses) < 0) {
      newErrors.divisionFixedExpenses = 'Division Fixed Expenses must be 0 or greater'
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
      divisionVariableExpenses: '',
      divisionFixedExpenses: '',
      companyOverheads: '',
      targetNetProfit: '',
      interestTaxesDepreciationAmortization: ''
    })
    setResults({
      grossProfit: 0,
      divisionVariableExpensesDollars: 0,
      royaltyDollars: 0,
      contributionMargin: 0,
      divisionFixedExpensesDollars: 0,
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
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
          Division Profitability Calculator
        </h1>
        
        {/* Section 1: Quick Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            💡 Quick Tips
          </h2>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Set your company's break-even percentage first</li>
            <li>• Target margins should be above break-even</li>
            <li>• Use the reference table to convert margin to markup</li>
            <li>• Save jobs to track trends over time</li>
            <li>• Print this page for your records or to include in your reports</li>
          </ul>
        </div>
        
        {/* Section 2: Status Indicators */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
            🚨 Status Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-yellow-800 dark:text-yellow-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-sm"><strong>Jackpot!</strong> — 5% or More Above Target Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="text-sm"><strong>You're Winning!</strong> — 0 - 5% Above Target Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm"><strong>Great Job! You're at Target!</strong> — Meeting target</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span className="text-sm"><strong>Warning - You're Cutting Into Profits!</strong> — Below target but profitable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚨</span>
              <span className="text-sm"><strong>EXTREME WARNING - You're Almost Paying For The Job</strong> — Near break-even</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛔</span>
              <span className="text-sm"><strong>STOP - DON'T PAY TO DO THE WORK!!</strong> — Significant loss</span>
          </div>
        </div>
      </div>

        {/* Section 3: Job Calculator */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🧮</span>
          Job Calculator
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group 1: Basic Job Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2">
                Group 1: Basic Job Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="retailPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Retail Price $ *
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
                    placeholder="0.00"
                />
                {errors.retailPrice && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.retailPrice}</p>
                )}
              </div>

              <div>
                  <label htmlFor="jobCost" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Job Cost $ *
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
                    placeholder="0.00"
                />
                {errors.jobCost && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobCost}</p>
                )}
                </div>
              </div>
            </div>

            {/* Group 2: Overhead Costs */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2">
                Group 2: Overhead Costs
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="0.00"
                />
              {errors.royaltyRate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.royaltyRate}</p>
              )}
              </div>

              <div>
                  <label htmlFor="divisionVariableExpenses" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                      errors.divisionVariableExpenses ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.divisionVariableExpenses && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.divisionVariableExpenses}</p>
                )}
              </div>

              <div>
                  <label htmlFor="divisionFixedExpenses" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Division Fixed Expenses % *
                  </label>
                  <input
                    type="number"
                    id="divisionFixedExpenses"
                    name="divisionFixedExpenses"
                    value={formData.divisionFixedExpenses}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                      errors.divisionFixedExpenses ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.divisionFixedExpenses && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.divisionFixedExpenses}</p>
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
                    placeholder="0.00"
                />
                {errors.companyOverheads && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyOverheads}</p>
                )}
                </div>
              </div>
            </div>

            {/* Group 3: Target Profit */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2">
                Group 3: Target Profit
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="targetNetProfit" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                      errors.targetNetProfit ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="0.00"
                />
              {errors.targetNetProfit && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetNetProfit}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="interestTaxesDepreciationAmortization" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Interest, Taxes, Depreciation, and Amortization $ *
                  </label>
                  <input
                    type="number"
                    id="interestTaxesDepreciationAmortization"
                    name="interestTaxesDepreciationAmortization"
                    value={formData.interestTaxesDepreciationAmortization}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${
                      errors.interestTaxesDepreciationAmortization ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.interestTaxesDepreciationAmortization && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.interestTaxesDepreciationAmortization}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Calculate Profitability
              </button>
          <button
            type="button"
                onClick={resetForm}
                className="flex-1 bg-neutral-600 text-white py-2 px-4 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
          >
                Reset Form
          </button>
            </div>
          </form>

        {/* Section 4: Results */}
        {isCalculated && (
          <div ref={resultsRef} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 text-center mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">📊</span>
              Results
            </h2>
              
              {/* GROUP 1: Calculation Flow */}
          <div className="space-y-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">GROUP 1: Calculation Flow</h3>
                
                {/* Sales $ */}
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

                {/* Cost of Goods Sold % */}
            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Cost of Goods Sold %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Cost of Goods Sold %:</strong> Percentage of sales that goes to direct costs.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatPercentage(results.jobCostPercent)}
              </span>
            </div>

                {/* Cost of Goods Sold $ */}
            <div className="result-item border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Cost of Goods Sold $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Cost of Goods Sold $:</strong> Your direct costs for materials, labor, and subcontractors.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(parseFloat(formData.jobCost) || 0)}
              </span>
            </div>

                {/* Actual Gross Profit Margin % */}
            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Actual Gross Profit Margin %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Actual Gross Profit Margin %:</strong> Your actual gross profit margin percentage.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatPercentage(results.yourProfitMargin)}
              </span>
            </div>
            
                {/* Actual Mark up % */}
                <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Actual Mark up %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Actual Mark up %:</strong> How much you mark up your job costs to get the retail price.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                {formatPercentage(results.actualMarkup)}
              </span>
            </div>

                {/* Actual Gross Profit $ */}
            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Actual Gross Profit $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Actual Gross Profit $:</strong> Sales - Cost of Goods Sold</p>
              </div>
              </div>
              </div>
                  <span className="result-value">
                    {formatCurrency(results.grossProfit)}
              </span>
              </div>

                {/* Division Variable Expenses $ */}
                <div className="result-item border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Division Variable Expenses $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Division Variable Expenses $:</strong> Variable expenses that change with job volume.</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.divisionVariableExpensesDollars)}
              </span>
            </div>

                {/* Royalty Rate $ */}
                <div className="result-item border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Royalty Rate $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Royalty Rate $:</strong> Fees paid to franchisors or licensing agreements.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.royaltyDollars)}
              </span>
            </div>

                {/* Contribution Margin $ */}
            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Contribution Margin $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Contribution Margin $:</strong> Gross Profit - (Variable Expenses + Royalties)</p>
                  </div>
                </div>
              </div>
                  <span className="result-value">
                    {formatCurrency(results.contributionMargin)}
              </span>
            </div>

                {/* Division Fixed Expenses $ */}
                <div className="result-item border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Division Fixed Expenses $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Division Fixed Expenses $:</strong> Fixed expenses that don't change with job volume.</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.divisionFixedExpensesDollars)}
              </span>
            </div>

                {/* Division Controllable Margin $ */}
            <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Division Controllable Margin $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Division Controllable Margin $:</strong> Contribution Margin - Division Fixed Expenses</p>
              </div>
                </div>
              </div>
                  <span className="result-value">
                    {formatCurrency(results.controllableMargin)}
                </span>
            </div>

                {/* Company Overhead Costs $ */}
                <div className="result-item border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Company Overhead Costs $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Company Overhead Costs $:</strong> General company fixed and variable expenses.</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.companyOverheadsDollars)}
              </span>
            </div>

                {/* Operating Income $ */}
                <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Operating Income $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Operating Income $:</strong> Controllable Margin - General Company Fixed and Variable Expenses</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.operatingIncome)}
              </span>
            </div>

                {/* Interest, Taxes, Depreciation, and Amortization $ */}
                <div className="result-item border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Interest, Taxes, Depreciation, and Amortization $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Interest, Taxes, Depreciation, and Amortization $:</strong> Additional expenses not included in overhead.</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.interestTaxesDepreciationAmortization)}
              </span>
            </div>
            
                {/* Net Profit $ */}
                <div className="result-item border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Net Profit $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Net Profit $:</strong> Operating Income - Interest, Taxes, Depreciation, and Amortization</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.actualNetProfit)}
              </span>
              </div>
            </div>

              {/* GROUP 2: Break-Even and Target Analysis */}
              <div className="space-y-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2 mt-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">GROUP 2: Break-Even and Target Analysis</h3>
                
                {/* Division Total Break-Even % */}
                <div className="result-item border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Division Total Break-Even %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Division Total Break-Even %:</strong> Company Overheads % + Royalty Rate %</p>
              </div>
                </div>
              </div>
              <span className="result-value">
                    {formatPercentage(results.divisionTotalBreakEven)}
              </span>
            </div>

                {/* Break Even Price $ */}
                <div className="result-item border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Break Even Price $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Break Even Price $:</strong> Job Cost $ / (1 - Division Total Break-Even %)</p>
                  </div>
                </div>
              </div>
              <span className="result-value">
                    {formatCurrency(results.breakEvenPrice)}
              </span>
              </div>

                {/* Required Margin % */}
                <div className="result-item border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Required Margin %:</span>
                    <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                        i
                      </span>
                      <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Required Margin %:</strong> Company Overheads % + Royalty Rate % + Target Net Profit %</p>
                      </div>
                    </div>
                  </div>
                  <span className="result-value">
                    {formatPercentage(results.requiredMargin)}
                  </span>
            </div>

                {/* Required Price $ */}
                <div className="result-item border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Required Price $:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Required Price $:</strong> Job Cost $ / (1 - Required Margin %)</p>
                  </div>
                </div>
              </div>
                  <span className="result-value">
                    {formatCurrency(results.requiredPrice)}
                  </span>
                </div>

                {/* Your Price $ */}
                <div className="result-item border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Your Price $:</span>
                    <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                        i
                  </span>
                      <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Your Price $:</strong> Retail Price $</p>
                </div>
              </div>
                  </div>
                  <span className="result-value">
                    {formatCurrency(results.yourPrice)}
                  </span>
            </div>

                {/* Your Profit Margin is % */}
                <div className="result-item border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Your Profit Margin is %:</span>
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                    i
                  </span>
                  <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Your Profit Margin is %:</strong> Actual Contribution Margin %</p>
                  </div>
                </div>
              </div>
                  <span className="result-value">
                    {formatPercentage(results.yourProfitMargin)}
                  </span>
                </div>

                {/* You are currently at */}
                <div className="result-item border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>You are currently at:</span>
                    <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                        i
                  </span>
                      <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>You are currently at:</strong> Required Margin % - Your Profit Margin is %</p>
                  </div>
                </div>
                </div>
                  <span className={`result-value ${results.thisJobIs > 0.1 ? 'text-success-600 dark:text-success-400' : results.thisJobIs >= -0.1 && results.thisJobIs <= 0.1 ? 'text-blue-600 dark:text-blue-400' : 'text-danger-600 dark:text-danger-400'}`}>
                    {formatPercentage(results.thisJobIs)} ({getBudgetStatus(results.thisJobIs, true)})
                  </span>
              </div>

                {/* Which is */}
                <div className="result-item border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span style={{color: '#1F1F1F'}}>Which is:</span>
                    <div className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 text-xs cursor-help">
                        i
                      </span>
                      <div className="absolute z-10 invisible group-hover:visible bottom-6 left-0 w-64 p-3 text-xs rounded-md shadow-lg bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        <p><strong>Which is:</strong> Retail Price $ - Required Price $</p>
            </div>
          </div>
        </div>
                  <span className={`result-value ${results.yourJob > 0 ? 'text-success-600 dark:text-success-400' : results.yourJob === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-danger-600 dark:text-danger-400'}`}>
                    {formatCurrency(results.yourJob)} ({getBudgetStatus(results.yourJob, false)})
                  </span>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
    </div>
  )
}

export default Calculator