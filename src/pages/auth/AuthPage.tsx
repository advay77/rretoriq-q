import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle, Loader, Mail, Lock, User, School, GraduationCap, Languages, BookOpen } from 'lucide-react';
import SEO, { seoData } from '../../components/SEO';

// Login Schema
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

// Register Schema
const colleges = [
    'Select your college',
    'Indian Institute of Technology (IIT)',
    'National Institute of Technology (NIT)',
    'Birla Institute of Technology and Science (BITS)',
    'Delhi Technological University (DTU)',
    'Netaji Subhas University of Technology (NSUT)',
    'Indian Institute of Science (IISc)',
    'Indian Institutes of Science Education and Research (IISER)',
    'United Institute Of Technology(UIT)',
    'Other'
];

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    college: z.string().min(1, 'Please select your college'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    location: z.string().min(1, 'Please enter your location'),
    dateOfBirth: z.string().min(1, 'Please enter your date of birth'),
    occupation: z.string().min(1, 'Please enter your occupation'),
    education: z.string().min(1, 'Please enter your education'),
    languages: z.string().min(1, 'Please enter languages you speak'),
    bio: z.string().min(10, 'Bio should be at least 10 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number and special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        login,
        register: registerUser,
        loginWithGoogle,
        isAuthenticated,
        isLoading,
        error,
        clearError
    } = useAuthStore();

    // Login Form
    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    // Register Form
    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors }
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    });

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const onLogin = async (data: LoginForm) => {
        try {
            clearError();
            await login({ email: data.email, password: data.password });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const onRegister = async (data: RegisterForm) => {
        try {
            clearError();
            const { confirmPassword, ...credentials } = data;
            await registerUser(credentials);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            clearError();
            await loginWithGoogle();
        } catch (error) {
            console.error('Google authentication failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-6 px-4">
            <SEO {...(activeTab === 'login' ? seoData.login : seoData.register)} />

            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 h-[90vh] flex flex-col">
                <div className="grid md:grid-cols-2 flex-1 overflow-hidden">
                    {/* Left side - Branding */}
                    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-6 text-white">
                        <div className="w-full max-w-sm">
                            <h2 className="text-3xl font-bold mb-4">Welcome to RRETORIQ</h2>
                            <p className="text-blue-100 text-base mb-6 leading-relaxed">
                                {activeTab === 'login'
                                    ? 'Sign in to access your personalized dashboard and continue your learning journey.'
                                    : 'Join our community of learners and professionals to enhance your skills and knowledge.'}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/30 backdrop-blur-sm flex items-center justify-center border border-blue-400/30">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-base">Personalized learning paths</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/30 backdrop-blur-sm flex items-center justify-center border border-blue-400/30">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <span className="text-base">Expert-led courses</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/30 backdrop-blur-sm flex items-center justify-center border border-blue-400/30">
                                        <Languages className="w-5 h-5" />
                                    </div>
                                    <span className="text-base">Interactive community</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right side - Form */}
                    <div className="flex flex-col overflow-y-auto">
                        <div className="p-6 flex-1">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
                                </h2>
                                <p className="mt-1.5 text-sm text-gray-600">
                                    {activeTab === 'login'
                                        ? 'Or '
                                        : 'Already have an account? '}
                                    <button
                                        onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    >
                                        {activeTab === 'login' ? 'create a new account' : 'sign in'}
                                    </button>
                                </p>
                            </div>

                            {/* Social Login */}
                            <div className="mb-6">
                                <button
                                    onClick={handleGoogleAuth}
                                    type="button"
                                    className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.24426 56.479 -10.4343 57.329 L -10.4343 60.609 L -6.46426 60.609 C -4.56426 58.869 -3.264 55.919 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.86426 60.609 L -10.4343 57.329 C -11.4043 58.049 -12.7143 58.489 -14.254 58.489 C -17.204 58.489 -19.654 56.379 -20.474 53.529 L -24.564 53.529 L -24.564 56.939 C -22.604 60.889 -19.064 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -20.474 53.529 C -20.734 52.709 -20.864 51.819 -20.864 50.889 C -20.864 49.959 -20.724 49.069 -20.474 48.249 L -20.474 44.839 L -24.564 44.839 C -25.604 46.919 -26.134 49.339 -26.134 51.889 C -26.134 54.439 -25.604 56.859 -24.564 58.939 L -20.474 53.529 Z" />
                                            <path fill="#EA4335" d="M -14.754 45.289 C -12.984 45.289 -11.404 45.879 -10.084 47.019 L -6.56426 43.499 C -8.74426 41.399 -11.564 39.989 -14.754 39.989 C -19.064 39.989 -22.604 42.339 -24.564 46.289 L -20.474 49.699 C -19.654 46.849 -17.204 44.739 -14.754 44.739 Z" />
                                        </g>
                                    </svg>
                                    {activeTab === 'login' ? 'Sign in' : 'Sign up'} with Google
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-red-700 text-xs">{error}</span>
                                </div>
                            )}

                            {/* Forms */}
                            <div>
                                {activeTab === 'login' ? (
                                    // Login Form
                                    <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    {...loginRegister('email')}
                                                    type="email"
                                                    id="email"
                                                    placeholder="you@company.com"
                                                    className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                />
                                            </div>
                                            {loginErrors.email && (
                                                <p className="mt-1 text-xs text-red-500">{loginErrors.email.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    Password
                                                </label>
                                                <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    {...loginRegister('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    placeholder="Enter your password"
                                                    className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-colors" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-colors" />
                                                    )}
                                                </button>
                                            </div>
                                            {loginErrors.password && (
                                                <p className="mt-1 text-xs text-red-500">{loginErrors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                                ) : (
                                                    <LogIn className="-ml-1 mr-2 h-5 w-5" />
                                                )}
                                                Sign in
                                            </button>
                                        </div>

                                        <div className="text-center text-xs text-gray-500 pt-4">
                                            Don't have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('register')}
                                                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                                            >
                                                Sign up
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // Register Form
                                    <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-2">
                                                    First name
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        {...registerRegister('firstName')}
                                                        type="text"
                                                        id="firstName"
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        placeholder="John"
                                                    />
                                                </div>
                                                {registerErrors.firstName && (
                                                    <p className="mt-0.5 text-xs text-red-500">{registerErrors.firstName.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                                                    Last name
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        {...registerRegister('lastName')}
                                                        type="text"
                                                        id="lastName"
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                                {registerErrors.lastName && (
                                                    <p className="mt-0.5 text-xs text-red-500">{registerErrors.lastName.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    {...registerRegister('email')}
                                                    type="email"
                                                    id="email"
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                    placeholder="you@company.com"
                                                />
                                            </div>
                                            {registerErrors.email && (
                                                <p className="mt-0.5 text-xs text-red-500">{registerErrors.email.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="college" className="block text-xs font-medium text-gray-700 mb-1">
                                                College/Institution
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <School className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <select
                                                    {...registerRegister('college')}
                                                    id="college"
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none"
                                                >
                                                    {colleges.map((college) => (
                                                        <option key={college} value={college}>
                                                            {college}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {registerErrors.college && (
                                                <p className="mt-0.5 text-xs text-red-500">{registerErrors.college.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    {...registerRegister('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-colors" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-colors" />
                                                    )}
                                                </button>
                                            </div>
                                            {registerErrors.password && (
                                                <p className="mt-0.5 text-xs text-red-500">{registerErrors.password.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    {...registerRegister('confirmPassword')}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    id="confirmPassword"
                                                    className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-colors" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-500 transition-colors" />
                                                    )}
                                                </button>
                                            </div>
                                            {registerErrors.confirmPassword && (
                                                <p className="mt-0.5 text-xs text-red-500">{registerErrors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                                ) : (
                                                    <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                                                )}
                                                Create account
                                            </button>
                                        </div>

                                        <div className="text-center text-xs text-gray-500 pt-4">
                                            Already have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('login')}
                                                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                                            >
                                                Sign in
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}