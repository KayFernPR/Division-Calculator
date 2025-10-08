import React, { useState } from 'react'

const JobTemplates = ({ onApplyTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const templates = [
    {
      id: 'water-damage',
      name: 'Water Damage Restoration',
      description: 'Standard water damage restoration job',
      icon: '💧',
      values: {
        royaltyRate: '6.00',
        divisionVariableExpenses: '8.00',
        divisionOverheads: '5.00',
        companyOverheads: '10.00',
        targetNetProfit: '25.00'
      }
    },
    {
      id: 'fire-damage',
      name: 'Fire Damage Restoration',
      description: 'Fire damage restoration with higher margins',
      icon: '🔥',
      values: {
        royaltyRate: '6.00',
        divisionVariableExpenses: '10.00',
        divisionOverheads: '5.00',
        companyOverheads: '12.00',
        targetNetProfit: '30.00'
      }
    },
    {
      id: 'mold-remediation',
      name: 'Mold Remediation',
      description: 'Specialized mold remediation work',
      icon: '🦠',
      values: {
        royaltyRate: '6.00',
        divisionVariableExpenses: '12.00',
        divisionOverheads: '5.00',
        companyOverheads: '15.00',
        targetNetProfit: '35.00'
      }
    },
    {
      id: 'commercial',
      name: 'Commercial Restoration',
      description: 'Large commercial restoration project',
      icon: '🏢',
      values: {
        royaltyRate: '5.00',
        divisionVariableExpenses: '6.00',
        divisionOverheads: '4.00',
        companyOverheads: '8.00',
        targetNetProfit: '20.00'
      }
    },
    {
      id: 'residential',
      name: 'Residential Restoration',
      description: 'Standard residential restoration work',
      icon: '🏠',
      values: {
        royaltyRate: '6.00',
        divisionVariableExpenses: '8.00',
        divisionOverheads: '5.00',
        companyOverheads: '10.00',
        targetNetProfit: '25.00'
      }
    },
    {
      id: 'emergency',
      name: 'Emergency Response',
      description: 'Emergency response with premium pricing',
      icon: '🚨',
      values: {
        royaltyRate: '6.00',
        divisionVariableExpenses: '15.00',
        divisionOverheads: '5.00',
        companyOverheads: '12.00',
        targetNetProfit: '40.00'
      }
    }
  ]

  const handleApplyTemplate = (template) => {
    onApplyTemplate(template.values)
    setSelectedTemplate(template.id)
    
    // Reset selection after a short delay
    setTimeout(() => {
      setSelectedTemplate(null)
    }, 1000)
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
        <span>📋</span>
        Job Templates
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        Quick-start templates for common restoration job types
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleApplyTemplate(template)}
            className={`p-3 rounded-lg border text-left transition-all duration-200 ${
              selectedTemplate === template.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-neutral-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{template.icon}</span>
              <span className="font-medium text-sm text-neutral-900 dark:text-white">
                {template.name}
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {template.description}
            </p>
            {selectedTemplate === template.id && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ Applied
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>💡 Tip:</strong> Templates set default percentages. You can still adjust individual values as needed for your specific job.
        </p>
      </div>
    </div>
  )
}

export default JobTemplates
