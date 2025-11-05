import { useState } from 'react'

const MarginMarkupTable = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Generate margin vs markup data
  const generateMarginMarkupData = () => {
    const data = []
    for (let margin = 1; margin <= 99; margin++) {
      const markup = (margin / (100 - margin)) * 100
      data.push({
        margin: margin,
        markup: markup
      })
    }
    return data
  }

  const marginMarkupData = generateMarginMarkupData()

  // Filter data based on search term
  const filteredData = marginMarkupData.filter(item => 
    item.margin.toString().includes(searchTerm) ||
    item.markup.toFixed(2).includes(searchTerm)
  )

  const formatPercentage = (value, decimals = 2) => {
    return `${value.toFixed(decimals)}%`
  }

  // Compute margin from mark-up percentage
  const calculateMarginFromMarkup = (markupPercentage) => {
    return (markupPercentage / (100 + markupPercentage)) * 100
  }

  return (
    <div className="card p-5">
      <h2 className="text-2xl font-bold mb-6" style={{color: '#1F1F1F'}}>
        📊 Margin vs. Markup Reference
      </h2>
      
      {/* Search Input */}
      <div className="mb-4">
        <label htmlFor="searchMargin" className="block text-sm font-medium mb-2" style={{color: '#1F1F1F'}}>
          Search Margin or Markup
        </label>
        <input
          type="text"
          id="searchMargin"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
          placeholder="Enter margin or markup value..."
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold style={{color: '#1F1F1F'}} border-b border-neutral-200 dark:border-neutral-700">
                  Margin (%)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold style={{color: '#1F1F1F'}} border-b border-neutral-200 dark:border-neutral-700">
                  Mark-up (%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900">
              {filteredData.map((item, index) => (
                <tr 
                  key={index}
                  className="odd:bg-neutral-50 dark:odd:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150"
                >
                  <td className="px-4 py-2 text-sm style={{color: '#1F1F1F'}} border-b border-neutral-100 dark:border-neutral-800">
                    <span className="font-mono font-medium">{formatPercentage(item.margin, 0)}</span>
                  </td>
                  <td className="px-4 py-2 text-sm style={{color: '#1F1F1F'}} border-b border-neutral-100 dark:border-neutral-800">
                    <span className="font-mono font-medium">{formatPercentage(item.markup)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3" style={{color: '#1F1F1F'}}>
          💡 Quick Reference
        </h3>
        <div className="grid grid-cols-7 gap-4 text-sm">
          {[20, 25, 30, 35, 40, 45, 50].map((markup) => {
            const marginFromMarkup = calculateMarginFromMarkup(markup)
            return (
              <div className="text-center" key={markup}>
                <div className="font-mono font-bold text-primary-600 dark:text-primary-400">{formatPercentage(marginFromMarkup)}</div>
                <div style={{color: '#666666'}}>Margin</div>
                <div className="font-mono style={{color: '#1F1F1F'}}">{formatPercentage(markup)}</div>
                <div style={{color: '#666666'}}>Mark-up</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <h4 className="font-semibold mb-2" style={{color: '#1F1F1F'}}>
          📐 Formula
        </h4>
        <p className="text-sm mb-2" style={{color: '#1F1F1F'}}>
          <strong>Mark-up = (Margin / (1 - Margin)) × 100</strong>
        </p>
        <p className="text-sm mb-2" style={{color: '#1F1F1F'}}>
          <strong>Margin = (Mark-up / (100 + Mark-up)) × 100</strong>
        </p>
        <p className="text-xs mt-1" style={{color: '#1F1F1F'}}>
          This table helps you quickly convert between margin and markup percentages for pricing decisions.
        </p>
      </div>
    </div>
  )
}

export default MarginMarkupTable 