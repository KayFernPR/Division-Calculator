# 🏗️ Restoration Profitability Calculator

A comprehensive web application designed specifically for restoration contractors to calculate job profitability, track margins, and visualize trends over time. Built with React, Vite, and Tailwind CSS for easy deployment to Vercel.

## ✨ Features

### 🧮 Job Profitability Calculator
- **Job Details**: Name, insurance carrier/client, break-even percentage
- **Financial Inputs**: Retail price, job cost, target margin
- **Real-time Calculations**:
  - Actual margin and markup percentages
  - Required price to hit target margin
  - Required markup percentage
  - Profit shortfall analysis
- **Business Impact Analysis**: Revenue needed at different margin levels
- **Visual Status Indicators**: ✅ On Target, ⚠️ Warning, ❌ No Bueno

### 📊 Margin vs. Markup Reference Table
- Complete conversion table (1% to 99% margin)
- Searchable interface
- Quick reference for common percentages
- Formula explanation

### 📈 Interactive Charts
- **Bar Charts**: Gross profit by job
- **Line Charts**: Margin trends over time
- **Filtering**: By carrier, by month
- **Summary Statistics**: Total profit, average margin, revenue, costs

### 📋 Advanced Job History
- **Sorting**: By date, margin, name, or carrier
- **Filtering**: By insurance carrier
- **Average Calculations**: Margin, markup, and profit trends
- **Print Reports**: Professional PDF-ready job reports
- **Data Persistence**: All data stored locally

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle with localStorage persistence
- **Tabbed Interface**: Organized sections for easy navigation
- **Color Palette**: Professional restoration contractor theme
  - Primary: `#249100` (Forest Green)
  - Neutral: `#907c6d` (Warm Gray)
  - Light: `#EBE6E3` (Cream)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd profitability-calculator-v1

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 📦 Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Vercel-ready

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Calculator.jsx      # Main calculation form
│   ├── JobHistory.jsx      # Job history with sorting/filtering
│   ├── JobCard.jsx         # Individual job display
│   ├── MarginMarkupTable.jsx # Reference table
│   ├── ProfitChart.jsx     # Interactive charts
│   └── ThemeToggle.jsx     # Dark/light mode toggle
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
└── index.css              # Global styles
```

## 🎯 Usage Guide

### 1. Setting Up Your First Job
1. Navigate to the **Calculator** tab
2. Enter your company's break-even percentage
3. Fill in job details (name, carrier, price, cost, target margin)
4. Review real-time calculations
5. Click "Save Job" to store the results

### 2. Understanding Status Indicators
- **✅ On Target**: Actual margin ≥ target margin
- **⚠️ Warning**: Actual margin < target but ≥ break-even
- **❌ No Bueno**: Actual margin < break-even

### 3. Using the Reference Table
1. Go to the **Reference** tab
2. Search for specific margin or markup values
3. Use the quick reference for common percentages
4. Understand the margin-to-markup conversion formula

### 4. Analyzing Trends
1. Switch to the **Charts** tab
2. Choose between profit bars or margin lines
3. Filter by carrier or month
4. Review summary statistics

### 5. Managing Job History
1. Visit the **History** tab
2. Sort jobs by different criteria
3. Filter by insurance carrier
4. Toggle average calculations
5. Print individual job reports

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will auto-detect the Vite configuration
4. Deploy with zero configuration

### Other Platforms
The app is built as a static site and can be deployed to:
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting service

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
```javascript
colors: {
  primary: '#249100',    // Forest Green
  neutral: '#907c6d',    // Warm Gray
  light: '#EBE6E3'       // Cream
}
```

### Adding New Features
1. Create new components in `src/components/`
2. Add new tabs in `src/App.jsx`
3. Update the tab navigation array
4. Style with Tailwind CSS classes

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🙏 Acknowledgments

- Built for restoration contractors
- Designed with real-world business needs in mind
- Optimized for mobile and desktop use
- Focused on ease of use and professional presentation

---

**Built with ❤️ for restoration contractors who want to make data-driven business decisions.** 

## Branding

- Primary color: `#63D43E`
- Fonts: Body `Nunito Sans`, Headers `Helvetica`, Subheaders `Outfit (caps)`, Titles `Merriweather`
- Place logo at `public/logo.png`
- Place favicon at `public/favicon.ico`

## Build

```bash
npm run build
```

## Git (first push)

```bash
git init
git add .
git commit -m "Initial branded setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
``` 