import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Sparkles, Stars, Zap } from 'lucide-react'

interface ComingSoonPageProps {
  title: string
  description: string
  icon: React.ReactNode
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title, description, icon }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Background orbs animation
    gsap.to('.floating-orb', {
      y: -20,
      duration: 3,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.5
    })

    // Entrance animations
    tl.fromTo(iconRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' }
    )
    .fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(descRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(cardRef.current,
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    )

    // Sparkle animation
    gsap.to('.sparkle', {
      rotation: 360,
      duration: 8,
      ease: 'none',
      repeat: -1
    })

    gsap.to('.pulse-dot', {
      scale: 1.2,
      opacity: 0.7,
      duration: 2,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.3
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="floating-orb absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
        <div className="floating-orb absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="floating-orb absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="text-center max-w-lg mx-auto px-6 relative z-10">
        {/* Icon Container */}
        <div className="flex justify-center mb-8" ref={iconRef}>
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-purple-500/30 shadow-2xl">
              <div className="text-purple-400 scale-110">
                {icon}
              </div>
            </div>
            <Sparkles className="sparkle absolute -top-2 -right-2 w-5 h-5 text-purple-400" />
            <Stars className="sparkle absolute -bottom-1 -left-2 w-4 h-4 text-cyan-400" />
            <Zap className="sparkle absolute top-1 -left-3 w-3 h-3 text-emerald-400" />
          </div>
        </div>

        {/* Title */}
        <h1 
          ref={titleRef}
          className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4"
        >
          {title}
        </h1>

        {/* Description */}
        <p 
          ref={descRef}
          className="text-gray-400 text-lg mb-10 leading-relaxed"
        >
          {description}
        </p>

        {/* Coming Soon Card */}
        <div 
          ref={cardRef}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="pulse-dot w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
            <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Coming Soon
            </p>
            <div className="pulse-dot w-3 h-3 bg-cyan-400 rounded-full ml-2"></div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            We're crafting something extraordinary with cutting-edge AI technology. 
            <span className="block mt-2 text-purple-400 font-semibold">Stay tuned for the future of communication!</span>
          </p>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-center space-x-2 mb-3">
              <div className="pulse-dot w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="pulse-dot w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="pulse-dot w-2 h-2 bg-cyan-400 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Development in Progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonPage