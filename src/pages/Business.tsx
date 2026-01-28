import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { 
  ArrowRight, 
  Target, 
  Users, 
  Building,
  CheckCircle,
  TrendingUp,
  Globe,
  Clock,
  Shield,
  Brain,
  Award,
  MessageSquare,
  FileText,
  Star
} from 'lucide-react'
import { useFadeInOnMount, useScrollAnimation, useStaggerAnimation } from '../hooks/useGSAPAnimation'

export default function Business() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  // Animation refs
  const heroRef = useFadeInOnMount(0.2)
  const featuresRef = useScrollAnimation('fadeIn')
  const benefitsRef = useScrollAnimation('slideLeft')
  const staggerRef = useStaggerAnimation(0.1)

  const testimonials = [
    {
      name: "Rajesh Gupta",
      role: "Chief People Officer",
      company: "InfoTech Solutions",
      content: "Rretoriq transformed our hiring process. Candidates who went through their mock interview training showed 92% better performance in actual interviews. Our new hires now demonstrate exceptional communication skills from day one.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Priya Sharma",
      role: "HR Director",
      company: "Global Enterprises Ltd",
      content: "The professional communication training has been a game-changer. Our team's presentation skills, client interactions, and workplace vocabulary improved dramatically. ROI was visible within 2 months.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Amit Desai",
      role: "Learning & Development Head",
      company: "TechCorp India",
      content: "Grammar and vocabulary training modules are exceptional. Our employees now communicate more professionally in emails, reports, and meetings. Client satisfaction scores increased by 35%.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    }
  ]

  const stats = [
    { number: "92%", label: "Interview success rate" },
    { number: "85%", label: "Communication improvement" },
    { number: "500+", label: "Mock interview scenarios" },
    { number: "75%", label: "Faster skill development" }
  ]

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Mock Interview Training",
      description: "Comprehensive interview preparation with 500+ realistic scenarios covering technical, behavioral, and leadership questions. AI provides instant feedback on communication effectiveness.",
      benefits: ["500+ interview scenarios", "Real-time performance analysis", "Industry-specific questions", "Confidence building exercises"]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
      title: "Professional Communication Skills",
      description: "Master workplace presentations, client meetings, team collaboration, and networking skills through interactive AI-powered training modules.",
      benefits: ["Presentation skills training", "Client interaction practice", "Meeting facilitation", "Professional networking"]
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Grammar & Writing Excellence",
      description: "Advanced grammar analysis and professional writing coaching for emails, reports, proposals, and formal documentation with instant correction feedback.",
      benefits: ["Real-time grammar checking", "Professional writing templates", "Email communication mastery", "Business document creation"]
    },
    {
      icon: <Brain className="w-8 h-8 text-orange-600" />,
      title: "Vocabulary Enhancement",
      description: "Industry-specific vocabulary training covering business terminology, technical jargon, and professional expressions for enhanced workplace communication.",
      benefits: ["Industry-specific terms", "Professional expressions", "Technical vocabulary", "Contextual usage training"]
    }
  ]

  const industries = [
    { name: "Call Centers", description: "Boost customer satisfaction with improved communication skills" },
    { name: "Sales Teams", description: "Enhance client interactions and presentation capabilities" },
    { name: "HR Departments", description: "Streamline recruitment with accurate language assessment" },
    { name: "Universities", description: "Improve student placement and academic success rates" },
    { name: "Language Schools", description: "Optimize student placement and track learning progress" },
    { name: "International Companies", description: "Bridge communication gaps in global teams" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [testimonials.length])

  const businessSeoData = {
    title: "Corporate English Training & Assessment | AI-Powered Solutions for Business | Rretoriq",
    description: "Transform your workforce communication with Rretoriq's AI-powered English assessment and training platform. Reduce hiring mistakes by 87% and improve team efficiency by 42%.",
    keywords: "corporate english training, employee assessment, AI language testing, business communication, workforce development, english proficiency, CEFR assessment",
    canonicalUrl: "https://rretoriq.com/business"
  }

  return (
    <>
      <SEO {...businessSeoData} />
      <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-4 bg-gradient-to-b from-blue-50/50 via-white to-gray-50/30">
          <div ref={heroRef} className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100">
                  <Building className="w-4 h-4" />
                  <span>Corporate Solutions</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                  Professional Communication{' '}
                  <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Training Platform
                  </span>
                </h1>
                
                <h2 className="text-xl text-gray-600 mb-8 leading-relaxed">
                  AI-Powered. Results-Driven. Career-Focused.
                </h2>
                
                <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
                  Enhance your workforce communication skills with mock interview practice, grammar mastery, and professional vocabulary training. Perfect for corporate teams, HR departments, call centers, and professional development programs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center space-x-2"
                  >
                    <span>Get Custom Quote</span>
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
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 lg:p-12">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                        <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-lg font-medium text-gray-500 mb-8">Trusted by leading institutions worldwide</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-600">
                <Building className="w-6 h-6" />
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

        {/* Industry Solutions */}
        <section ref={featuresRef} className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Industry-Focused,{' '}
                <span className="font-medium text-blue-600">Results-Driven</span>
                {' '}Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                Assess, place, and develop English skills with accuracy and efficiency. Make data-driven decisions about hiring, promoting and educating your team.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Served */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Perfect for{' '}
                <span className="font-medium text-blue-600">Every Industry</span>
              </h2>
            </div>

            <div ref={staggerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {industry.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section ref={benefitsRef} className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Why Industry Leaders{' '}
                <span className="font-medium text-blue-600">Choose Rretoriq</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Accelerate Professional Development
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Transform your workforce with comprehensive communication training. Our platform delivers mock interview preparation, professional communication skills, grammar excellence, and vocabulary enhancement. Companies using Rretoriq report 89% improvement in employee interview success rates and significant gains in workplace communication effectiveness.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">89% Interview Success</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <span className="text-gray-700">3x Faster Skill Development</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-purple-500" />
                    <span className="text-gray-700">AI-Powered Training</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-orange-500" />
                    <span className="text-gray-700">Progress Analytics</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-4">89%</div>
                  <div className="text-lg text-gray-700">Improvement in employee interview performance</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Hear from{' '}
                <span className="font-medium text-blue-600">Our Clients</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
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
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Frequently Asked{' '}
                <span className="font-medium text-blue-600">Questions</span>
              </h2>
            </div>

            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  How does Rretoriq's professional communication training work?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered platform provides comprehensive training in mock interviews, professional communication, grammar, and vocabulary. Employees practice real-world scenarios, receive instant feedback, and track their progress through interactive modules designed to improve workplace communication effectiveness.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Can Rretoriq help employees from diverse professional backgrounds?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely! Our platform is designed for professionals from all industries - technology, healthcare, finance, consulting, and more. We provide customized training modules that address industry-specific communication needs while building core professional communication skills.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  How do you track progress and measure ROI for communication training?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our platform provides detailed analytics on interview performance, communication skill development, grammar improvement, and vocabulary enhancement. Track individual and team progress with measurable outcomes like interview success rates, presentation quality scores, and professional communication effectiveness metrics.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Can we integrate Rretoriq with our existing systems?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, Rretoriq offers API integration capabilities and can be customized to work with your existing HR systems, learning management platforms, and other business tools for seamless workflow integration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
              Ready to transform{' '}
              <span className="font-medium">
                your team's communication?
              </span>
            </h2>
            
            <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto font-light">
              Join leading organizations worldwide in elevating their workforce with professional communication training, mock interview preparation, and advanced language skills development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg"
              >
                Get Custom Quote
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