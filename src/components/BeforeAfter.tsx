import React from 'react'
import { ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useGSAPAnimation'

interface ComparisonItem {
    before: string
    after: string
}

export const BeforeAfter: React.FC = () => {
    const ref = useScrollAnimation('fadeIn')

    const comparisons: ComparisonItem[] = [
        { before: 'Long answers', after: 'Structured responses' },
        { before: 'Fillers', after: 'Confident delivery' },
        { before: 'Low confidence', after: 'Clarity' }
    ]

    return (
        <section className="relative py-24 sm:py-32 px-4 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-16 sm:mb-24">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
                        <Zap className="w-5 h-5" />
                        <span className="font-semibold text-sm">Transformation Journey</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                        Your Path to{' '}
                        <span className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Communication Excellence
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Watch how Rretoriq transforms your communication from uncertain to exceptional
                    </p>
                </div>

                {/* Modern Comparison Layout */}
                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Gradient Line Connector */}
                        <div className="hidden lg:block absolute top-0 left-0 right-0 h-full">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-indigo-500 to-purple-600 transform -translate-y-1/2"></div>
                        </div>

                        {/* Comparison Items */}
                        <div className="space-y-8 lg:space-y-12 relative z-10">
                            {comparisons.map((item, index) => (
                                <div key={index} className="group relative">
                                    {/* Mobile/Tablet Layout */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Before</p>
                                            <p className="text-xl text-gray-700 font-light line-through decoration-2 decoration-gray-400">{item.before}</p>
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                <ArrowRight className="w-6 h-6 text-white rotate-90" />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-300 shadow-lg">
                                            <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2">After</p>
                                            <p className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">{item.after}</p>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden lg:grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
                                        {/* Before */}
                                        <div className="text-right">
                                            <div className="inline-block bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl px-8 py-6 border-2 border-gray-200 group-hover:scale-105 transition-transform duration-300">
                                                <p className="text-2xl text-gray-600 font-light line-through decoration-2 decoration-gray-400">
                                                    {item.before}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Connector */}
                                        <div className="relative flex items-center justify-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-20">
                                                <ArrowRight className="w-8 h-8 text-white" />
                                            </div>
                                            {/* Pulse Effect */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full opacity-30 animate-ping"></div>
                                            </div>
                                        </div>

                                        {/* After */}
                                        <div className="text-left">
                                            <div className="inline-block bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl px-8 py-6 border-2 border-indigo-300 shadow-xl group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300">
                                                <p className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                    {item.after}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-5 rounded-2xl border-2 border-green-200 shadow-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <div className="text-left">
                                <p className="text-sm text-gray-600 font-medium">Average Improvement</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    85% in 30 days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BeforeAfter
