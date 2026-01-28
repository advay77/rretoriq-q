import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  Mail,
  Phone,
  HelpCircle
} from 'lucide-react';

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I get started with Rretoriq?',
          answer: 'Simply create an account, choose your practice type (IELTS or Interview), and start with our guided setup process. We\'ll help you configure your goals and preferences to personalize your learning experience.'
        },
        {
          question: 'Can I see a demo before subscribing?',
          answer: 'Yes! We offer interactive demos and detailed walkthroughs of our platform features. You can explore our mock interview scenarios and see AI feedback examples before choosing your subscription plan.'
        },
        {
          question: 'What devices can I use Rretoriq on?',
          answer: 'Rretoriq works on any device with a web browser - desktop, laptop, tablet, or smartphone. For the best experience with voice features, we recommend using Chrome or Safari browsers.'
        }
      ]
    },
    {
      category: 'IELTS Practice',
      questions: [
        {
          question: 'How accurate is the AI scoring for IELTS?',
          answer: 'Our AI scoring system has been trained on thousands of IELTS responses and maintains 95%+ accuracy compared to certified IELTS examiners. It provides detailed feedback on grammar, vocabulary, pronunciation, and fluency.'
        },
        {
          question: 'Can I practice all four IELTS skills?',
          answer: 'Currently, we focus on Speaking practice with comprehensive AI feedback. Reading, Writing, and Listening modules are in development and will be available soon.'
        },
        {
          question: 'How many practice sessions can I do per day?',
          answer: 'With our subscription plans, you get unlimited practice sessions with comprehensive AI feedback and detailed performance analytics.'
        }
      ]
    },
    {
      category: 'Interview Practice',
      questions: [
        {
          question: 'What types of interviews can I practice?',
          answer: 'We offer HR/Behavioral, Technical, and Aptitude interview practice. Each type has industry-specific questions and tailored AI feedback to help you excel in your target role.'
        },
        {
          question: 'Can I practice for specific companies?',
          answer: 'Yes! Our question bank includes company-specific interview questions for major tech companies, consulting firms, and various industries. You can filter by company or role type.'
        },
        {
          question: 'How does the real-time feedback work?',
          answer: 'Our AI analyzes your speech in real-time, providing instant feedback on pace, clarity, confidence level, and content quality. You\'ll see suggestions for improvement during and after your response.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I\'m having microphone issues, what should I do?',
          answer: 'First, ensure your browser has microphone permissions enabled. Check your device\'s audio settings and try refreshing the page. If issues persist, contact our support team for personalized troubleshooting.'
        },
        {
          question: 'Why is the AI feedback taking too long to generate?',
          answer: 'AI processing typically takes 10-30 seconds. Longer delays may indicate high server load or connectivity issues. Try refreshing the page or check your internet connection. Premium users get priority processing.'
        },
        {
          question: 'Can I download my practice reports?',
          answer: 'Yes, all practice reports and progress analytics can be downloaded as PDF files from your Progress dashboard. This helps you track improvement over time.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.'
        },
        {
          question: 'Do you offer student discounts?',
          answer: 'Yes! We offer 30% student discounts with valid student ID verification. Contact our support team with your student credentials to apply the discount.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and UPI payments for Indian users. All payments are processed securely through Stripe with 256-bit SSL encryption.'
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-indigo-50 rounded-2xl ring-1 ring-indigo-100">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Find detailed answers to common questions about Rretoriq's AI-powered practice platform.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a question..."
                className="block w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 shadow-xl shadow-indigo-100/20 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500">
              We couldn't find any questions matching "{searchTerm}".
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-xl font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {category.category}
                </h2>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {category.questions.map((item, itemIndex) => {
                    const globalIndex = categoryIndex * 1000 + itemIndex;
                    const isExpanded = expandedItems.includes(globalIndex);
                    const isLast = itemIndex === category.questions.length - 1;

                    return (
                      <div key={itemIndex} className={`group ${!isLast ? 'border-b border-slate-50' : ''}`}>
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-5 text-left flex justify-between items-center transition-all duration-200 hover:bg-slate-50/50"
                        >
                          <span className={`font-medium pr-8 transition-colors ${isExpanded ? 'text-indigo-600' : 'text-slate-700'}`}>
                            {item.question}
                          </span>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isExpanded ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                            }`}>
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                          <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:support@rretoriq.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition-colors gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors gap-2"
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;