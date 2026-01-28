import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  noIndex?: boolean
  canonical?: string
  structuredData?: Record<string, any>
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = 'https://rretoriq.com/og-image.jpg',
  url = 'https://rretoriq.com/',
  type = 'website',
  noIndex = false,
  canonical,
  structuredData
}) => {
  const siteTitle = 'Rretoriq'
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - AI Communication Coach for Indian Professionals`
  const siteDescription = description || 'Master IELTS, ace interviews, and excel in business communication with AI-powered coaching designed specifically for Indian professionals. Free practice sessions available.'
  const siteKeywords = keywords || 'IELTS preparation India, interview coaching, communication skills, AI coach, English speaking practice, Indian professionals, business English, speaking confidence'

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO

// Pre-configured SEO data for different pages
export const seoData = {
  home: {
    title: 'AI Communication Coach for Indian Professionals',
    description: 'Master IELTS, ace interviews, and excel in business communication with AI-powered coaching designed specifically for Indian professionals. Start your free practice today.',
    keywords: 'IELTS preparation India, AI communication coach, interview practice, English speaking skills, Indian professionals, business English, communication training',
    url: 'https://rretoriq.com/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Rretoriq",
      "description": "AI-powered communication coaching platform for Indian professionals",
      "url": "https://rretoriq.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://rretoriq.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  demo: {
    title: 'Interactive Demo - Try Rretoriq Free',
    description: 'Experience our AI communication coach in action. Try IELTS and interview practice with real-time AI feedback. No signup required.',
    keywords: 'IELTS demo, interview practice demo, AI feedback demo, communication skills test, free trial',
    url: 'https://rretoriq.com/demo',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Rretoriq Demo",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    }
  },
  
  pricing: {
    title: 'Pricing Plans - Free Forever & Premium Features',
    description: 'Choose the perfect plan for your communication journey. Start free forever or unlock premium AI features for advanced coaching.',
    keywords: 'Rretoriq pricing, communication coaching plans, IELTS preparation cost, interview coaching price, free plan',
    url: 'https://rretoriq.com/pricing'
  },
  
  login: {
    title: 'Sign In to Your Account',
    description: 'Access your personalized communication coaching dashboard. Continue your IELTS preparation and interview practice.',
    url: 'https://rretoriq.com/login',
    noIndex: true
  },
  
  register: {
    title: 'Sign Up Free - Start Your Communication Journey',
    description: 'Create your free Rretoriq account and start improving your communication skills today. No credit card required.',
    keywords: 'sign up free, create account, join Rretoriq, free registration, communication coach signup',
    url: 'https://rretoriq.com/register'
  },
  
  dashboard: {
    title: 'Dashboard - Your Learning Progress',
    description: 'Track your communication progress, view AI insights, and continue your personalized learning journey.',
    url: 'https://rretoriq.com/dashboard',
    noIndex: true
  },
  
  ielts: {
    title: 'IELTS Practice with AI Feedback',
    description: 'Master IELTS Speaking, Writing, Reading, and Listening with personalized AI coaching. Designed for Indian test-takers.',
    keywords: 'IELTS practice India, IELTS speaking test, IELTS preparation online, AI IELTS coach, IELTS mock test',
    url: 'https://rretoriq.com/ielts',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "IELTS Preparation with AI",
      "description": "Comprehensive IELTS preparation with AI-powered feedback",
      "provider": {
        "@type": "Organization",
        "name": "Rretoriq"
      },
      "courseMode": "online",
      "educationalLevel": "intermediate"
    }
  },
  
  interview: {
    title: 'Interview Practice with AI Coach',
    description: 'Practice job interviews with AI feedback on communication, confidence, and professional presence. Real questions from top companies.',
    keywords: 'interview practice India, job interview preparation, AI interview coach, mock interview, behavioral questions',
    url: 'https://rretoriq.com/interview',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Interview Preparation with AI",
      "description": "Professional interview preparation with AI-powered feedback",
      "provider": {
        "@type": "Organization",
        "name": "Rretoriq"
      },
      "courseMode": "online"
    }
  },
  
  progress: {
    title: 'Learning Progress & Analytics',
    description: 'View detailed analytics of your communication improvement, track IELTS scores, and monitor interview performance.',
    url: 'https://rretoriq.com/progress',
    noIndex: true
  },
  
  profile: {
    title: 'Profile Settings & Preferences',
    description: 'Manage your account settings, learning preferences, and personalize your AI coaching experience.',
    url: 'https://rretoriq.com/profile',
    noIndex: true
  },

  business: {
    title: 'Corporate English Training & Assessment Solutions',
    description: 'Transform your workforce communication with AI-powered English assessment and training. Reduce hiring mistakes by 87% and improve team efficiency by 42%. Perfect for HR, call centers, and international teams.',
    keywords: 'corporate english training, employee assessment, AI language testing, business communication, workforce development, english proficiency assessment, CEFR assessment, HR solutions',
    url: 'https://rretoriq.com/business',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Corporate English Training Solutions",
      "description": "AI-powered English assessment and training for businesses",
      "provider": {
        "@type": "Organization",
        "name": "Rretoriq",
        "url": "https://rretoriq.com"
      },
      "serviceType": "Corporate Training",
      "audience": {
        "@type": "Audience",
        "audienceType": "Business"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/Available",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "Contact for Quote",
          "priceCurrency": "USD"
        }
      }
    }
  },

  schools: {
    title: 'AI-Powered English Assessment & Learning Platform for Schools',
    description: 'Streamline your schools English curriculum with AI-powered assessment and learning tools. Improve student placement, enhance classroom learning, and track progress with detailed analytics.',
    keywords: 'english assessment schools, AI language learning, student placement test, ESL curriculum, IELTS preparation schools, educational technology, language learning platform, student assessment tools',
    url: 'https://rretoriq.com/schools',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Rretoriq for Schools",
      "description": "AI-powered English learning platform for educational institutions",
      "provider": {
        "@type": "Organization",
        "name": "Rretoriq",
        "url": "https://rretoriq.com"
      },
      "educationalLevel": "Secondary and Higher Education",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/Available",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "Contact for Quote",
          "priceCurrency": "USD"
        }
      },
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": ["student", "teacher", "administrator"]
      }
    }
  }
}