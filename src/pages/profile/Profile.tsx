import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { userProfileService, type UserProfile, type UserStats } from '../../services/userProfileService'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../lib/firebase'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Globe,
  Settings,
  Save,
  Camera,
  CheckCircle,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  college: z.string().optional(),
  education: z.string().optional(),
  languages: z.string().optional(),
  bio: z.string().optional()
})

type ProfileForm = z.infer<typeof profileSchema>

export default function Profile() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('personal')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    totalSessions: 0,
    averageScore: 0,
    totalPracticeTime: 0,
    memberSince: new Date(),
    lastActivity: null
  })
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Preferences state
  const [preferences, setPreferences] = useState({
    learningGoal: 'IELTS Preparation',
    practiceFrequency: 'Daily',
    difficultyLevel: 'Intermediate',
    enableVoiceFeedback: true,
    showAnalytics: true,
    theme: 'light',
    language: 'English',
    timezone: 'UTC'
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: {
      practiceReminders: true,
      progressReports: true,
      newFeatures: false
    },
    push: {
      dailyReminder: true,
      achievements: true,
      sessionCompleted: false
    },
    reminderTime: '09:00'
  })

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      location: '',
      dateOfBirth: '',
      occupation: '',
      college: '',
      education: '',
      languages: '',
      bio: ''
    }
  })

  // Load user profile and stats
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      setLoading(true)
      try {
        const [profile, stats] = await Promise.all([
          userProfileService.getUserProfile(user.id),
          userProfileService.getUserStats(user.id)
        ])

        // If no profile exists, create one
        if (!profile) {
          await userProfileService.createUserProfile(user.id, user.email!, {
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            displayName: user.displayName || ''
          })

          // Reload profile after creation
          const newProfile = await userProfileService.getUserProfile(user.id)
          setUserProfile(newProfile)
        } else {
          setUserProfile(profile)
        }

        setUserStats(stats)

        // Set photo URL if available
        if (profile?.photoURL) {
          setPhotoURL(profile.photoURL)
        } else if (user.photoURL) {
          setPhotoURL(user.photoURL)
        }

        // Update form with profile data
        if (profile || user) {
          const formData = {
            firstName: profile?.firstName || user.displayName?.split(' ')[0] || '',
            lastName: profile?.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phone: profile?.phone || '',
            location: profile?.location || '',
            dateOfBirth: profile?.dateOfBirth || '',
            occupation: profile?.occupation || '',
            college: profile?.college || '',
            education: profile?.education || '',
            languages: profile?.languages || '',
            bio: profile?.bio || ''
          }
          reset(formData)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, reset])

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return

    setIsSaving(true)
    try {
      await userProfileService.updateUserProfile(user.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        location: data.location,
        dateOfBirth: data.dateOfBirth,
        occupation: data.occupation,
        college: data.college,
        education: data.education,
        languages: data.languages,
        bio: data.bio,
        displayName: `${data.firstName} ${data.lastName}`.trim()
      })

      // Reload profile data
      const updatedProfile = await userProfileService.getUserProfile(user.id)
      setUserProfile(updatedProfile)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const savePreferences = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await userProfileService.updateUserProfile(user.id, {
        preferences: preferences
      })

      // Reload profile data
      const updatedProfile = await userProfileService.getUserProfile(user.id)
      setUserProfile(updatedProfile)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const saveNotifications = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await userProfileService.updateUserProfile(user.id, {
        notifications: notifications
      })

      // Reload profile data
      const updatedProfile = await userProfileService.getUserProfile(user.id)
      setUserProfile(updatedProfile)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save notifications:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingPhoto(true)
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.id}/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      // Update user profile with photo URL
      await userProfileService.updateUserProfile(user.id, {
        photoURL: downloadURL
      })

      setPhotoURL(downloadURL)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to upload photo:', error)
      alert('Failed to upload photo. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-10 mb-8 shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 bg-white text-indigo-600 p-1.5 rounded-full hover:bg-indigo-50 transition-colors disabled:opacity-50 shadow-lg"
              >
                {uploadingPhoto ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3" />
                )}
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {loading ? 'Loading...' :
                  (userProfile?.displayName || user?.displayName ||
                    `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() ||
                    user?.email?.split('@')[0] || 'User')}
              </h1>
              <p className="text-white/90 mb-1">{user?.email}</p>
              {userProfile?.institutionName && (
                <p className="text-sm text-white/90 mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{userProfile.institutionName}</span>
                </p>
              )}
              <p className="text-sm text-white/70">
                {loading ? 'Loading...' : userProfileService.formatMemberSince(userStats.memberSince)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-xl font-bold text-white">
                  {loading ? '...' : userStats.totalSessions}
                </p>
                <p className="text-xs text-white/80 mt-1">Sessions</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-xl font-bold text-white">
                  {loading ? '...' : userStats.averageScore > 0 ? userStats.averageScore.toFixed(1) : '0.0'}
                </p>
                <p className="text-xs text-white/80 mt-1">Avg Score</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-xl font-bold text-white">
                  {loading ? '...' : userProfileService.formatPracticeTime(userStats.totalPracticeTime)}
                </p>
                <p className="text-xs text-white/80 mt-1">Practice Time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl p-6 shadow-lg">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-purple-50'
                        }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl p-10 shadow-lg">
              {activeTab === 'personal' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Personal Information</h2>
                    {saveSuccess && (
                      <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Profile updated successfully!</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            {...register('firstName')}
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                            placeholder="Enter first name"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-red-600 text-sm mt-2">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            {...register('lastName')}
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                            placeholder="Enter last name"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-red-600 text-sm mt-2">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full pl-10 bg-white pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-gray-700 placeholder-gray-500"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            {...register('location')}
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                            placeholder="Mumbai, India"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          {...register('dateOfBirth')}
                          type="date"
                          className="w-full bg-white pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-gray-700 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                          Occupation
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            {...register('occupation')}
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                            placeholder="Software Engineer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                          College Name
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            {...register('college')}
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                            placeholder="IIT Delhi / Stanford University"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Education
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          {...register('education')}
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                          placeholder="B.Tech in Computer Science"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Languages
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          {...register('languages')}
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white placeholder-gray-500"
                          placeholder="English, Hindi, Regional languages"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Bio
                      </label>
                      <textarea
                        {...register('bio')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:border-gray-400 focus:ring-0 resize-none text-gray-700 placeholder-gray-500"
                        placeholder="Tell us about yourself, your goals, and what you hope to achieve..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!isDirty || isSaving}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-gray-900">Learning Preferences</h2>
                    {saveSuccess && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Preferences saved successfully!</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-4">
                        Primary Learning Goal
                      </label>
                      <div className="space-y-3">
                        {['IELTS Preparation', 'Job Interview Skills', 'Business Communication', 'General English'].map((goal) => (
                          <label key={goal} className="flex items-center">
                            <input
                              type="radio"
                              name="learning-goal"
                              className="mr-3 text-gray-600"
                              checked={goal === preferences.learningGoal}
                              onChange={() => setPreferences(prev => ({ ...prev, learningGoal: goal }))}
                            />
                            <span className="text-gray-700 text-sm">{goal}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-4">
                        Practice Frequency
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 text-white bg-gray-700"
                        value={preferences.practiceFrequency}
                        onChange={(e) => setPreferences(prev => ({ ...prev, practiceFrequency: e.target.value }))}
                      >
                        <option>Daily</option>
                        <option>3-4 times per week</option>
                        <option>1-2 times per week</option>
                        <option>As needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-4">
                        Difficulty Level
                      </label>
                      <div className="flex space-x-6">
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                          <label key={level} className="flex items-center">
                            <input
                              type="radio"
                              name="difficulty"
                              className="mr-3 text-gray-600"
                              checked={level === preferences.difficultyLevel}
                              onChange={() => setPreferences(prev => ({ ...prev, difficultyLevel: level }))}
                            />
                            <span className="text-gray-700 text-sm">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 text-gray-600"
                          checked={preferences.enableVoiceFeedback}
                          onChange={(e) => setPreferences(prev => ({ ...prev, enableVoiceFeedback: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm">Enable voice feedback</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 text-gray-600"
                          checked={preferences.showAnalytics}
                          onChange={(e) => setPreferences(prev => ({ ...prev, showAnalytics: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm">Show performance analytics</span>
                      </label>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        onClick={savePreferences}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                    {saveSuccess && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Notification settings saved!</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">Practice reminders</span>
                          <input
                            type="checkbox"
                            className="text-gray-600"
                            checked={notifications.email.practiceReminders}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              email: { ...prev.email, practiceReminders: e.target.checked }
                            }))}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">Progress reports</span>
                          <input
                            type="checkbox"
                            className="text-gray-600"
                            checked={notifications.email.progressReports}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              email: { ...prev.email, progressReports: e.target.checked }
                            }))}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">New features</span>
                          <input
                            type="checkbox"
                            className="text-gray-600"
                            checked={notifications.email.newFeatures}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              email: { ...prev.email, newFeatures: e.target.checked }
                            }))}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">Daily practice reminder</span>
                          <input
                            type="checkbox"
                            className="text-gray-600"
                            checked={notifications.push.dailyReminder}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              push: { ...prev.push, dailyReminder: e.target.checked }
                            }))}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">Achievement unlocked</span>
                          <input
                            type="checkbox"
                            className="text-gray-600"
                            checked={notifications.push.achievements}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              push: { ...prev.push, achievements: e.target.checked }
                            }))}
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">Session completed</span>
                          <input
                            type="checkbox"
                            className="text-gray-600"
                            checked={notifications.push.sessionCompleted}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              push: { ...prev.push, sessionCompleted: e.target.checked }
                            }))}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium bg-white text-gray-600 mb-4">
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        className="px-4 py-3 border bg-white border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0"
                        value={notifications.reminderTime}
                        onChange={(e) => setNotifications(prev => ({ ...prev, reminderTime: e.target.value }))}
                      />
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        onClick={saveNotifications}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-8">Security Settings</h2>

                  <div className="space-y-8">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-3">Change Password</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Update your password to keep your account secure.
                      </p>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Current password"
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0"
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0"
                        />
                        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Account Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm">
                          Download my data
                        </button>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                        >
                          Sign out of all devices
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm">
                          Delete account permanently
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}