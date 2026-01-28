import React from 'react'
import { Users, MessageSquare } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useGSAPAnimation'

interface TrustProofItem {
    icon: React.ReactNode
    text: string
    highlight?: string
}

export interface TrustStripProps {
    items?: TrustProofItem[]
    variant?: 'light' | 'default'
}

export function TrustStrip({
    items,
    variant = 'default'
}: TrustStripProps) {
    const ref = useScrollAnimation('fadeIn')

    const defaultItems: TrustProofItem[] = items || [
        {
            icon: <Users className="w-5 h-5" />,
            text: 'Trusted by students & professionals across',
            highlight: 'Colleges and Companies'
        },
        {
            icon: <MessageSquare className="w-5 h-5" />,
            highlight: '3,000+',
            text: 'AI-powered practice conversations completed'
        }
    ]



    const bgClasses = variant === 'light'
        ? "bg-white border-t border-b border-gray-100"
        : "bg-gradient-to-br from-indigo-50 via-purple-50/30 to-blue-50/20 border-t border-b border-indigo-100/50";

    return (
        <section className={`relative py-16 sm:py-20 px-4 overflow-hidden ${bgClasses}`}>
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div ref={ref} className="relative max-w-7xl mx-auto">
                {/* Desktop Layout - Elegant Horizontal Display */}
                <div className="hidden md:flex items-center justify-center gap-16 lg:gap-24">
                    {defaultItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 group">
                            {/* Icon with elegant background */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                </div>
                            </div>

                            {/* Text content */}
                            <div className="flex flex-col">
                                {item.highlight && (
                                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                                        {item.highlight}
                                    </span>
                                )}
                                <p className="text-gray-700 font-medium text-base leading-tight max-w-xs">
                                    {item.text}
                                </p>
                            </div>

                            {/* Separator - except for last item */}
                            {index < defaultItems.length - 1 && (
                                <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-indigo-300 to-transparent ml-8"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tablet Layout */}
                <div className="hidden sm:grid md:hidden grid-cols-1 gap-10 max-w-2xl mx-auto">
                    {defaultItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-5 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100">
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-md opacity-20"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                {item.highlight && (
                                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                        {item.highlight}
                                    </div>
                                )}
                                <p className="text-gray-700 font-medium text-base leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Layout */}
                <div className="sm:hidden space-y-6 max-w-md mx-auto">
                    {defaultItems.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-md opacity-20"></div>
                                <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {item.highlight && (
                                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                        {item.highlight}
                                    </div>
                                )}
                                <p className="text-gray-700 font-medium text-sm leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustStrip
