import React from 'react'
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useGSAPAnimation'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  className = "" 
}) => {
  const ref = useScrollAnimation('fadeIn')

  return (
    <div ref={ref} className={`group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/5 hover:-translate-y-1 ${className}`}>
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed font-light">
        {description}
      </p>
    </div>
  )
}

interface FeatureGridProps {
  features: Array<{
    icon: React.ReactNode
    title: string
    description: string
  }>
  columns?: 2 | 3 | 4
  className?: string
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ 
  features, 
  columns = 3, 
  className = "" 
}) => {
  const ref = useStaggerAnimation(0.15)
  
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div ref={ref} className={`grid grid-cols-1 ${gridCols[columns]} gap-8 ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

interface BenefitItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

export const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description }) => {
  const ref = useScrollAnimation('fadeIn')

  return (
    <div ref={ref} className="group">
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  number: string
  label: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'indigo'
}

export const StatCard: React.FC<StatCardProps> = ({ number, label, color = 'blue' }) => {
  const ref = useScrollAnimation('scale')
  
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600'
  }

  return (
    <div ref={ref} className="text-center">
      <div className={`text-3xl font-semibold ${colors[color]}`}>{number}</div>
      <div className="text-gray-500 font-light">{label}</div>
    </div>
  )
}

interface StatsGridProps {
  stats: Array<{
    number: string
    label: string
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'indigo'
  }>
  columns?: 2 | 3 | 4
  className?: string
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  columns = 4, 
  className = "" 
}) => {
  const ref = useStaggerAnimation(0.2)
  
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }

  return (
    <div ref={ref} className={`grid ${gridCols[columns]} gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          number={stat.number}
          label={stat.label}
          color={stat.color}
        />
      ))}
    </div>
  )
}

export default FeatureCard