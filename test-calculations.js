// Test calculations to verify the math is working correctly
// Sample data for testing
const testData = {
  retailPrice: 10000,
  jobCost: 6000,
  royaltyRate: 5,
  divisionVariableExpenses: 8,
  divisionOverheads: 12,
  companyOverheads: 15,
  targetNetProfit: 20
}

console.log('Testing calculations with sample data:')
console.log('Retail Price:', testData.retailPrice)
console.log('Job Cost:', testData.jobCost)
console.log('Royalty Rate:', testData.royaltyRate + '%')
console.log('Division Variable Expenses:', testData.divisionVariableExpenses + '%')
console.log('Division Fixed Expenses:', testData.divisionOverheads + '%')
console.log('Company Overhead Costs:', testData.companyOverheads + '%')
console.log('Target Operating Profit:', testData.targetNetProfit + '%')
console.log('')

// Perform calculations
const retailPrice = testData.retailPrice
const jobCost = testData.jobCost
const royaltyRate = testData.royaltyRate
const divisionVariableExpenses = testData.divisionVariableExpenses
const divisionOverheads = testData.divisionOverheads
const companyOverheads = testData.companyOverheads
const targetNetProfit = testData.targetNetProfit

// Basic calculations
const grossProfit = retailPrice - jobCost
const divisionVariableExpensesDollars = (divisionVariableExpenses / 100) * retailPrice
const divisionOverheadsDollars = (divisionOverheads / 100) * retailPrice
const royaltyDollars = (royaltyRate / 100) * retailPrice
const contributionMargin = (retailPrice - jobCost) - (divisionVariableExpenses / 100) * retailPrice - (royaltyRate / 100) * retailPrice
const controllableMargin = retailPrice * (1 - divisionVariableExpenses / 100 - royaltyRate / 100 - divisionOverheads / 100) - jobCost
const companyOverheadsDollars = (companyOverheads / 100) * retailPrice
const operatingIncome = retailPrice * (1 - divisionVariableExpenses / 100 - divisionOverheads / 100 - companyOverheads / 100 - royaltyRate / 100) - jobCost
const actualNetProfit = operatingIncome

// Break-even and target analysis
const yourProfitMargin = retailPrice > 0 ? ((retailPrice - jobCost) / retailPrice) * 100 : 0
const divisionTotalBreakEven = (jobCost / retailPrice) * 100 + divisionVariableExpenses + divisionOverheads + companyOverheads + royaltyRate
const breakEvenPrice = jobCost / (1 - (divisionVariableExpenses + divisionOverheads + companyOverheads + royaltyRate) / 100)
const requiredPrice = jobCost / (1 - (divisionVariableExpenses + divisionOverheads + companyOverheads + royaltyRate + targetNetProfit) / 100)
const requiredMargin = ((requiredPrice - jobCost) / requiredPrice) * 100
const yourPrice = retailPrice
const thisJobIs = yourProfitMargin - requiredMargin
const yourJob = retailPrice - requiredPrice

// Profitability status
const marginDifference = yourProfitMargin - requiredMargin
let profitabilityStatus = 'neutral'

if (actualNetProfit < 0) {
  profitabilityStatus = 'loss'
} else if (marginDifference >= 5) {
  profitabilityStatus = 'excellent'
} else if (marginDifference >= 1) {
  profitabilityStatus = 'good'
} else if (marginDifference >= -1) {
  profitabilityStatus = 'neutral'
} else if (marginDifference >= -5) {
  profitabilityStatus = 'thin'
} else if (marginDifference >= -10) {
  profitabilityStatus = 'poor'
} else {
  profitabilityStatus = 'loss'
}

const jobCostPercent = retailPrice > 0 ? (jobCost / retailPrice) * 100 : 0
const actualMarkup = jobCost > 0 ? ((retailPrice - jobCost) / jobCost) * 100 : 0

console.log('=== CALCULATION RESULTS ===')
console.log('Sales $:', retailPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('COGS $:', jobCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('COGS %:', jobCostPercent.toFixed(2) + '%')
console.log('Actual Gross Profit Margin %:', yourProfitMargin.toFixed(2) + '%')
console.log('Actual Mark-up %:', actualMarkup.toFixed(2) + '%')
console.log('Actual Gross Profit $:', grossProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Division Variable Expenses $:', divisionVariableExpensesDollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Royalty $:', royaltyDollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Division Contribution Margin $:', contributionMargin.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Division Fixed Expenses $:', divisionOverheadsDollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Division Controllable Margin $:', controllableMargin.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Company Overhead Costs $:', companyOverheadsDollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Operating Income $:', operatingIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('')
console.log('=== BREAK-EVEN AND TARGET ANALYSIS ===')
console.log('Break Even Price $:', breakEvenPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Division Total Break-Even %:', divisionTotalBreakEven.toFixed(2) + '%')
console.log('Required Price $:', requiredPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Required Margin %:', requiredMargin.toFixed(2) + '%')
console.log('Your Price $:', yourPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
console.log('Your Profit Margin is %:', yourProfitMargin.toFixed(2) + '%')
console.log('You are currently at:', thisJobIs.toFixed(2) + '% (margin difference)')
console.log('Which is:', yourJob.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + ' (price difference)')
console.log('')
console.log('=== PROFITABILITY STATUS ===')
console.log('Status:', profitabilityStatus)
console.log('Margin Difference:', marginDifference.toFixed(2) + '%')
console.log('')

// Verify some key calculations manually
console.log('=== VERIFICATION ===')
console.log('Gross Profit Check: $10,000 - $6,000 = $4,000 ✓', grossProfit === 4000 ? 'PASS' : 'FAIL')
console.log('COGS % Check: $6,000 / $10,000 = 60% ✓', Math.abs(jobCostPercent - 60) < 0.01 ? 'PASS' : 'FAIL')
console.log('Profit Margin Check: $4,000 / $10,000 = 40% ✓', Math.abs(yourProfitMargin - 40) < 0.01 ? 'PASS' : 'FAIL')
console.log('Markup Check: $4,000 / $6,000 = 66.67% ✓', Math.abs(actualMarkup - 66.67) < 0.01 ? 'PASS' : 'FAIL')



