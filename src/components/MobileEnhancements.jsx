import React, { useState, useEffect } from 'react'

const MobileEnhancements = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 300)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToCalculator = () => {
    const calculatorElement = document.querySelector('[data-calculator-section]')
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isMobile) return null

  return (
    <>
      {/* Floating Action Button */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col gap-3">
            <button
              onClick={scrollToCalculator}
              className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              title="Go to Calculator"
            >
              <span className="text-xl">🧮</span>
            </button>
            <button
              onClick={scrollToTop}
              className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="Back to Top"
            >
              <span className="text-xl">⬆️</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          /* Improve touch targets */
          .input-field {
            min-height: 48px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          .btn {
            min-height: 48px;
            padding: 12px 16px;
          }
          
          /* Better spacing for mobile */
          .card {
            margin-bottom: 16px;
          }
          
          /* Improve table responsiveness */
          .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Better button spacing */
          .btn-group .btn {
            margin-bottom: 8px;
          }
          
          /* Improve form layout */
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          /* Better modal sizing */
          .modal {
            margin: 16px;
            max-height: calc(100vh - 32px);
            overflow-y: auto;
          }
        }
      `}</style>
    </>
  )
}

export default MobileEnhancements
