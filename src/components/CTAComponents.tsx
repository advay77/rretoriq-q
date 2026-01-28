import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useGSAPAnimation'

interface CTAButtonProps {
  to: string
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  className?: string
}

export const CTAButton: React.FC<CTAButtonProps> = ({ to, variant, children, className = "" }) => {
  const baseClasses = "px-8 py-4 rounded-full font-medium text-base transition-all duration-300 flex items-center justify-center space-x-2"
  
  const variants = {
    primary: "bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg hover:shadow-gray-900/25",
    secondary: "border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  }

  return (
    <Link to={to} className={`${baseClasses} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  )
}

interface CTASectionProps {
  title: string
  subtitle?: string
  description: string
  primaryCTA: {
    text: string
    to: string
  }
  secondaryCTA?: {
    text: string
    to: string
  }
  background?: 'light' | 'dark' | 'gradient'
  className?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  background = 'light',
  className = ""
}) => {
  const ref = useScrollAnimation('fadeIn')

  const backgrounds = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600'
  }

  const textColors = {
    light: 'text-gray-900',
    dark: 'text-white',
    gradient: 'text-white'
  }

  const descriptionColors = {
    light: 'text-gray-600',
    dark: 'text-gray-300',
    gradient: 'text-indigo-100'
  }

  const primaryButtonStyles = {
    light: 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg hover:shadow-gray-900/25',
    dark: 'bg-white hover:bg-gray-50 text-gray-900 hover:shadow-lg',
    gradient: 'bg-white hover:bg-gray-50 text-indigo-600 hover:shadow-lg'
  }

  const secondaryButtonStyles = {
    light: 'border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50',
    dark: 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-800',
    gradient: 'border border-white/30 hover:border-white/50 text-white hover:bg-white/10'
  }

  return (
    <section className={`py-24 ${backgrounds[background]} ${className}`}>
      <div ref={ref} className="max-w-4xl mx-auto px-4 text-center">
        {subtitle && (
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <span>{subtitle}</span>
          </div>
        )}
        
        <h2 className={`text-4xl lg:text-5xl font-light mb-6 leading-tight ${textColors[background]}`}>
          {title}
        </h2>
        
        <p className={`text-lg mb-12 max-w-2xl mx-auto font-light ${descriptionColors[background]}`}>
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={primaryCTA.to}
            className={`px-8 py-4 rounded-full font-medium text-base transition-all duration-300 flex items-center justify-center space-x-2 ${primaryButtonStyles[background]}`}
          >
            <span>{primaryCTA.text}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {secondaryCTA && (
            <Link
              to={secondaryCTA.to}
              className={`px-8 py-4 rounded-full font-medium text-base transition-all duration-300 flex items-center justify-center space-x-2 ${secondaryButtonStyles[background]}`}
            >
              <span>{secondaryCTA.text}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

interface HeroCTAProps {
  title: React.ReactNode
  subtitle?: string
  description: string
  primaryCTA: {
    text: string
    to: string
  }
  secondaryCTA?: {
    text: string
    to: string
  }
  badge?: string
  className?: string
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badge,
  className = ""
}) => {
  const ref = useScrollAnimation('fadeIn')

  return (
    <div ref={ref} className={`text-center ${className}`}>
      {badge && (
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-100">
          <span>{badge}</span>
        </div>
      )}
      
      {typeof title === 'string' ? (
        <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
      ) : (
        title
      )}
      
      {subtitle && (
        <h2 className="text-xl text-gray-600 mb-8 leading-relaxed">
          {subtitle}
        </h2>
      )}
      
      <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={primaryCTA.to}
          className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/25 flex items-center justify-center space-x-2"
        >
          <span>{primaryCTA.text}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        {secondaryCTA && (
          <Link
            to={secondaryCTA.to}
            className="group border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <span>{secondaryCTA.text}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default CTASection