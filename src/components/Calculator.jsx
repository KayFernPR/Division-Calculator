import { useState, useEffect } from 'react'

const Calculator = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    jobName: '',
    totalPrice: '',
    totalCost: '',
    targetMargin: ''
  })

  const [results, setResults] = useState({
    grossProfit: 0,
    grossMargin: 0,
    marginDifference: 0
  })

  const [errors, setErrors] = useState({})

  // Calculate results whenever form data changes
  useEffect(() => {
    calculateResults()
  }, [formData])

  const calculateResults = () => {
    const price = parseFloat(formData.totalPrice) || 0
    const cost = parseFloat(formData.totalCost) || 0
    const targetMargin = parseFloat(formData.targetMargin) || 0

    const grossProfit = price - cost
    const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0
    const marginDifference = grossMargin - targetMargin

    setResults({
      grossProfit,
      grossMargin,
      marginDifference
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.jobName.trim()) {
      newErrors.jobName = 'Job name is required'
    }

    if (!formData.totalPrice || parseFloat(formData.totalPrice) <= 0) {
      newErrors.totalPrice = 'Total price must be greater than 0'
    }

    if (!formData.totalCost || parseFloat(formData.totalCost) < 0) {
      newErrors.totalCost = 'Total cost cannot be negative'
    }

    const price = parseFloat(formData.totalPrice) || 0
    const cost = parseFloat(formData.totalCost) || 0

    if (cost > price) {
      newErrors.totalCost = 'Total cost cannot exceed total price'
    }

    if (formData.targetMargin && (parseFloat(formData.targetMargin) < 0 || parseFloat(formData.targetMargin) > 100)) {
      newErrors.targetMargin = 'Target margin must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onAddJob({
        ...formData,
        totalPrice: parseFloat(formData.totalPrice),
        totalCost: parseFloat(formData.totalCost),
        targetMargin: formData.targetMargin ? parseFloat(formData.targetMargin) : null,
        ...results
      })

      // Reset form
      setFormData({
        jobName: '',
        totalPrice: '',
        totalCost: '',
        targetMargin: ''
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

  const getValueClass = (value) => {
    if (value > 0) return 'positive'
    if (value < 0) return 'negative'
    return 'neutral'
  }

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📊 Job Calculator
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Name */}
          <div>
            <label htmlFor="jobName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Name *
            </label>
            <input
              type="text"
              id="jobName"
              name="jobName"
              value={formData.jobName}
              onChange={handleInputChange}
              className={`input-field ${errors.jobName ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter job name"
            />
            {errors.jobName && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.jobName}</p>
            )}
          </div>

          {/* Total Price */}
          <div>
            <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Price ($) *
            </label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.totalPrice ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="0.00"
            />
            {errors.totalPrice && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.totalPrice}</p>
            )}
          </div>

          {/* Total Cost */}
          <div>
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Cost ($) *
            </label>
            <input
              type="number"
              id="totalCost"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.totalCost ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="0.00"
            />
            {errors.totalCost && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.totalCost}</p>
            )}
          </div>

          {/* Target Margin */}
          <div>
            <label htmlFor="targetMargin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Margin (%) (Optional)
            </label>
            <input
              type="number"
              id="targetMargin"
              name="targetMargin"
              value={formData.targetMargin}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="100"
              className={`input-field ${errors.targetMargin ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="0.00"
            />
            {errors.targetMargin && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.targetMargin}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            💾 Save Job
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📈 Results
        </h3>
        
        <div className="space-y-3">
          <div className="result-item">
            <span className="text-gray-700 dark:text-gray-300">Gross Profit:</span>
            <span className={`result-value ${getValueClass(results.grossProfit)}`}>
              {formatCurrency(results.grossProfit)}
            </span>
          </div>
          
          <div className="result-item">
            <span className="text-gray-700 dark:text-gray-300">Gross Margin:</span>
            <span className={`result-value ${getValueClass(results.grossMargin)}`}>
              {formatPercentage(results.grossMargin)}
            </span>
          </div>
          
          {formData.targetMargin && (
            <div className="result-item">
              <span className="text-gray-700 dark:text-gray-300">Margin Difference:</span>
              <span className={`result-value ${getValueClass(results.marginDifference)}`}>
                {formatPercentage(results.marginDifference)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculator 