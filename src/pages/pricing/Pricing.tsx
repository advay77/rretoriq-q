import { useState } from 'react'
import SEO, { seoData } from '../../components/SEO'
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Users,
  Shield,
  TrendingUp
} from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  description: string
  features: string[]
  limitations: string[]
  recommended?: boolean
  icon: any
  color: string
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'individual',
    name: 'Individual',
    price: 1499,
    period: 'month',
    description: 'Perfect for individual professionals',
    icon: Users,
    color: 'blue',
    recommended: true,
    features: [
      'Unlimited practice sessions',
      'All IELTS modules (Speaking, Listening, Reading, Writing)',
      'Company-specific interview practice',
      'AI-powered detailed feedback',
      'Advanced performance analytics',
      'Personalized learning recommendations',
      'Priority email support',
      'Mobile app access',
      'Progress tracking & insights'
    ],
    limitations: [
      'Single user license',
      'No bulk management features'
    ]
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 89999,
    period: 'month',
    description: 'Enterprise solution for organizations',
    icon: Shield,
    color: 'purple',
    features: [
      'Everything in Individual',
      'Up to 100 user licenses',
      'Admin dashboard & user management',
      'Bulk progress tracking',
      'Custom branding options',
      'Dedicated account manager',
      'Training & onboarding support',
      'API integration capabilities',
      'Advanced reporting & analytics',
      'Priority technical support',
      'Custom content development',
      'White-label options available'
    ],
    limitations: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    period: 'month',
    description: 'Custom solutions for large institutions',
    icon: Crown,
    color: 'gray',
    features: [
      'Unlimited user licenses',
      'Complete customization',
      'On-premise deployment options',
      'Custom AI model training',
      'Dedicated infrastructure',
      'SLA guarantees',
      '24/7 technical support',
      'Custom integrations',
      'Compliance & security certifications',
      'Training program development',
      'Success metrics & ROI tracking'
    ],
    limitations: []
  }
]

const yearlyDiscountPlans = pricingPlans.map(plan => ({
  ...plan,
  price: plan.price > 0 ? Math.round(plan.price * 12 * 0.8) : 0,
  period: 'year' as const
}))

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('individual')

  const currentPlans = isYearly ? yearlyDiscountPlans : pricingPlans
  const savings = isYearly ? '20% OFF' : null

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      gray: {
        bg: isSelected ? 'bg-white border-gray-200 shadow-lg' : 'bg-white',
        border: isSelected ? 'border-gray-200' : 'border-gray-100',
        button: 'bg-gray-900 hover:bg-gray-800 text-white',
        icon: 'bg-gray-100 text-gray-600'
      },
      blue: {
        bg: isSelected ? 'bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-100/50' : 'bg-white',
        border: isSelected ? 'border-indigo-200' : 'border-gray-100',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        icon: 'bg-indigo-100 text-indigo-600'
      },
      purple: {
        bg: isSelected ? 'bg-purple-50 border-purple-200 shadow-lg shadow-purple-100/50' : 'bg-white',
        border: isSelected ? 'border-purple-200' : 'border-gray-100',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        icon: 'bg-purple-100 text-purple-600'
      }
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <>
      <SEO {...seoData.pricing} />
      <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            Simple, transparent{' '}
            <span className="font-medium text-indigo-600">pricing</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-light">
            Choose the perfect plan for your communication training needs. 
            From individuals to enterprise organizations.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`mx-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {savings}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {currentPlans.map((plan) => {
            const IconComponent = plan.icon
            const isSelected = selectedPlan === plan.id
            const colorClasses = getColorClasses(plan.color, isSelected)

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border ${colorClasses.border} ${colorClasses.bg} p-8 transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-2xl ${colorClasses.icon} mb-6`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 font-light">{plan.description}</p>
                  
                  <div className="mb-8">
                    {plan.id === 'enterprise' ? (
                      <span className="text-4xl font-light text-gray-900">Contact Us</span>
                    ) : (
                      <>
                        <span className="text-4xl font-semibold text-gray-900">₹{plan.price.toLocaleString()}</span>
                        <span className="text-gray-500 font-light">/{plan.period}</span>
                        {isYearly && plan.price > 0 && (
                          <div className="text-sm text-indigo-600 font-medium mt-2">
                            Save ₹{Math.round(pricingPlans.find(p => p.id === plan.id)!.price * 12 * 0.2).toLocaleString()} per year
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <button className={`w-full ${colorClasses.button} px-6 py-3 rounded-2xl transition-all font-medium mb-8 hover:shadow-lg`}>
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-4 text-left">
                  <h4 className="font-semibold text-gray-900">Everything you need:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                            <span className="text-gray-500 text-sm font-light">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
            Compare all features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Individual</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Institutional</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'IELTS Practice Sessions', free: '5/month', pro: 'Unlimited', premium: 'Unlimited' },
                  { feature: 'Interview Practice', free: 'Basic', pro: 'Advanced', premium: 'Expert-level' },
                  { feature: 'Performance Analytics', free: false, pro: true, premium: true },
                  { feature: 'AI Feedback', free: false, pro: true, premium: true },
                  { feature: '1-on-1 Coaching', free: false, pro: false, premium: true },
                  { feature: 'Live Group Sessions', free: false, pro: false, premium: true },
                  { feature: 'Mobile App', free: false, pro: true, premium: true },
                  { feature: 'Priority Support', free: false, pro: true, premium: true }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-white">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-indigo-600 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700 font-light">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-indigo-600 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700 font-light">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="w-5 h-5 text-indigo-600 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700 font-light">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Why Choose RRetoriq?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300 text-sm">
                Advanced AI provides personalized feedback and recommendations
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-teal-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
                <Users className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Expert Coaches</h3>
              <p className="text-gray-300 text-sm">
                Learn from certified IELTS trainers and industry professionals
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Proven Results</h3>
              <p className="text-gray-300 text-sm">
                95% of users improve their scores within 3 months
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Money Back</h3>
              <p className="text-gray-300 text-sm">
                30-day money-back guarantee if you're not satisfied
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Can I switch plans anytime?</h3>
                <p className="text-gray-300 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-300 text-sm">
                  Yes! Start with our free plan and upgrade when you're ready for more features.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300 text-sm">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">How does the AI feedback work?</h3>
                <p className="text-gray-300 text-sm">
                  Our AI analyzes your speech patterns, vocabulary, grammar, and fluency to provide detailed feedback.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Can I get a refund?</h3>
                <p className="text-gray-300 text-sm">
                  Yes, we offer a 30-day money-back guarantee for all paid plans, no questions asked.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Is the mobile app included?</h3>
                <p className="text-gray-300 text-sm">
                  Mobile app access is included with Pro and Premium plans. Coming soon to app stores!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}