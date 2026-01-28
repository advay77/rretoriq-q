import React, { useState } from 'react';
import {
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';

const Help: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: <Book className="w-5 h-5" />, description: 'Platform basics' },
    { id: 'practice-guides', label: 'Practice Guides', icon: <Video className="w-5 h-5" />, description: 'Tutorials & tips' },
    { id: 'technical-support', label: 'Technical Support', icon: <HelpCircle className="w-5 h-5" />, description: 'Troubleshooting' },
    { id: 'billing-account', label: 'Billing & Account', icon: <FileText className="w-5 h-5" />, description: 'Manage subscription' }
  ];

  const helpContent = {
    'getting-started': [
      {
        title: 'Platform Overview',
        description: 'Learn the basics of navigating Rretoriq and setting up your account.',
        type: 'guide',
        duration: '5 min read',
        status: 'recommended'
      },
      {
        title: 'First Practice Session',
        description: 'Step-by-step guide to completing your first IELTS or Interview practice.',
        type: 'video',
        duration: '8 min watch',
        status: 'popular'
      },
      {
        title: 'Understanding AI Feedback',
        description: 'How to interpret and use AI-generated feedback to improve your performance.',
        type: 'guide',
        duration: '7 min read',
        status: 'new'
      },
      {
        title: 'Setting Learning Goals',
        description: 'Configure your practice goals and track progress effectively.',
        type: 'guide',
        duration: '4 min read',
        status: null
      }
    ],
    'practice-guides': [
      {
        title: 'IELTS Speaking Strategies',
        description: 'Advanced techniques for IELTS Speaking practice and score improvement.',
        type: 'guide',
        duration: '12 min read',
        status: 'popular'
      },
      {
        title: 'Interview Question Types',
        description: 'Complete guide to different interview question categories and how to approach them.',
        type: 'guide',
        duration: '15 min read',
        status: 'recommended'
      },
      {
        title: 'Voice Recording Best Practices',
        description: 'Tips for optimal audio quality and clear speech recording.',
        type: 'video',
        duration: '6 min watch',
        status: null
      },
      {
        title: 'Progress Tracking Guide',
        description: 'How to use analytics and reports to monitor your improvement.',
        type: 'guide',
        duration: '8 min read',
        status: 'new'
      }
    ],
    'technical-support': [
      {
        title: 'Microphone Troubleshooting',
        description: 'Resolve common microphone and audio recording issues.',
        type: 'guide',
        duration: '5 min read',
        status: 'popular'
      },
      {
        title: 'Browser Compatibility',
        description: 'Supported browsers and recommended settings for optimal performance.',
        type: 'guide',
        duration: '3 min read',
        status: null
      },
      {
        title: 'Connection Issues',
        description: 'Troubleshooting slow loading times and connectivity problems.',
        type: 'guide',
        duration: '4 min read',
        status: null
      },
      {
        title: 'Mobile App Setup',
        description: 'Installing and configuring the mobile app for practice on the go.',
        type: 'video',
        duration: '7 min watch',
        status: 'new'
      }
    ],
    'billing-account': [
      {
        title: 'Subscription Plans',
        description: 'Overview of available plans and features included in each tier.',
        type: 'guide',
        duration: '6 min read',
        status: 'recommended'
      },
      {
        title: 'Payment Methods',
        description: 'Supported payment options and billing cycle information.',
        type: 'guide',
        duration: '4 min read',
        status: null
      },
      {
        title: 'Account Settings',
        description: 'Managing your profile, preferences, and privacy settings.',
        type: 'guide',
        duration: '5 min read',
        status: null
      },
      {
        title: 'Cancellation Policy',
        description: 'How to cancel or modify your subscription and refund policies.',
        type: 'guide',
        duration: '3 min read',
        status: null
      }
    ]
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'popular':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Popular
          </span>
        );
      case 'recommended':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <AlertCircle className="w-3 h-3" /> Recommended
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Info className="w-3 h-3" /> New
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-indigo-50 rounded-2xl ring-1 ring-indigo-100">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            Search our knowledge base or browse categories to find the answers you need.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Ask a question or search keywords..."
                className="block w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-100/50 text-base"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Categories Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm lg:bg-transparent rounded-2xl p-2 lg:p-0 sticky top-8 z-10 lg:z-auto shadow-sm shadow-slate-200/50 lg:shadow-none border border-slate-200 lg:border-none">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group whitespace-nowrap lg:whitespace-normal ${activeCategory === category.id
                      ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100 ring-1 ring-indigo-50 lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-slate-200'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                      }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${activeCategory === category.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50/50 group-hover:text-indigo-500'
                      }`}>
                      {category.icon}
                    </div>
                    <div>
                      <span className="block font-semibold text-sm">{category.label}</span>
                      <span className="text-xs text-slate-400 hidden lg:block mt-0.5 font-normal">
                        {category.description}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-slate-900">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                {helpContent[activeCategory as keyof typeof helpContent].length} articles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {helpContent[activeCategory as keyof typeof helpContent].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${item.type === 'video'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-sky-50 text-sky-600'
                      }`}>
                      {item.type === 'video' ? <Video className="w-5 h-5" /> : <Book className="w-5 h-5" />}
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {item.duration}
                    </div>
                    <span className="flex items-center text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Popular Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Download className="w-6 h-6" />,
                title: 'Download Center',
                desc: 'Access offline materials & PDFs',
                color: 'blue'
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: 'Community Forum',
                desc: 'Connect with other learners',
                color: 'emerald'
              },
              {
                icon: <Video className="w-6 h-6" />,
                title: 'Video Academy',
                desc: 'Deep dive tutorials',
                color: 'purple'
              }
            ].map((action, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group text-center">
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-colors ${action.color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
                  action.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' :
                    'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
                  }`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{action.desc}</p>
                <button className={`text-sm font-semibold flex items-center justify-center gap-1 mx-auto ${action.color === 'blue' ? 'text-blue-600' :
                  action.color === 'emerald' ? 'text-emerald-600' :
                    'text-purple-600'
                  }`}>
                  Open <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Footer */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Still can't find what you're looking for?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Our support team is available 24/7. We usually respond within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:support@rretoriq.com" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                <Mail className="w-4 h-4" /> Email Support
              </a>
              <a href="tel:+1234567890" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-slate-700">
                <Phone className="w-4 h-4" /> Call Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Help;