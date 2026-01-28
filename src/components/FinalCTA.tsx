import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, Sparkles, Star } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useGSAPAnimation'

export const FinalCTA: React.FC = () => {
    const ref = useScrollAnimation('fadeIn')

    return (
        <section className="relative py-28 sm:py-36 px-4 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl"></div>

                {/* Decorative Stars */}
                <Star className="absolute top-24 right-24 w-6 h-6 text-white/20 animate-pulse" />
                <Star className="absolute bottom-32 left-32 w-8 h-8 text-white/30 animate-pulse delay-500" />
                <Sparkles className="absolute top-1/3 right-1/4 w-6 h-6 text-white/25 animate-pulse delay-700" />
                <Sparkles className="absolute bottom-1/3 left-1/4 w-5 h-5 text-white/20 animate-pulse delay-300" />
            </div>

            <div ref={ref} className="relative max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full mb-10 border border-white/30 shadow-xl">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold text-sm">Transform Your Career Today</span>
                </div>

                {/* Main Headline */}
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tight">
                    Your Communication{' '}
                    <span className="font-semibold block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-blue-200">
                        Decides Your Opportunities.
                    </span>
                </h2>

                {/* Subheading */}
                <p className="text-xl sm:text-2xl text-indigo-100 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
                    Don't let poor communication hold you back. Master the skills that open doors to your dream career.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <Link
                        to="/register"
                        className="group relative bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-3 overflow-hidden"
                    >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10">Start Free Practice</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    </Link>

                    <Link
                        to="/demo"
                        className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/40 hover:border-white/60 px-10 py-5 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-3"
                    >
                        <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        <span>Book a Demo</span>
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 text-white/90">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white shadow-lg"></div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white shadow-lg"></div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 border-2 border-white shadow-lg"></div>
                        </div>
                        <span className="text-sm font-medium ml-2">Join 3,000+ learners</span>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-white/30"></div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                            ))}
                        </div>
                        <span className="text-sm font-medium ml-1">4.9/5 rating</span>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-white/30"></div>
                    <div className="text-sm font-medium">
                        ✓ No credit card required
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FinalCTA
