# Profitability Calculator

A modern, responsive React web application for calculating job profitability with real-time calculations, job history, and print functionality.

## 🚀 Features

### Core Functionality
- **Job-based Calculations**: Calculate profitability for individual jobs
- **Real-time Results**: Instant calculations as you type
- **Job History**: Save and manage multiple jobs with localStorage
- **Print to PDF**: Generate professional reports for each job
- **Dark/Light Mode**: Toggle between themes with localStorage persistence

### Input Fields
- **Job Name** (text) - Required
- **Total Price** (number) - Required, must be > 0
- **Total Cost** (number) - Required, must be ≥ 0
- **Target Margin** (percentage) - Optional, 0-100%

### Calculated Outputs
- **Gross Profit** ($): Total Price - Total Cost
- **Gross Margin** (%): (Gross Profit / Total Price) × 100
- **Margin Difference** (%): Gross Margin - Target Margin

### User Experience
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Input Validation**: Real-time validation with helpful error messages
- **Color-coded Results**: Visual indicators for positive, negative, and neutral values
- **Smooth Animations**: Fade-in effects and hover interactions

## 🛠️ Tech Stack

- **React 18** - Functional components with hooks
- **Vite** - Fast build system and development server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **ESLint** - Code linting and formatting

## 📁 Project Structure

```
profitability-calculator-v1/
├── public/
│   └── vite.svg              # Favicon
├── src/
│   ├── components/
│   │   ├── Calculator.jsx     # Main calculator form
│   │   ├── JobCard.jsx        # Individual job display
│   │   ├── JobHistory.jsx     # Job history management
│   │   └── ThemeToggle.jsx    # Dark/light mode toggle
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles and Tailwind imports
├── .eslintrc.cjs              # ESLint configuration
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd profitability-calculator-v1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:5173`
   - The app will automatically reload when you make changes

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the Vite configuration
   - Deploy with zero configuration

### Other Platforms

The built `dist` folder can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🎯 How to Use

1. **Enter Job Details**:
   - Fill in the job name
   - Input total price and cost
   - Optionally set a target margin

2. **View Real-time Results**:
   - See calculations update instantly
   - Results are color-coded for easy reading

3. **Save Job**:
   - Click "Save Job" to store in history
   - Jobs are automatically saved to localStorage

4. **Manage History**:
   - View all saved jobs in the history panel
   - Print individual job reports
   - Delete jobs or clear all history

5. **Print Reports**:
   - Click the print button on any job card
   - Generate professional PDF reports
   - Perfect for client presentations

## 🎨 Customization

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Add new components in `src/components/`

### Functionality
- Extend the calculator in `src/components/Calculator.jsx`
- Add new validation rules in the `validateForm` function
- Modify print templates in `src/components/JobCard.jsx`

### Adding Features
- New calculation fields in the form
- Additional export formats
- Data import/export functionality
- Advanced filtering and sorting

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality. Run `npm run lint` to check for issues.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Vite** for the fast build system
- **Tailwind CSS** for the utility-first styling
- **React** for the component-based architecture
- **Vercel** for seamless deployment

---

**Built with ❤️ using React + Vite + Tailwind CSS**

*Last updated: December 2024* 