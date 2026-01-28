import React, { useState, type JSX } from 'react'
import {
    MessageSquare,
    Send,
    Smile,
    Meh,
    Frown,
    ThumbsUp,
    Bug,
    Lightbulb,
    Heart,
    CheckCircle2,
    Loader2
} from 'lucide-react'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '../store/authStore'

type FeedbackType = 'general' | 'bug' | 'feature' | 'content'
type Sentiment = 'angry' | 'sad' | 'neutral' | 'happy' | 'excited'

const sentimentConfig: Record<Sentiment, {
    value: number
    label: string
    icon: JSX.Element
}> = {
    angry: {
        value: 1,
        label: 'Very Bad',
        icon: <Frown />
    },
    sad: {
        value: 2,
        label: 'Bad',
        icon: <Meh />
    },
    neutral: {
        value: 3,
        label: 'Okay',
        icon: <Smile />
    },
    happy: {
        value: 4,
        label: 'Good',
        icon: <ThumbsUp />
    },
    excited: {
        value: 5,
        label: 'Loved it',
        icon: <Heart />
    }
}

export default function Feedback() {
    const { user } = useAuthStore()

    const [feedbackType, setFeedbackType] = useState<FeedbackType>('general')
    const [message, setMessage] = useState('')
    const [sentiment, setSentiment] = useState<Sentiment | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !sentiment) return

        setIsSubmitting(true)

        try {
            await addDoc(collection(db, 'feedback'), {
                type: feedbackType,
                message,
                sentiment,
                rating: sentimentConfig[sentiment].value,
                userEmail: user?.email || 'anonymous',
                userId: user?.id || null,
                createdAt: serverTimestamp(),
                userAgent: navigator.userAgent
            })

            console.log('Feedback submitted successfully')

            setIsSuccess(true)
            setMessage('')
            setSentiment(null)
            setFeedbackType('general')

            setTimeout(() => setIsSuccess(false), 3000)
        } catch (error) {
            console.error('Error submitting feedback:', error)
            // Optionally set an error state here appropriately
        } finally {
            setIsSubmitting(false)
        }
    }

    const getTypeIcon = (type: FeedbackType) => {
        switch (type) {
            case 'bug': return <Bug className="w-5 h-5" />
            case 'feature': return <Lightbulb className="w-5 h-5" />
            case 'content': return <MessageSquare className="w-5 h-5" />
            default: return <ThumbsUp className="w-5 h-5" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-6">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-indigo-900 mb-3">
                        Your Feedback Matters
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Help us improve by sharing your experience.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 relative">

                    {/* Success Overlay */}
                    {isSuccess && (
                        <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center">
                            <CheckCircle2 className="w-14 h-14 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold">Thank you!</h3>
                            <p className="text-gray-600">Feedback submitted successfully.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Sentiment */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 uppercase">
                                Rate your experience
                            </label>

                            <div className="flex gap-5">
                                {(Object.keys(sentimentConfig) as Sentiment[]).map(key => {
                                    const item = sentimentConfig[key]
                                    const active = sentiment === key

                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            title={item.label}
                                            onClick={() => setSentiment(key)}
                                            className={`p-3 rounded-2xl transition-all
                                                ${active
                                                    ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                                                    : 'text-gray-400 hover:bg-gray-50'
                                                }`}
                                        >
                                            {React.cloneElement(item.icon, {
                                                className: `w-8 h-8 ${active ? 'stroke-[2.5px]' : ''}`
                                            })}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-gray-200" />

                        {/* Feedback Type */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase block mb-3">
                                What's this about?
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {(['general', 'bug', 'feature', 'content'] as FeedbackType[]).map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFeedbackType(type)}
                                        className={`p-3 rounded-xl border-2 text-xs font-semibold capitalize
                                            ${feedbackType === type
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="mb-2 flex justify-center">
                                            {getTypeIcon(type)}
                                        </div>
                                        {type === 'feature' ? 'New Feature' : type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase block mb-2">
                                Tell us more
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                placeholder="Share your thoughts..."
                                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !message.trim() || !sentiment}
                            className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2
                                ${isSubmitting || !message.trim() || !sentiment
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}
