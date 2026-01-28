import React from 'react';
import {
  Brain,
  Target,
  Users,
  Award,
  Zap,
  Globe,
  Heart,
  CheckCircle,
  Star,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Learning',
      description: 'Advanced machine learning algorithms provide personalized feedback and adaptive learning paths.',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-600'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goal-Oriented Practice',
      description: 'Structured practice sessions designed to help you achieve specific communication goals.',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert-Designed Content',
      description: 'Curriculum developed by certified IELTS trainers and interview coaching experts.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-600'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Proven Results',
      description: '95% of users see measurable improvement within their first month of practice.',
      gradient: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-600'
    }
  ];

  const stats = [
    {
      number: '50,000+',
      label: 'Active Users',
      icon: <Users className="w-5 h-5" />,
      color: 'blue'
    },
    {
      number: '1M+',
      label: 'Practice Sessions',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'purple'
    },
    {
      number: '95%',
      label: 'Success Rate',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'emerald'
    },
    {
      number: '4.9/5',
      label: 'User Rating',
      icon: <Star className="w-5 h-5" />,
      color: 'amber'
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'User-Centric Design',
      description: 'Every feature is built with user experience and learning outcomes in mind.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Privacy & Security',
      description: 'Your data and practice sessions are protected with enterprise-grade security.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Accessibility',
      description: 'Making quality communication training accessible to learners worldwide.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Continuous Innovation',
      description: 'Constantly improving our AI models and expanding practice capabilities.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-indigo-100 italic-none">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-400 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">The Future of Learning</span>
            </div>
            <div className="flex items-center justify-center mx-auto mb-8">
              <img
                src="/resources/Rretoriq_main_blk.png"
                alt="Rretoriq Logo"
                className="h-16 sm:h-20 w-auto drop-shadow-sm"
              />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Master Communication with <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Precision AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 font-medium px-4">
              Empowering individuals and organizations with AI-driven training
              that transforms every practice session into a milestone for success.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Mission Glass Card */}
        <div className="relative group mb-20 overflow-hidden rounded-[2.5rem] p-1 shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.4rem] p-8 sm:p-16 border border-white/20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-6">Our Core Mission</h2>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
                "To democratize access to world-class communication training through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">innovative AI technology</span>, helping millions achieve their professional potential."
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="relative group overflow-hidden bg-white border border-gray-100 rounded-3xl p-8 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-gray-900">
                {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-8 h-8 text-white' })}
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Rretoriq - Modern Feature Grid */}
        <div className="mb-24">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">Why Choose Rretoriq</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-0">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white border border-gray-100 rounded-3xl p-8 hover:border-indigo-200 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className={`absolute top-0 left-0 w-2 h-0 group-hover:h-full transition-all duration-500 rounded-l-3xl bg-gradient-to-b ${feature.gradient.replace('/20', '')}`}></div>
                <div className="flex items-start space-x-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story & Timeline Section */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 p-12 sm:p-20 mb-24 shadow-3xl shadow-indigo-500/10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-widest border border-indigo-500/30">
                Our Journey
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">A Vision for <br /><span className="text-indigo-400">Limitless Growth</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                Founded in 2023, Rretoriq was born from the vision of making premium communication
                training accessible to everyone. We recognized the gap between traditional coaching methods and the needs of modern learners.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-gray-200 font-bold">Trusted by leading educational institutions</span>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-200 font-bold">99.9% platform reliability</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-white/10 shadow-inner">
              <h3 className="text-xl font-black text-white mb-10 flex items-center space-x-3">
                <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                <span>Key Milestones</span>
              </h3>
              <div className="space-y-10 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/10"></div>

                {[
                  { year: '2023', text: 'Platform launch with IELTS Speaking practice' },
                  { year: '2024', text: 'Added Interview Practice with AI feedback' },
                  { year: '2025', text: '50K+ active users across 40+ countries' }
                ].map((milestone, idx) => (
                  <div key={idx} className="flex items-start space-x-6 relative">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 mt-1 flex-shrink-0"></div>
                    <div>
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{milestone.year}</span>
                      <p className="text-white font-bold mt-1 text-lg">{milestone.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values - Vibrant Cards */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">Our Core Values</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-pink-200 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/5 hover:-translate-y-2">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology - Black Modern Panel */}
        <div className="bg-white border border-gray-100 rounded-[3rem] p-12 sm:p-20 mb-24 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-16 text-center tracking-tight relative z-10">Powered by <span className="text-indigo-600">Advanced AI</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { icon: <Brain />, title: 'NLP Models', desc: 'Advanced models analyze speech patterns, grammar, and vocabulary usage.' },
              { icon: <Target />, title: 'Speech Recognition', desc: 'Real-time processing with pinpoint pronunciation analysis.' },
              { icon: <Zap />, title: 'Adaptive Learning', desc: 'Algorithms that evolve feedback based on your unique progress.' }
            ].map((tech, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:shadow-2xl group-hover:shadow-indigo-500/40 group-hover:-rotate-6 transition-all duration-500">
                  {React.cloneElement(tech.icon as React.ReactElement<any>, { className: 'w-8 h-8 text-white' })}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{tech.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium px-4">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA - Ultra Modern */}
        <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 p-12 sm:p-24 text-center">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[100%] bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] bg-purple-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">Join Our Global Community</h2>
            <p className="text-indigo-100 text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
              Experience the future of communication training with thousands of successful learners worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all font-black text-lg shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all font-black text-lg backdrop-blur-sm">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
