import React from 'react'
import { Link } from 'react-router-dom'
import { Play, ArrowRight, Sparkles } from 'lucide-react'
import { useFadeInOnMount } from '../hooks/useGSAPAnimation'

interface HeroSectionProps {
    onWatchDemo?: () => void
    demoVideoUrl?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    onWatchDemo,
    demoVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
}) => {
    const heroRef = useFadeInOnMount(0.2)
    const [showDemoModal, setShowDemoModal] = React.useState(false)

    const handleWatchDemo = () => {
        if (onWatchDemo) {
            onWatchDemo()
        } else {
            setShowDemoModal(true)
        }
    }

    return (
        <>
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 -z-10"></div>

                {/* Decorative blurs */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-200/20 rounded-full filter blur-3xl -z-10"></div>

                <div ref={heroRef} className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Section - Text Content */}
                        <div className="flex flex-col justify-center space-y-8">
                            {/* Micro Text Badge */}
                            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200 w-fit hover:shadow-md transition-shadow duration-300">
                                <Sparkles className="w-4 h-4" />
                                <span>Built for Indian students, professionals & recruiters</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                                Master{' '}
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Communication
                                </span>
                                .{' '}
                                <span className="text-gray-900">Ace Interviews.</span>
                                <br />
                                <span className="text-gray-700">With India's First AI Communication Coach.</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl font-light">
                                Practice real interview questions, get instant AI feedback, and improve how you
                                speak — not just what you say.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {/* Primary Button */}
                                <Link
                                    to="/auth?mode=signup"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30 group"
                                >
                                    <span>Start Free Practice</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                {/* Secondary Button */}
                                <button
                                    onClick={handleWatchDemo}
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-full transition-all duration-300 hover:bg-gray-50 group"
                                >
                                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    <span>Watch 30-sec Demo</span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-gray-200">
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">10K+</div>
                                    <div className="text-sm text-gray-600">Students Trained</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">4.9★</div>
                                    <div className="text-sm text-gray-600">Average Rating</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">85%</div>
                                    <div className="text-sm text-gray-600">Success Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - AI Interface Mockup */}
                        <div className="relative hidden lg:flex items-center justify-center">
                            {/* Phone/Device Mockup */}
                            <div className="relative w-full max-w-md">
                                {/* Outer glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-3xl blur-2xl opacity-20"></div>

                                {/* Device Frame */}
                                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                                    {/* Device Header */}
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                                        <div className="text-white font-semibold text-sm">AI Interview Coach</div>
                                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                                    </div>

                                    {/* Interface Content */}
                                    <div className="p-6 space-y-4">
                                        {/* Question Display */}
                                        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
                                            <div className="text-xs font-semibold text-indigo-600 mb-2">QUESTION</div>
                                            <div className="text-gray-900 font-medium">
                                                "Tell me about a time you overcame a technical challenge in your project."
                                            </div>
                                        </div>

                                        {/* Recording Indicator */}
                                        <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-3 border border-red-200">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                            <div className="text-sm text-gray-700 font-medium">Recording your response...</div>
                                        </div>

                                        {/* AI Feedback Section */}
                                        <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-semibold text-green-700 mb-1">INSTANT FEEDBACK</div>
                                                    <div className="text-sm text-gray-700">
                                                        <span className="font-medium">Grammar:</span> Excellent
                                                        <br />
                                                        <span className="font-medium">Clarity:</span> 8.5/10
                                                        <br />
                                                        <span className="font-medium">Pace:</span> Natural
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                                                <div className="text-2xl font-bold text-blue-600">92%</div>
                                                <div className="text-xs text-gray-600 mt-1">Accuracy</div>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                                                <div className="text-2xl font-bold text-purple-600">+8%</div>
                                                <div className="text-xs text-gray-600 mt-1">Improvement</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Device Footer */}
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                        <div className="flex justify-center space-x-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-8 -right-8 w-20 h-20 bg-indigo-100 rounded-full opacity-60"></div>
                                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-100 rounded-full opacity-60"></div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile AI Demo Mockup (visible on small screens) */}
                    <div className="lg:hidden mt-12 flex justify-center">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-3xl blur-2xl opacity-20"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                                    <div className="text-white font-semibold text-sm">AI Interview Coach</div>
                                    <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                                        <div className="text-xs font-semibold text-indigo-600 mb-1">QUESTION</div>
                                        <div className="text-sm text-gray-900 font-medium">Tell me about a time you overcame a technical challenge.</div>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-red-50 rounded-lg p-2 border border-red-200">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <div className="text-xs text-gray-700 font-medium">Recording...</div>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                                        <div className="text-xs font-semibold text-green-700 mb-2">INSTANT FEEDBACK</div>
                                        <div className="text-xs text-gray-700 space-y-1">
                                            <div><span className="font-medium">Grammar:</span> Excellent</div>
                                            <div><span className="font-medium">Clarity:</span> 8.5/10</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Modal */}
            {showDemoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-white font-semibold">30-Second Demo</h2>
                            <button
                                onClick={() => setShowDemoModal(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                            <iframe
                                width="100%"
                                height="100%"
                                src={demoVideoUrl}
                                title="Rretoriq 30-Second Demo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default HeroSection
