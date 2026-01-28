import React from 'react'
import { Link } from 'react-router-dom'
import { Video, Zap, MessageCircle, Clock, ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useGSAPAnimation'

interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
    color: string
}

export const SolutionFeatures: React.FC = () => {
    const ref = useScrollAnimation('fadeIn')

    const features: FeatureCardProps[] = [
        {
            icon: <Video className="w-7 h-7" />,
            title: 'Real Interview Simulations',
            description: 'Experience authentic interview scenarios with AI interviewers that adapt to your responses and industry.',
            color: 'indigo'
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: 'Instant Personalized Feedback',
            description: 'Get detailed analysis of your communication, grammar, vocabulary, and confidence in real-time.',
            color: 'purple'
        },
        {
            icon: <MessageCircle className="w-7 h-7" />,
            title: 'Framework-Based Answers',
            description: 'Master proven frameworks like STAR and PREP to structure your responses effectively.',
            color: 'blue'
        },
        {
            icon: <Clock className="w-7 h-7" />,
            title: 'Unlimited Practice, Anytime',
            description: 'Practice as much as you want, whenever you want. Your 24×7 AI coach is always ready.',
            color: 'violet'
        }
    ]

    const getColorClasses = (color: string) => {
        const colors: { [key: string]: { bg: string; hover: string; icon: string; gradient: string } } = {
            indigo: {
                bg: 'bg-indigo-50',
                hover: 'group-hover:bg-indigo-100',
                icon: 'text-indigo-600',
                gradient: 'from-indigo-600 to-indigo-700'
            },
            purple: {
                bg: 'bg-purple-50',
                hover: 'group-hover:bg-purple-100',
                icon: 'text-purple-600',
                gradient: 'from-purple-600 to-purple-700'
            },
            blue: {
                bg: 'bg-blue-50',
                hover: 'group-hover:bg-blue-100',
                icon: 'text-blue-600',
                gradient: 'from-blue-600 to-blue-700'
            },
            violet: {
                bg: 'bg-violet-50',
                hover: 'group-hover:bg-violet-100',
                icon: 'text-violet-600',
                gradient: 'from-violet-600 to-violet-700'
            }
        }
        return colors[color]
    }

    return (
        <section className="relative py-24 sm:py-32 px-4 bg-white overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white"></div>

            <div ref={ref} className="relative max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                        Meet Rretoriq —{' '}
                        <span className="font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Your 24×7 AI Communication Coach
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Transform your communication skills with intelligent, personalized training designed for real-world success
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-14">
                    {features.map((feature, index) => {
                        const colorClasses = getColorClasses(feature.color)
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${colorClasses.bg} ${colorClasses.hover} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg`}>
                                        <div className={colorClasses.icon}>
                                            {feature.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* CTA Button */}
                <div className="flex justify-center">
                    <Link
                        to="/register"
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white px-10 py-5 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                    >
                        <span>Start Practicing for Free</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default SolutionFeatures
