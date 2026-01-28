import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbMap: { [key: string]: string } = {
    'demo': 'Interactive Demo',
    'pricing': 'Pricing Plans',
    'login': 'Sign In',
    'register': 'Sign Up',
    'dashboard': 'Dashboard',
    'ielts': "Let's Communicate",
    'interview': 'Interview Practice',
    'profile': 'Profile',
    'progress': 'Progress',
    'about': 'About Us',
    'contact': 'Contact',
    'help': 'Help Center',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'business': 'Business English',
    'courses': 'Online Courses'
  }

  if (pathnames.length === 0) return null

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...pathnames.map((name, index) => {
      const href = index === pathnames.length - 1 ? undefined : `/${pathnames.slice(0, index + 1).join('/')}`
      return {
        label: breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
        href
      }
    })
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
            {crumb.href ? (
              <Link 
                to={crumb.href} 
                className="hover:text-emerald-600 transition-colors flex items-center"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium flex items-center">
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs