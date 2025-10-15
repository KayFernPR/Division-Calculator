import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const ProfitChart = ({ jobs }) => {
  const [chartType, setChartType] = useState('profit') // 'profit' or 'margin'
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

  // Prepare chart data
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

    // Transform data for chart
    return filteredJobs.map(job => ({
      name: job.jobName.length > 15 ? job.jobName.substring(0, 15) + '...' : job.jobName,
      fullName: job.jobName,
      profit: job.retailPrice - job.jobCost,
      margin: parseFloat(job.results?.yourProfitMargin) || 0,
      markup: parseFloat(job.results?.actualMarkup) || 0,
      retailPrice: job.retailPrice,
      jobCost: job.jobCost,
      carrier: job.clientName || 'N/A',
      date: new Date(job.timestamp).toLocaleDateString(),
      status: job.results?.profitabilityStatus
    }))
  }, [jobs, filterCarrier, filterMonth])

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
            Retail Price: {formatCurrency(data.retailPrice)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Job Cost: {formatCurrency(data.jobCost)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Profit: {formatCurrency(data.profit)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Margin: {formatPercentage(data.margin)}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Markup: {formatPercentage(data.markup)}
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
            <option value="profit">Gross Profit</option>
            <option value="margin">Margin %</option>
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
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#249100" 
                strokeWidth={3}
                name="Gross Profit"
                dot={{ fill: '#249100', strokeWidth: 2, r: 4 }}
              />
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
              <Line 
                type="monotone" 
                dataKey="margin" 
                stroke="#249100" 
                strokeWidth={3}
                name="Margin %"
                dot={{ fill: '#249100', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
            📊 Summary ({chartData.length} jobs)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(chartData.reduce((sum, job) => sum + job.profit, 0))}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Total Profit</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(chartData.reduce((sum, job) => sum + job.margin, 0) / chartData.length)}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Avg Margin</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(chartData.reduce((sum, job) => sum + job.retailPrice, 0))}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(chartData.reduce((sum, job) => sum + job.jobCost, 0))}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">Total Costs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfitChart 