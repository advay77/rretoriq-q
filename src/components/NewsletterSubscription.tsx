import React, { useState } from 'react'
import { CheckCircle, Loader } from 'lucide-react'

const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    // Simulate API call - replace with actual newsletter service
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      // For now, just show success message
      setStatus('success')
      setMessage('Successfully subscribed! Check your email for confirmation.')
      setEmail('')

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    }
  }

  return (
    <div className="p-4 rounded-xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-lg shadow-emerald-900/15">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h5 className="text-sm font-semibold leading-tight">Stay Updated</h5>
          <p className="text-xs text-slate-200 mt-1">Get the latest tips and updates</p>
        </div>
        {status === 'success' && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
            <CheckCircle className="w-4 h-4" />
            Joined
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === 'loading'}
            className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/35 transition-all min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:via-teal-400 hover:to-sky-400 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader className="w-4 h-4 animate-spin inline mr-1 align-middle" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {message && (
          <p className={`text-xs ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
            {message}
          </p>
        )}

        {status !== 'success' && (
          <p className="text-[11px] text-slate-300/80">No spam. Unsubscribe anytime.</p>
        )}
      </form>
    </div>
  )
}

export default NewsletterSubscription