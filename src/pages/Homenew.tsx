import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
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
  const ctaRef = useScrollAnimation('fadeIn')
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
        <section className="relative pt-24 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-gray-50/30"></div>
          
          <div ref={heroRef} className="relative max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extralight mb-6 leading-tight tracking-wide font-serif" style={{ color: '#000000' }}>
                Rretoriq
              </h1>
              
              <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-indigo-100 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>Bridging communication with Intelligence</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
                Master Professional{' '}
                <span className="font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Communication Skills
                </span>
                <br />
                <span className="font-light">with AI-Powered Training</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Excel in job interviews, workplace communication, and professional presentations. 
                Enhance your grammar, vocabulary, and speaking confidence with personalized AI coaching.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/demo"
                  className="group border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-indigo-50 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gray-50/50">
          <div ref={featuresRef} className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Everything you need to{' '}
                <span className="font-medium text-indigo-600">excel professionally</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive training modules designed for modern professionals and students preparing for their career journey
              </p>
            </div>

            <div ref={staggerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mock Interviews</h3>
                <p className="text-gray-600 leading-relaxed">
                  Practice with AI interviewers across different industries. Get real-time feedback and improve your interview performance.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Skills</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master professional communication, presentations, and workplace interactions with personalized coaching.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Grammar Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Perfect your grammar and writing skills for professional reports, emails, and academic papers.
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
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

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div ref={testimonialsRef} className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Success stories from{' '}
                <span className="font-medium text-indigo-600">our learners</span>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-3xl p-8 md:p-12 border border-gray-100">
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-8">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl font-light text-gray-900 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover"
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

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div ref={ctaRef} className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
              Ready to transform your{' '}
              <span className="font-medium">communication skills?</span>
            </h2>
            
            <p className="text-lg text-indigo-100 mb-12 max-w-2xl mx-auto font-light">
              Join thousands of professionals who have accelerated their careers with Bridging communication with Intelligence. Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/pricing"
                className="border border-white/30 hover:border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
