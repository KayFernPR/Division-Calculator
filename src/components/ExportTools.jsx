import React, { useState } from 'react'

const ExportTools = ({ jobs, selectedJob }) => {
  const [isExporting, setIsExporting] = useState(false)

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

  const exportToPDF = () => {
    setIsExporting(true)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    if (selectedJob) {
      // Single job export
      const content = generateSingleJobPDF(selectedJob)
      printWindow.document.write(content)
    } else {
      // All jobs export
      const content = generateAllJobsPDF(jobs)
      printWindow.document.write(content)
    }
    
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      setIsExporting(false)
    }, 500)
  }

  const generateSingleJobPDF = (job) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Report - ${job.jobName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #249100; border-bottom: 2px solid #249100; padding-bottom: 5px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .label { font-weight: bold; }
            .value { text-align: right; }
            .status { padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; }
            .status.excellent { background-color: #10b981; }
            .status.good { background-color: #3b82f6; }
            .status.neutral { background-color: #6b7280; }
            .status.thin { background-color: #f59e0b; }
            .status.poor { background-color: #ef4444; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Restoration Division: Job Profitability Report</h1>
            <h2>${job.jobName}</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Job Details</h3>
            <div class="row">
              <span class="label">Job Name:</span>
              <span class="value">${job.jobName}</span>
            </div>
            <div class="row">
              <span class="label">Insurance Carrier:</span>
              <span class="value">${job.clientName || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${new Date(job.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Financial Summary</h3>
            <div class="row">
              <span class="label">Retail Price:</span>
              <span class="value">${formatCurrency(job.retailPrice)}</span>
            </div>
            <div class="row">
              <span class="label">Job Cost:</span>
              <span class="value">${formatCurrency(job.jobCost)}</span>
            </div>
            <div class="row">
              <span class="label">Gross Profit:</span>
              <span class="value">${formatCurrency(job.results?.contributionMargin || 0)}</span>
            </div>
            <div class="row">
              <span class="label">Actual Net Profit:</span>
              <span class="value">${formatCurrency(job.results?.actualNetProfit || 0)}</span>
            </div>
            <div class="row">
              <span class="label">Profitability Status:</span>
              <span class="value">
                <span class="status ${job.results?.profitabilityStatus || 'neutral'}">${(job.results?.profitabilityStatus || 'neutral').toUpperCase()}</span>
              </span>
            </div>
          </div>
          
          <div class="section">
            <h3>Margin Analysis</h3>
            <div class="row">
              <span class="label">Actual Margin:</span>
              <span class="value">${formatPercentage(job.results?.yourProfitMargin || 0)}</span>
            </div>
            <div class="row">
              <span class="label">Target Margin:</span>
              <span class="value">${formatPercentage(job.targetNetProfit || 0)}</span>
            </div>
            <div class="row">
              <span class="label">Margin Difference:</span>
              <span class="value">${formatPercentage(job.results?.thisJobIs || 0)}</span>
            </div>
            <div class="row">
              <span class="label">Required Price:</span>
              <span class="value">${formatCurrency(job.results?.requiredPrice || 0)}</span>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const generateAllJobsPDF = (jobs) => {
    const totalRevenue = jobs.reduce((sum, job) => sum + (job.retailPrice || 0), 0)
    const totalCosts = jobs.reduce((sum, job) => sum + (job.jobCost || 0), 0)
    const totalProfit = jobs.reduce((sum, job) => sum + (job.results?.actualNetProfit || 0), 0)
    const avgMargin = jobs.length > 0 ? jobs.reduce((sum, job) => sum + (job.results?.yourProfitMargin || 0), 0) / jobs.length : 0

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>All Jobs Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .summary h3 { color: #249100; margin-top: 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .summary-item { display: flex; justify-content: space-between; }
            .summary-label { font-weight: bold; }
            .summary-value { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #249100; color: white; }
            .status { padding: 2px 6px; border-radius: 3px; color: white; font-size: 12px; }
            .status.excellent { background-color: #10b981; }
            .status.good { background-color: #3b82f6; }
            .status.neutral { background-color: #6b7280; }
            .status.thin { background-color: #f59e0b; }
            .status.poor { background-color: #ef4444; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Restoration Division: Complete Job Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary Statistics</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Total Jobs:</span>
                <span class="summary-value">${jobs.length}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Revenue:</span>
                <span class="summary-value">${formatCurrency(totalRevenue)}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Costs:</span>
                <span class="summary-value">${formatCurrency(totalCosts)}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Profit:</span>
                <span class="summary-value">${formatCurrency(totalProfit)}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Average Margin:</span>
                <span class="summary-value">${formatPercentage(avgMargin)}</span>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Date</th>
                <th>Carrier</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${jobs.map(job => `
                <tr>
                  <td>${job.jobName}</td>
                  <td>${new Date(job.timestamp).toLocaleDateString()}</td>
                  <td>${job.clientName || 'N/A'}</td>
                  <td>${formatCurrency(job.retailPrice)}</td>
                  <td>${formatCurrency(job.jobCost)}</td>
                  <td>${formatCurrency(job.results?.actualNetProfit || 0)}</td>
                  <td>${formatPercentage(job.results?.yourProfitMargin || 0)}</td>
                  <td><span class="status ${job.results?.profitabilityStatus || 'neutral'}">${(job.results?.profitabilityStatus || 'neutral').toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
  }

  const exportToCSV = () => {
    setIsExporting(true)
    
    const data = selectedJob ? [selectedJob] : jobs
    const headers = [
      'Job Name',
      'Date',
      'Insurance Carrier',
      'Retail Price',
      'Job Cost',
      'Gross Profit',
      'Actual Net Profit',
      'Actual Margin (%)',
      'Target Margin (%)',
      'Required Price',
      'Profitability Status'
    ]
    
    const csvContent = [
      headers.join(','),
      ...data.map(job => [
        `"${job.jobName}"`,
        new Date(job.timestamp).toLocaleDateString(),
        `"${job.clientName || ''}"`,
        job.retailPrice || 0,
        job.jobCost || 0,
        job.results?.contributionMargin || 0,
        job.results?.actualNetProfit || 0,
        job.results?.yourProfitMargin || 0,
        job.targetNetProfit || 0,
        job.results?.requiredPrice || 0,
        `"${job.results?.profitabilityStatus || 'neutral'}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', selectedJob ? `${selectedJob.jobName}_report.csv` : 'all_jobs_report.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setIsExporting(false)
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
        <span>📊</span>
        Export Tools
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>📄</span>
          {isExporting ? 'Generating...' : 'Export to PDF'}
        </button>
        
        <button
          onClick={exportToCSV}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>📈</span>
          {isExporting ? 'Generating...' : 'Export to CSV'}
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>💡 Tip:</strong> PDF exports are optimized for printing and sharing. CSV exports can be opened in Excel for further analysis.
        </p>
      </div>
    </div>
  )
}

export default ExportTools
