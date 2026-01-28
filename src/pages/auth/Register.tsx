import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import type { RegisterCredentials } from '../../store/authStore'
import SEO, { seoData } from '../../components/SEO'
import { UserPlus, Eye, EyeOff, AlertCircle, Loader, CheckCircle, Lock, Mail, Shield } from 'lucide-react'
import { useState, useMemo } from 'react'

const colleges = [
  'Select your college',
  'Indian Institute of Technology (IIT)',
  'National Institute of Technology (NIT)',
  'Birla Institute of Technology and Science (BITS)',
  'Delhi Technological University (DTU)',
  'Netaji Subhas University of Technology (NSUT)',
  'Indian Institute of Science (IISc)',
  'Indian Institutes of Science Education and Research (IISER)',
  'Other'
]

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  college: z.string().min(1, 'Please select your college'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { register: registerUser, loginWithGoogle, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  // Password strength checker
  const passwordChecks = useMemo(() => {
    if (!password) return { strength: 0, checks: [] }

    const checks = [
      { label: 'At least 8 characters', passed: password.length >= 8 },
      { label: 'Contains uppercase letter', passed: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', passed: /[a-z]/.test(password) },
      { label: 'Contains number', passed: /\d/.test(password) },
      { label: 'Contains special character', passed: /[@$!%*?&]/.test(password) }
    ]

    const strength = checks.filter(c => c.passed).length
    return { strength, checks }
  }, [password])

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : false

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (data: RegisterForm) => {
    try {
      clearError()
      const { confirmPassword, college, ...credentials } = data
      // Include college in the registration data
      await registerUser({
        ...credentials,
        college
      } as RegisterCredentials)
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      clearError()
      await loginWithGoogle()
    } catch (error) {
      console.error('Google signup failed:', error)
    }
  }

  return (
    <>
      <SEO {...seoData.register} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-4 py-4">
        <div className="w-full max-w-sm">
          {/* Hero Section - Compact */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-3 transform hover:scale-110 transition-transform duration-300">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create your account
            </h2>
            <p className="text-xs text-gray-500">
              Join thousands mastering communication
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-900">Registration failed</p>
                  <p className="text-xs text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-gray-900 mb-1.5">
                      First name
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      placeholder="John"
                      className={`w-full px-3 py-2 border-2 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none transition-all text-sm font-medium
                        ${errors.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                        }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Last name
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      className={`w-full px-3 py-2 border-2 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none transition-all text-sm font-medium
                        ${errors.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                        }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      placeholder="you@company.com"
                      className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none transition-all text-sm font-medium
                        ${errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                        }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* College Select */}
                <div>
                  <label htmlFor="college" className="block text-xs font-semibold text-gray-900 mb-1.5">
                    College
                  </label>
                  <select
                    {...register('college')}
                    id="college"
                    className={`w-full px-3 py-2 border-2 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none transition-all text-sm font-medium appearance-none cursor-pointer
                      ${errors.college
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                      }`}
                    defaultValue=""
                  >
                    {colleges.map((college) => (
                      <option key={college} value={college} disabled={college === 'Select your college'}>
                        {college}
                      </option>
                    ))}
                  </select>
                  {errors.college && (
                    <p className="mt-1 text-xs text-red-600">{errors.college.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-900">
                      Password
                    </label>
                    {passwordFocus && password && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-1.5 rounded-full transition-colors ${i < passwordChecks.strength
                                ? passwordChecks.strength <= 2
                                  ? 'bg-red-500'
                                  : passwordChecks.strength <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium">
                          {passwordChecks.strength <= 2 && <span className="text-red-600">Weak</span>}
                          {passwordChecks.strength === 3 && <span className="text-yellow-600">Fair</span>}
                          {passwordChecks.strength > 3 && <span className="text-green-600">Strong</span>}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="8+ chars, mixed case, number, special"
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      className={`w-full pl-10 pr-10 py-2 border-2 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none transition-all text-sm font-medium
                        ${errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements Checklist - Compact */}
                  {passwordFocus && password && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 max-h-32 overflow-y-auto">
                      <div className="space-y-1">
                        {passwordChecks.checks.map((check, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            {check.passed ? (
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                            )}
                            <span className={`text-xs ${check.passed ? 'text-green-700' : 'text-gray-600'}`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-10 py-2 border-2 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none transition-all text-sm font-medium
                        ${errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : confirmPassword && passwordsMatch
                            ? 'border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {!errors.confirmPassword && confirmPassword && passwordsMatch && (
                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms Checkbox - Compact */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded border border-blue-100">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 border border-blue-300 rounded-md focus:ring-1 focus:ring-blue-500 cursor-pointer mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-700 font-medium cursor-pointer leading-tight">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>

                {/* Divider - Compact */}
                <div className="relative flex items-center gap-3 my-3">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-xs font-medium text-gray-500">Or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Signup Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-600">
                    Have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}