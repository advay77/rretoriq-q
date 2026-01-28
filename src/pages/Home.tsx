import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import WordPhraseCard from '../components/WordPhraseCard'
import TrustStrip from '../components/TrustStrip'
import SolutionFeatures from '../components/SolutionFeatures'
import BeforeAfter from '../components/BeforeAfter'
import FinalCTA from '../components/FinalCTA'
import {
  ArrowRight,
  Target,
  Users,
  BarChart3,
  Play,
  Sparkles,
  Star
} from 'lucide-react'
import { useFadeInOnMount, useScrollAnimation, useStaggerAnimation } from '../hooks/useGSAPAnimation'

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // SEO Data
  const seoData = {
    home: {
      title: "Master Professional Communication Skills with AI | Mock Interview Practice | Rretoriq",
      description: "Excel in job interviews and workplace communication with AI-powered training. Improve your professional speaking, grammar, and vocabulary for career success.",
      keywords: "mock interview practice, professional communication skills, AI career training, job interview preparation, workplace communication, grammar training, vocabulary improvement",
      canonicalUrl: "https://rretoriq.com"
    }
  }

  // Animation refs
  const heroRef = useFadeInOnMount(0.2)
  const featuresRef = useScrollAnimation('fadeIn')
  const testimonialsRef = useScrollAnimation('slideRight')
  const staggerRef = useStaggerAnimation(0.15)

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MBA Student",
      company: "IIM Bangalore",
      content: "The mock interview practice was a game-changer for my placement season. I practiced with 50+ scenarios and improved my communication confidence dramatically. Landed my dream job at a Fortune 500 company with 90% higher package than expected!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Arjun Patel",
      role: "Software Engineer",
      company: "Tech Mahindra",
      content: "My grammar and professional vocabulary improved tremendously with Rretoriq. The AI feedback helped me communicate more effectively in client meetings and presentations. Got promoted to Team Lead within 8 months of using the platform!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Sneha Reddy",
      role: "Medical Student",
      company: "AIIMS Delhi",
      content: "As a medical student, communication skills are crucial for patient interaction and presentations. Rretoriq helped me build confidence in medical terminology usage and professional conversations. Now I excel in case presentations and patient counseling!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ]
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <>
      <SEO {...seoData.home} />
      <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-10 sm:pt-10 lg:pt-10 pb-24 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-gray-50/30"></div>

          <div ref={heroRef} className="relative max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-semibold mb-8 leading-tight tracking-wide font-serif text-brand-gradient-dark drop-shadow-sm">
                Rretoriq
              </h1>

              <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium mb-10 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <Sparkles className="w-4 h-4" />
                <span>Bridging communication with Intelligence</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-10 leading-tight tracking-tight">
                Master Professional{' '}
                <span className="font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Communication Skills
                </span>
                <br />
                <span className="font-light">with AI-Powered Training</span>
              </h2>

              <p className="text-xl text-gray-600 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
                Excel in job interviews, workplace communication, and professional presentations.
                Enhance your grammar, vocabulary, and speaking confidence with personalized AI coaching.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 flex items-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/demo"
                  className="group border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg flex items-center space-x-2"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Watch Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="relative py-32 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-indigo-100/60 backdrop-blur-sm text-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-indigo-200/50 shadow-sm">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                <span>The Challenge</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                Why Most People{' '}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Struggle in Interviews
                </span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-600">
                  — Even When They're Smart
                </span>
              </h2>
            </div>

            {/* Problem Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Card 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Answers Feel Unstructured
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Without a clear framework, responses ramble and fail to highlight key achievements, leaving interviewers confused about your actual capabilities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Nervous Delivery Reduces Confidence
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Anxiety causes rushed speech, filler words, and poor body language, undermining your message and making you appear less competent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        No Personalized Feedback
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Friends and family can't provide expert-level critique. You keep making the same mistakes without knowing what needs improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        No Realistic Practice Environment
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Reading tips online isn't enough. Without real-time simulation and pressure, you can't build the muscle memory needed to perform under stress.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-indigo-200/50">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-700 font-medium">
                  These challenges hold back even the most qualified candidates
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Trust Strip */}
        <TrustStrip variant={'light'} />

        {/* Solution Features Section */}
        <SolutionFeatures />

        {/* Before vs After Section */}
        <BeforeAfter />

        {/* Features Grid */}
        <section className="py-28 bg-gray-50/50">
          <div ref={featuresRef} className="max-w-7xl mx-auto px-4">
            {/* Word & Phrase of the Day */}
            <div className="mb-20">
              <WordPhraseCard className="max-w-4xl mx-auto" />
            </div>

            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Everything you need to{' '}
                <span className="font-medium text-indigo-600">excel professionally</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive training modules designed for modern professionals and students preparing for their career journey
              </p>
            </div>

            <div ref={staggerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mock Interviews</h3>
                <p className="text-gray-600 leading-relaxed">
                  Practice with AI interviewers across different industries. Get real-time feedback and improve your interview performance.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Skills</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master professional communication, presentations, and workplace interactions with personalized coaching.
                </p>
              </div>


              <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Grammar Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Perfect your grammar and writing skills for professional reports, emails, and academic papers.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Vocabulary Enhancement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build professional vocabulary and industry-specific terminology to communicate with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-white via-indigo-50/30 to-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-indigo-100/60 backdrop-blur-sm text-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-indigo-200/50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Simple & Effective</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                How{' '}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  It Works
                </span>
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your interview skills in three simple steps
              </p>
            </div>

            {/* 3-Step Flow */}
            <div className="relative max-w-6xl mx-auto">
              {/* Connecting Line - Hidden on mobile */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 mx-32" style={{ zIndex: 0 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>
                {/* Step 1 */}
                <div className="group relative">
                  <div className="text-center">
                    {/* Icon Container */}
                    <div className="relative inline-block mb-8">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                      {/* Icon Circle */}
                      <div className="relative w-32 h-32 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>

                        {/* Step Number Badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                          1
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Answer AI Interview Questions
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Practice with realistic interview scenarios powered by advanced AI that adapts to your responses
                    </p>
                  </div>

                  {/* Arrow - Hidden on mobile */}
                  <div className="hidden lg:block absolute top-20 -right-8 text-indigo-400">
                    <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative">
                  <div className="text-center">
                    {/* Icon Container */}
                    <div className="relative inline-block mb-8">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                      {/* Icon Circle */}
                      <div className="relative w-32 h-32 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>

                        {/* Step Number Badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                          2
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Get Instant Feedback
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Receive detailed analysis on your communication, structure, and delivery in real-time
                    </p>
                  </div>

                  {/* Arrow - Hidden on mobile */}
                  <div className="hidden lg:block absolute top-20 -right-8 text-purple-400">
                    <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDelay: '0.5s' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative">
                  <div className="text-center">
                    {/* Icon Container */}
                    <div className="relative inline-block mb-8">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                      {/* Icon Circle */}
                      <div className="relative w-32 h-32 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>

                        {/* Step Number Badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                          3
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Improve Clarity, Confidence & Delivery
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Master your communication skills and ace your next interview with measurable improvement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-20 text-center">
              <Link
                to="/register"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105"
              >
                <span>Start Your Free Practice</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>

        {/* Who Is This For Section */}
        <section className="relative py-32 px-4 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-purple-100/60 backdrop-blur-sm text-purple-700 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-purple-200/50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>For Everyone</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                Who Is{' '}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  This For?
                </span>
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Whether you're starting your career or scaling your team, Rretoriq helps you communicate better
              </p>
            </div>

            {/* User Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1: Students & Jobseekers */}
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Students & Jobseekers
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Ace your campus placements, internship interviews, and land your dream job with confidence
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Practice unlimited mock interviews</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Build interview confidence</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Master STAR framework answers</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Working Professionals */}
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Working Professionals
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Advance your career with better presentations, client meetings, and leadership communication
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Improve presentation skills</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Enhance workplace communication</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Prepare for promotions & role changes</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Companies & Recruiters */}
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Companies & Recruiters
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Train your teams, assess candidates better, and build a culture of effective communication
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Upskill your workforce</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Standardize interview training</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Track team progress & analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join <span className="font-semibold text-indigo-600">10,000+ users</span> who are already improving their communication skills with Rretoriq
              </p>
            </div>
          </div>
        </section>

        {/* Plans / Entry Point Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-white via-purple-50/20 to-white overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-indigo-100/60 backdrop-blur-sm text-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-indigo-200/50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Choose Your Plan</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                Start Your Journey{' '}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Today
                </span>
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Begin with our free plan or unlock unlimited potential with Premium
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan Card */}
              <div className="group relative">
                {/* Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-10 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-bold text-gray-900">Free Plan</h3>
                      <div className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        Starter
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Perfect for getting started and exploring the platform
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">$0</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-10 flex-grow">
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Limited interview questions</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Basic AI feedback</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Access to core features</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Community support</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/register"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-xl text-center block"
                  >
                    Get Started for Free
                  </Link>
                </div>
              </div>

              {/* Premium Plan Card */}
              <div className="group relative">
                {/* Popular Badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ Most Popular
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                {/* Card */}
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-bold text-white">Premium AI Coach</h3>
                      <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30">
                        Pro
                      </div>
                    </div>
                    <p className="text-indigo-100 leading-relaxed">
                      Unlock unlimited practice and advanced analytics
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-white">$29</span>
                      <span className="text-indigo-100 ml-2">/month</span>
                    </div>
                    <p className="text-indigo-200 text-sm mt-2">Billed monthly, cancel anytime</p>
                  </div>

                  {/* Features */}
                  <div className="mb-10 flex-grow">
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-medium">Unlimited interview simulations</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-medium">Advanced AI feedback & analytics</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-medium">Personalized improvement plans</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-medium">Industry-specific scenarios</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-medium">Priority support</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white font-medium">Progress tracking & reports</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/pricing"
                    className="w-full bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl text-center block group-hover:scale-105"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-4">
                Not sure which plan is right for you?
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                <span>Compare all features</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-28 bg-white">
          <div ref={testimonialsRef} className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Success stories from{' '}
                <span className="font-medium text-indigo-600">our learners</span>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-3xl p-10 md:p-14 border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-10">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 text-yellow-400 fill-current drop-shadow-sm" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-light text-gray-900 mb-10 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-5">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600 font-light">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 shadow-sm ${index === currentTestimonial ? 'w-10 bg-indigo-600' : 'w-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <FinalCTA />
      </div>
    </>
  )
  //Pushed to main
}
