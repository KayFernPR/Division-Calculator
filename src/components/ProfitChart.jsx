import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const ProfitChart = ({ jobs }) => {
  const [chartType, setChartType] = useState('margin') // 'profit' or 'margin'
  const [filterCarrier, setFilterCarrier] = useState('')
  const [filterMonth, setFilterMonth] = useState('')

  // Get unique carriers for filter
  const carriers = useMemo(() => {
    const uniqueCarriers = [...new Set(jobs.map(job => job.clientName).filter(Boolean))]
    return uniqueCarriers.sort()
  }, [jobs])

  // Get unique months for filter
  const months = useMemo(() => {
    const uniqueMonths = [...new Set(jobs.map(job => {
      const date = new Date(job.timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }))]
    return uniqueMonths.sort().reverse()
  }, [jobs])

  // Prepare chart data - each job becomes its own line
  const chartData = useMemo(() => {
    let filteredJobs = jobs

    // Filter by carrier
    if (filterCarrier) {
      filteredJobs = filteredJobs.filter(job => job.clientName === filterCarrier)
    }

    // Filter by month
    if (filterMonth) {
      filteredJobs = filteredJobs.filter(job => {
        const date = new Date(job.timestamp)
        const jobMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        return jobMonth === filterMonth
      })
    }

    // Create data structure for margin performance chart
    const dataPoints = []
    filteredJobs.forEach((job, index) => {
      const actualGrossMargin = parseFloat(job.results?.actualGrossProfitMargin) || 0
      const netProfitMargin = parseFloat(job.results?.yourProfitMargin) || 0
      const targetMargin = parseFloat(job.targetNetProfit) || 0
      
      dataPoints.push({
        name: job.jobName.length > 15 ? job.jobName.substring(0, 15) + '...' : job.jobName,
        fullName: job.jobName,
        actualGrossMargin: actualGrossMargin,
        netProfitMargin: netProfitMargin,
        targetMargin: targetMargin,
        profit: job.retailPrice - job.jobCost,
        markup: parseFloat(job.results?.actualMarkup) || 0,
        retailPrice: job.retailPrice,
        jobCost: job.jobCost,
        carrier: job.clientName || 'N/A',
        date: new Date(job.timestamp).toLocaleDateString(),
        status: job.results?.profitabilityStatus,
        jobId: job.id,
        // Color coding for performance vs target
        performanceColor: netProfitMargin > targetMargin ? '#249100' : 
                         netProfitMargin < targetMargin ? '#ef4444' : '#6b7280'
      })
    })

    return dataPoints
  }, [jobs, filterCarrier, filterMonth])

  // Generate colors for each job line
  const getJobColor = (index) => {
    const colors = [
      '#249100', // Green
      '#3b82f6', // Blue
      '#f59e0b', // Orange
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
      '#84cc16', // Lime
      '#f97316', // Orange
      '#ec4899', // Pink
      '#6366f1'  // Indigo
    ]
    return colors[index % colors.length]
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{data.fullName}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Carrier: {data.carrier}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Date: {data.date}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Actual Gross Margin: {formatPercentage(data.actualGrossMargin)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Net Profit Margin: {formatPercentage(data.netProfitMargin)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Target Margin: {formatPercentage(data.targetMargin)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Performance: {data.netProfitMargin > data.targetMargin ? '✅ Above Target' : 
                         data.netProfitMargin < data.targetMargin ? '❌ Below Target' : '🎯 On Target'}
          </p>
        </div>
      )
    }
    return null
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return '#249100'
      case 'warning':
        return '#f59e0b'
      case 'danger':
        return '#ef4444'
      default:
        return '#907c6d'
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
          📈 Profit Chart
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-neutral-600 dark:text-neutral-400">
            No jobs available for charting. Save some jobs first!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
        📈 Profit Chart
      </h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Chart Type */}
        <div>
          <label className="block text-sm font-medium style={{color: '#1F1F1F'}} mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="input-field"
          >
            <option value="margin">Profit Margin Performance</option>
            <option value="profit">Gross Profit Comparison</option>
          </select>
        </div>

        {/* Filter by Carrier */}
        <div>
          <label className="block text-sm font-medium style={{color: '#1F1F1F'}} mb-2">
            Filter by Carrier
          </label>
          <select
            value={filterCarrier}
            onChange={(e) => setFilterCarrier(e.target.value)}
            className="input-field"
          >
            <option value="">All Carriers</option>
            {carriers.map(carrier => (
              <option key={carrier} value={carrier}>{carrier}</option>
            ))}
          </select>
        </div>

        {/* Filter by Month */}
        <div>
          <label className="block text-sm font-medium style={{color: '#1F1F1F'}} mb-2">
            Filter by Month
          </label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="input-field"
          >
            <option value="">All Months</option>
            {months.map(month => {
              const [year, monthNum] = month.split('-')
              const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              return (
                <option key={month} value={month}>{monthName}</option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'profit' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe6e3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {chartData.map((job, index) => (
                <Line 
                  key={job.jobId}
                  type="monotone" 
                  dataKey="profit" 
                  stroke={getJobColor(index)}
                  strokeWidth={3}
                  name={job.fullName.length > 20 ? job.fullName.substring(0, 20) + '...' : job.fullName}
                  dot={{ fill: getJobColor(index), strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe6e3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatPercentage(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {/* Target Margin Reference Line */}
              <Line 
                type="monotone" 
                dataKey="targetMargin" 
                stroke="#6b7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target Margin"
                dot={false}
                connectNulls={false}
              />
              {/* Actual Gross Profit Margin */}
              <Line 
                type="monotone" 
                dataKey="actualGrossMargin" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Actual Gross Margin %"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
              {/* Net Profit Margin - Single line with color-coded dots */}
              <Line 
                type="monotone" 
                dataKey="netProfitMargin" 
                stroke="#249100" 
                strokeWidth={3}
                name="Net Profit Margin %"
                dot={(props) => {
                  const { cx, cy, payload } = props
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={4} 
                      fill={payload.performanceColor} 
                      stroke={payload.performanceColor}
                      strokeWidth={2}
                    />
                  )
                }}
                connectNulls={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Performance Legend */}
      <div className="flex justify-center mt-4 text-sm text-neutral-600">
        <span className="flex items-center mr-6">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Above Target
        </span>
        <span className="flex items-center mr-6">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
          On Target
        </span>
        <span className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          Below Target
        </span>
      </div>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
            📊 Performance Summary ({chartData.length} jobs)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(chartData.reduce((sum, job) => sum + job.netProfitMargin, 0) / chartData.length)}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Avg Net Margin</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(chartData.reduce((sum, job) => sum + job.actualGrossMargin, 0) / chartData.length)}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Avg Gross Margin</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-green-600">
                {chartData.filter(job => job.netProfitMargin > job.targetMargin).length}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Above Target</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-red-600">
                {chartData.filter(job => job.netProfitMargin < job.targetMargin).length}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Below Target</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfitChart 