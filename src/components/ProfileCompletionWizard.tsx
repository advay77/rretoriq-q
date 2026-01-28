import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, CheckCircle, Settings, Bell } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { userProfileService } from '../services/userProfileService'
import { useNavigate } from 'react-router-dom'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(3, 'Please enter your location'),
  occupation: z.string().min(2, 'Please enter your occupation'),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  timezone: z.string(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Let us know who you are',
    icon: User,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Customize your experience',
    icon: Settings,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'How would you like to be notified',
    icon: Bell,
  },
]

export const ProfileCompletionWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      location: '',
      occupation: '',
      theme: 'light',
      language: 'English',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    }
  })

  const nextStep = async () => {
    const fieldsToValidate = getCurrentStepFields()
    const isValid = await trigger(fieldsToValidate)

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentStepFields = (): (keyof ProfileFormData)[] => {
    switch (currentStep) {
      case 0:
        return ['firstName', 'lastName', 'phone', 'location', 'occupation']
      case 1:
        return ['theme', 'language', 'timezone']
      case 2:
        return ['emailNotifications', 'pushNotifications', 'smsNotifications']
      default:
        return []
    }
  }



  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        location: data.location,
        occupation: data.occupation,
        preferences: {
          learningGoal: 'IELTS Preparation',
          practiceFrequency: 'Daily',
          difficultyLevel: 'Intermediate',
          enableVoiceFeedback: data.emailNotifications,
          showAnalytics: data.pushNotifications,
        },
        notifications: {
          email: {
            practiceReminders: data.emailNotifications,
            progressReports: true,
            newFeatures: false,
          },
          push: {
            dailyReminder: data.pushNotifications,
            achievements: true,
            sessionCompleted: data.smsNotifications,
          },
          reminderTime: '09:00',
        },
        updatedAt: new Date(),
      }

      try {
        // Check if profile exists
        const existingProfile = await userProfileService.getUserProfile(user.id)

        if (!existingProfile) {
          // Profile doesn't exist - create it
          await userProfileService.createUserProfile(user.id, user.email, profileData)
        } else {
          // Profile exists - update it
          await userProfileService.updateUserProfile(user.id, profileData)
        }
      } catch (error) {
        // If error is "profile not found", create new profile
        console.log('Creating new profile...')
        await userProfileService.createUserProfile(user.id, user.email, profileData)
      }

      // Mark profile as completed in auth store (without calling updateUserProfile again)
      useAuthStore.getState().markProfileCompleted()

      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 300))

      // Redirect based on user role with replace to prevent back navigation
      if (user.admin) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      console.error('Error completing profile:', error)
      alert('Failed to complete profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }



  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName')}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName')}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          id="location"
          {...register('location')}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="City, State or Country"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
          Occupation *
        </label>
        <input
          type="text"
          id="occupation"
          {...register('occupation')}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your job title or profession"
        />
        {errors.occupation && (
          <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
        )}
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-6">

      <div>
        <label htmlFor="language" className="block text-sm font-medium bg-white text-gray-700 mb-2">
          Language
        </label>
        <select
          id="language"
          {...register('language')}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Chinese">Chinese</option>
        </select>
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm bg-white font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          id="timezone"
          {...register('timezone')}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Tokyo">Tokyo</option>
          <option value="Asia/Shanghai">Shanghai</option>
        </select>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive important updates via email</p>
          </div>
          <input
            type="checkbox"
            {...register('emailNotifications')}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Get notified instantly in your browser</p>
          </div>
          <input
            type="checkbox"
            {...register('pushNotifications')}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Receive updates via text message</p>
          </div>
          <input
            type="checkbox"
            {...register('smsNotifications')}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo()
      case 1:
        return renderPreferences()
      case 2:
        return renderNotifications()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: 'black' }}>Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">Let's get you set up with a complete profile</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-4 md:space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep

                return (
                  <li key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : isCurrent
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-gray-300 text-gray-500'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-500'
                        }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block ml-4 w-16 h-0.5 bg-gray-300" />
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900" style={{ color: 'black' }}>
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 mt-1">{steps[currentStep].description}</p>
            </div>

            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium ${currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
            >
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Completing...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileCompletionWizard