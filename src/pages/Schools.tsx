import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { 
  ArrowRight, 
  GraduationCap, 
  BookOpen,
  CheckCircle,
  Brain,
  Award,
  MessageSquare,
  Star,
  Globe,
  Target,
  FileText,
  TrendingUp,
  Shield,
  Volume2
} from 'lucide-react'

export default function Schools() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Dr. Priya Mehta",
      role: "Director of Career Services",
      company: "Indian Institute of Management",
      content: "Rretoriq has revolutionized our MBA students' interview preparation. The mock interview training and professional communication modules have resulted in a 92% placement success rate. Our graduates now confidently handle corporate interviews.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Prof. Rajesh Kumar",
      role: "Head of Training & Placement",
      company: "Engineering College",
      content: "The professional communication training has been transformative for our engineering students. They now excel in technical interviews, client presentations, and workplace communications. Industry feedback has been exceptional.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Dr. Sneha Patel",
      role: "Dean of Student Affairs",
      company: "Medical College",
      content: "Rretoriq's training modules prepare our medical students for professional interactions with patients, colleagues, and during residency interviews. The improvement in communication confidence and clinical presentation skills is remarkable.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Ms. Nikita Tondon",
      role: "CRT Head",
      company: "Engineering College",
      content: "As the CRT Head, I've seen countless tools claim to improve student communication, but Rretoriq truly delivers. The AI-powered feedback helps students identify and correct their mistakes in real-time. My students' confidence in public speaking and professional communication has increased remarkably. It's an invaluable resource for campus recruitment training.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    }
  ]

  const benefits = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Industry-Ready Skills",
      description: "Prepare students for real-world professional scenarios with mock interviews, client presentations, and workplace communication training tailored to their field."
    },
    {
      icon: <FileText className="w-8 h-8 text-green-500" />,
      title: "Career Progress Tracking",
      description: "Monitor student development with detailed reports on interview performance, communication skills, grammar proficiency, and professional vocabulary growth."
    },
    {
      icon: <Volume2 className="w-8 h-8 text-purple-500" />,
      title: "Professional Communication",
      description: "Build confidence in technical presentations, client interactions, and corporate communications across MBA, Engineering, Medical, and Law programs."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: "Placement Success",
      description: "Dramatically improve job placement rates with comprehensive interview preparation, professional etiquette training, and industry-specific communication skills."
    }
  ]

  const features = [
    {
      icon: <Target className="w-10 h-10 text-blue-600" />,
      title: "Mock Interview Training",
      subtitle: "Industry-Specific Interview Preparation",
      description: "Prepare students for corporate interviews with realistic mock sessions tailored to their field. Practice technical interviews for engineering, case studies for MBA, clinical scenarios for medical, and legal reasoning for law students.",
      features: [
        "Field-specific interview scenarios",
        "Real-time feedback and scoring",
        "Multiple interview formats (technical, behavioral, panel)",
        "Industry recruiter insights and tips"
      ]
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-green-600" />,
      title: "Professional Communication",
      subtitle: "Workplace Communication Excellence",
      description: "Develop essential workplace communication skills including presentations, client interactions, team collaboration, and professional email writing. Build confidence for corporate environments across all professional fields.",
      features: [
        "Business presentation training",
        "Client interaction scenarios",
        "Team collaboration exercises",
        "Professional email and report writing"
      ]
    },
    {
      icon: <BookOpen className="w-10 h-10 text-purple-600" />,
      title: "Professional Vocabulary",
      subtitle: "Industry-Specific Language Mastery",
      description: "Master field-specific terminology and professional vocabulary. From medical terminology to legal jargon, business concepts to engineering specifications - build comprehensive professional language skills.",
      features: [
        "Industry-specific terminology banks",
        "Professional context exercises",
        "Technical communication practice",
        "Certification preparation support"
      ]
    },
    {
      icon: <Award className="w-10 h-10 text-orange-600" />,
      title: "Grammar Excellence",
      subtitle: "Professional Writing & Speaking Accuracy",
      description: "Perfect grammar skills for professional contexts including report writing, research papers, business communications, and formal presentations. Achieve accuracy expected in corporate and academic environments.",
      features: [
        "Advanced grammar modules",
        "Professional writing standards",
        "Academic and business contexts",
        "Error analysis and improvement tracking"
      ]
    }
  ]

  const stats = [
    { number: "92%", label: "Interview success rate" },
    { number: "85%", label: "Job placement improvement" },
    { number: "78%", label: "Communication skill boost" },
    { number: "24/7", label: "Career training access" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [testimonials.length])

  const schoolsSeoData = {
    title: "Career Readiness Training for Professional Courses | MBA, Engineering, Medical | Rretoriq",
    description: "Prepare MBA, Engineering, Medical, and Law students for professional success with mock interviews, communication training, and industry-specific skills development.",
    keywords: "career readiness training, professional course preparation, MBA communication skills, engineering interview training, medical student preparation, law school communication, mock interview platform, professional vocabulary training",
    canonicalUrl: "https://rretoriq.com/schools"
  }

  return (
    <>
      <SEO {...schoolsSeoData} />
      <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-4 bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-100">
                  <GraduationCap className="w-4 h-4" />
                  <span>Professional Course Solutions</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                  Career Readiness Training{' '}
                  <span className="font-medium bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    for Professional Courses
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Prepare your MBA, Engineering, Medical, and Law students for professional success with comprehensive communication training, mock interviews, and industry-specific language skills. Transform graduates into workplace-ready professionals.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/25 flex items-center justify-center space-x-2"
                  >
                    <span>Contact Us Today</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    to="/demo"
                    className="group border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
                  >
                    <span>Schedule Demo</span>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl p-8 lg:p-12">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Brain className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">AI-Powered Learning</h3>
                    <p className="text-gray-600">Advanced speech analysis and personalized feedback</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-emerald-600">{stat.number}</div>
                        <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Transform Your Students into{' '}
                <span className="font-medium text-emerald-600">Industry-Ready Professionals</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-24">
              {features.map((feature, index) => (
                <div key={index} className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="text-lg text-gray-600 font-medium">
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    <ul className="space-y-4">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 lg:p-12">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">
                          {index === 0 ? '95%' : index === 1 ? '24/7' : index === 2 ? '80+' : '100+'}
                        </div>
                        <div className="text-gray-600">
                          {index === 0 ? 'Assessment Accuracy' : index === 1 ? 'AI Availability' : index === 2 ? 'Vocabulary Exercises' : 'IELTS Practice Tests'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Speech Analysis */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Why Choose{' '}
                <span className="font-medium text-emerald-600">Rretoriq?</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                  Advanced Speech Analysis
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Advanced Speech Recognition, NLP, and LLM technologies offer detailed and comprehensive feedback on learners' grammar, vocabulary, pronunciation, and fluency.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-emerald-500" />
                    <span className="text-gray-700">AI-Powered Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6 text-blue-500" />
                    <span className="text-gray-700">Speech Recognition</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-purple-500" />
                    <span className="text-gray-700">Precision Feedback</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    <span className="text-gray-700">Progress Tracking</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600">30+</div>
                    <div className="text-sm text-gray-600 mt-2">Analysis Parameters</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">Real-time</div>
                    <div className="text-sm text-gray-600 mt-2">Feedback</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">CEFR</div>
                    <div className="text-sm text-gray-600 mt-2">Standard Aligned</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-orange-600">Multi</div>
                    <div className="text-sm text-gray-600 mt-2">Accent Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Teachers About{' '}
                <span className="font-medium text-emerald-600">Rretoriq</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-light text-gray-900 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
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
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-lg font-medium text-gray-500 mb-8">Supported by</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-600">
                <Brain className="w-6 h-6" />
                <span>NVIDIA</span>
              </div>
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-600">
                <Globe className="w-6 h-6" />
                <span>Google for Startups</span>
              </div>
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-600">
                <Award className="w-6 h-6" />
                <span>AWS</span>
              </div>
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-600">
                <Shield className="w-6 h-6" />
                <span>Alchemist Accelerator</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
              Experience the next generation of{' '}
              <span className="font-medium">
                EFL teaching and learning
              </span>
            </h2>
            
            <p className="text-lg text-emerald-100 mb-12 max-w-2xl mx-auto font-light">
              Join educational institutions worldwide in transforming English language learning with our AI-powered teaching solution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white hover:bg-gray-50 text-emerald-600 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg"
              >
                Contact Us Today
              </Link>
              <Link
                to="/demo"
                className="border border-white/30 hover:border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium text-base transition-all duration-300"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}