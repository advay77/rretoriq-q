import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { sessionLimitService, type SessionLimits } from '../services/sessionLimitService'

interface SessionLimitBannerProps {
  userId: string
  className?: string
}

export default function SessionLimitBanner({ userId, className = '' }: SessionLimitBannerProps) {
  const [limits, setLimits] = useState<SessionLimits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLimits = async () => {
      try {
        const usage = await sessionLimitService.getMonthlyUsage(userId)
        setLimits(usage)
      } catch (error) {
        console.error('Failed to load session limits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLimits()
  }, [userId])

  if (loading || !limits) {
    return null
  }

  const getStatusColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 100) return 'text-red-600 bg-red-50 border-red-200'
    if (percentage >= 75) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getIcon = (used: number, limit: number) => {
    if (used >= limit) return <AlertCircle className="w-4 h-4" />
    if (used / limit >= 0.75) return <Clock className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Usage</h3>
      
      <div className="space-y-4">
        {/* Mock Interviews */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Mock Interviews</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Technical */}
            <div className={`px-4 py-3 rounded-lg border ${getStatusColor(limits.techInterview.used, limits.techInterview.limit)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Technical</span>
                {getIcon(limits.techInterview.used, limits.techInterview.limit)}
              </div>
              <p className="text-xs opacity-80">
                {limits.techInterview.used}/{limits.techInterview.limit} used
              </p>
            </div>

            {/* HR */}
            <div className={`px-4 py-3 rounded-lg border ${getStatusColor(limits.hrInterview.used, limits.hrInterview.limit)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">HR</span>
                {getIcon(limits.hrInterview.used, limits.hrInterview.limit)}
              </div>
              <p className="text-xs opacity-80">
                {limits.hrInterview.used}/{limits.hrInterview.limit} used
              </p>
            </div>

            {/* Aptitude */}
            <div className={`px-4 py-3 rounded-lg border ${getStatusColor(limits.aptitudeInterview.used, limits.aptitudeInterview.limit)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Aptitude</span>
                {getIcon(limits.aptitudeInterview.used, limits.aptitudeInterview.limit)}
              </div>
              <p className="text-xs opacity-80">
                {limits.aptitudeInterview.used}/{limits.aptitudeInterview.limit} used
              </p>
            </div>
          </div>
        </div>

        {/* Let's Communicate */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Let's Communicate</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Speaking */}
            <div className={`px-4 py-3 rounded-lg border ${getStatusColor(limits.speaking.used, limits.speaking.limit)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Speaking</span>
                {getIcon(limits.speaking.used, limits.speaking.limit)}
              </div>
              <p className="text-xs opacity-80">
                {limits.speaking.used}/{limits.speaking.limit} used
              </p>
            </div>

            {/* Reading */}
            <div className={`px-4 py-3 rounded-lg border ${getStatusColor(limits.reading.used, limits.reading.limit)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Reading</span>
                {getIcon(limits.reading.used, limits.reading.limit)}
              </div>
              <p className="text-xs opacity-80">
                {limits.reading.used}/{limits.reading.limit} used • Max 3 Q/session
              </p>
            </div>

            {/* Writing */}
            <div className={`px-4 py-3 rounded-lg border ${getStatusColor(limits.writing.used, limits.writing.limit)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Writing</span>
                {getIcon(limits.writing.used, limits.writing.limit)}
              </div>
              <p className="text-xs opacity-80">
                {limits.writing.used}/{limits.writing.limit} used • Max 2 Q/session
              </p>
            </div>
          </div>
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Limits reset on the 1st of each month
        </p>
      </div>
    </div>
  )
}
