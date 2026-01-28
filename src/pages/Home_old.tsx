import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Users, Briefcase, CheckCircle, Sparkles, Star, Zap, Play } from 'lucide-react'
import SEO, { seoData } from '../components/SEO'

const Home: React.FC = () => {

  return (
    <>
      <SEO {...seoData.home} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-orange-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative text-center max-w-5xl mx-auto">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black mb-8 leading-none animate-fade-in-up">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Rretoriq
            </span>
          </h1>
          
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto animate-fade-in-up animation-delay-200">
            Enterprise Communication Training for{' '}
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent font-semibold">
              Institutions & Professionals
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up animation-delay-400">
            <Link
              to="/demo"
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              <Play className="w-6 h-6 mr-3 inline" />
              Try Demo First
              <ArrowRight className="w-6 h-6 ml-3 inline group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="group border-2 border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 backdrop-blur-sm text-orange-400 hover:text-orange-300 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-6 h-6 mr-3 inline" />
              View Pricing
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400 animate-fade-in-up animation-delay-600">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border-2 border-gray-800"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full border-2 border-gray-800"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full border-2 border-gray-800"></div>
              </div>
              <span className="font-medium">50+ Institutions Trust Us</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Free Forever Plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-emerald-500/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Features</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8 leading-tight">
              Complete AI-Powered Features to{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Excel in Communication
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Scalable AI-powered training solutions designed for institutions and individual professionals across India.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link to="/demo" className="feature-card group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-orange-500/20 hover:border-orange-400/40 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-pink-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Interview Excellence</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">Practice with real questions from top companies. Get AI feedback on confidence, communication, and professional presence.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-orange-400 font-bold group-hover:translate-x-2 transition-transform">
                    See Demo <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                  <div className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
                    Live Practice
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/demo" className="feature-card group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">IELTS Mastery</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">Master all four IELTS skills with personalized AI feedback. Tailored for Indian test-takers with proven success strategies.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-emerald-400 font-bold group-hover:translate-x-2 transition-transform">
                    Try Demo <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
                    Interactive
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/register" className="feature-card group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Start Your Journey</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">Choose from individual or institutional packages. Scalable solutions for organizations and professionals.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-purple-400 font-bold group-hover:translate-x-2 transition-transform">
                    Get Started <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                  <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                    Professional
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-orange-500/20 to-pink-500/10 rounded-full blur-3xl"></div>
        
        <div className="cta-content relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span>Start Your Transformation Today</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Unlock Your
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Communication Potential?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join leading institutions and professionals who have transformed their communication outcomes with our enterprise AI platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/demo" className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25">
              <Play className="w-6 h-6 mr-3 inline" />
              Try Interactive Demo
              <ArrowRight className="w-6 h-6 ml-3 inline group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/pricing" className="group border-2 border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 backdrop-blur-sm text-orange-400 hover:text-orange-300 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105">
              <Zap className="w-6 h-6 mr-3 inline" />
              View Pricing Plans
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Individual & Institutional Plans</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Enterprise Solutions</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Bulk Licensing Available</span>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

export default Home