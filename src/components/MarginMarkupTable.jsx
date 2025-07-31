import { useState } from 'react'

const MarginMarkupTable = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Generate margin vs markup data
  const generateMarginMarkupData = () => {
    const data = []
    for (let margin = 1; margin <= 99; margin++) {
      const markup = (margin / (1 - margin / 100)) * 100
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

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
        📊 Margin vs. Markup Reference
      </h2>
      
      {/* Search Input */}
      <div className="mb-4">
        <label htmlFor="searchMargin" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                  Margin (%)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                  Markup (%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900">
              {filteredData.map((item, index) => (
                <tr 
                  key={index}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150"
                >
                  <td className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="font-mono font-medium">{formatPercentage(item.margin)}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-100 dark:border-neutral-800">
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
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          💡 Quick Reference
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-mono font-bold text-primary-600 dark:text-primary-400">25%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Margin</div>
            <div className="font-mono text-neutral-700 dark:text-neutral-300">33.33%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Markup</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-primary-600 dark:text-primary-400">30%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Margin</div>
            <div className="font-mono text-neutral-700 dark:text-neutral-300">42.86%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Markup</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-primary-600 dark:text-primary-400">40%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Margin</div>
            <div className="font-mono text-neutral-700 dark:text-neutral-300">66.67%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Markup</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-primary-600 dark:text-primary-400">50%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Margin</div>
            <div className="font-mono text-neutral-700 dark:text-neutral-300">100%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Markup</div>
          </div>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
          📐 Formula
        </h4>
        <p className="text-sm text-primary-700 dark:text-primary-300">
          <strong>Markup = (Margin / (1 - Margin)) × 100</strong>
        </p>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
          This table helps you quickly convert between margin and markup percentages for pricing decisions.
        </p>
      </div>
    </div>
  )
}

export default MarginMarkupTable 