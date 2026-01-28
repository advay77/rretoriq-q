import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { dashboardService } from '../../services/dashboardService'
import { getInstitution } from '../../services/adminService'
import WordPhraseCard from '../../components/WordPhraseCard'
import { 
  BookOpen, 
  Briefcase, 
  BarChart3, 
  Clock, 
  Target, 
  Award, 
  Plus, 
  ArrowUpRight, 
  Loader2,
  TrendingUp,
  Activity,
  Sparkles,
  Users,
  Building2
} from 'lucide-react'

interface DashboardStats {
  totalSessions: number
  averageScore: number
  totalPracticeTime: number
  achievementsCount: number
}

interface InstitutionStats extends DashboardStats {
  totalStudents: number
  activeStudents: number
  institutionName: string
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    totalSessions: 0,
    averageScore: 0,
    totalPracticeTime: 0,
    achievementsCount: 0
  })
  const [institutionData, setInstitutionData] = useState<InstitutionStats | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        if (user) {
          // Check if user is admin
          const userIsAdmin = (user as any)?.admin === true
          console.log('🔍 Dashboard: Checking admin status', { 
            userIsAdmin, 
            user: user,
            adminField: (user as any)?.admin 
          })
          setIsAdmin(userIsAdmin)

          if (userIsAdmin) {
            // Load institution-wide stats
            console.log('👑 User is admin, loading institution data...')
            try {
              console.log('📡 Fetching institution for user ID:', (user as any).id)
              const institutionInfo = await getInstitution((user as any).id)
              console.log('📊 Institution data received:', institutionInfo)
              
              if (institutionInfo.hasInstitution && institutionInfo.institution && institutionInfo.studentDetails) {
                console.log('✅ Institution found with students:', institutionInfo.studentDetails.length)
                // Calculate aggregated stats from all students
                let totalSessions = 0
                let totalScore = 0
                let totalPracticeTime = 0
                let totalAchievements = 0
                let studentsWithSessions = 0

                for (const student of institutionInfo.studentDetails) {
                  // Use the id field from the student object
                  const studentId = (student as any).id
                  console.log('📈 Loading stats for student:', studentId, student)
                  if (studentId) {
                    const stats = await dashboardService.getUserStats(studentId)
                    console.log('  Stats:', stats)
                    totalSessions += stats.totalSessions
                    if (stats.totalSessions > 0) {
                      totalScore += stats.averageScore
                      studentsWithSessions++
                    }
                    totalPracticeTime += stats.totalPracticeTime
                    totalAchievements += stats.achievementsCount
                  }
                }

                const aggregatedData = {
                  totalStudents: institutionInfo.studentDetails.length,
                  activeStudents: studentsWithSessions,
                  institutionName: institutionInfo.institution.institutionName || 'Your Institution',
                  totalSessions,
                  averageScore: studentsWithSessions > 0 ? totalScore / studentsWithSessions : 0,
                  totalPracticeTime,
                  achievementsCount: totalAchievements
                }
                console.log('🎯 Final aggregated data:', aggregatedData)
                setInstitutionData(aggregatedData)
              } else {
                console.warn('⚠️ No institution found - admin needs to create institution first')
                // Admin has no institution yet - show personal stats as fallback
                const userStats = await dashboardService.getUserStats(user.id)
                console.log('📊 Showing personal stats instead:', userStats)
                setDashboardData(userStats)
              }
            } catch (error) {
              console.error('❌ Error loading institution stats:', error)
              // Fallback to personal stats on error
              const userStats = await dashboardService.getUserStats(user.id)
              setDashboardData(userStats)
            }
          } else {
            console.log('👤 Regular user, loading personal stats...')
            // Load personal stats for regular users
            const userStats = await dashboardService.getUserStats(user.id)
            console.log('📊 Personal stats:', userStats)
            setDashboardData(userStats)
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Use mock data on error
        setDashboardData({
          totalSessions: 0,
          averageScore: 0,
          totalPracticeTime: 0,
          achievementsCount: 0
        })
      } finally {
        setTimeout(() => setLoading(false), 800) // Smooth loading experience
      }
    }

    loadDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-sm text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Use institution data if admin, otherwise personal data
  const displayData = isAdmin && institutionData ? institutionData : dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-16">
      <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      {/* Admin Institution Banner */}
      {isAdmin && institutionData && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{institutionData.institutionName}</h2>
                <p className="text-blue-100 text-sm mt-1.5">Institution Dashboard - Aggregated Student Statistics</p>
              </div>
            </div>
            <Link 
              to="/admin/dashboard"
              className="px-5 py-2.5 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-all duration-300 hover:shadow-lg"
            >
              Manage Institution
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-5 mt-8">
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/15 transition-colors duration-300">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
                <Users className="w-4 h-4" />
                Total Students
              </div>
              <p className="text-3xl font-semibold">{institutionData.totalStudents}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm hover:bg-white/15 transition-colors duration-300">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
                <Activity className="w-4 h-4" />
                Active Students
              </div>
              <p className="text-3xl font-semibold">{institutionData.activeStudents}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {isAdmin && institutionData 
              ? `${institutionData.institutionName} Overview` 
              : `Welcome back, ${(user as any)?.displayName || (user as any)?.firstName || 'User'}`
            }
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {isAdmin && institutionData 
              ? 'Aggregated statistics from all students in your institution' 
              : "Here's your learning progress overview"
            }
          </p>
        </div>
        {!isAdmin && (
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto justify-center hover:shadow-lg hover:scale-105">
            <Plus className="w-4 h-4" />
            New Session
          </button>
        )}
      </div>

      {/* Word & Phrase of the Day - Placed prominently at top */}
      <WordPhraseCard className="w-full" />

      {/* Stats Grid - Colorful and vibrant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Total Sessions Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-7 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1.5">Total Sessions</h3>
          <p className="text-4xl font-bold mb-1">{displayData.totalSessions}</p>
          <p className="text-white/70 text-xs mt-2">All completed practice sessions</p>
        </div>

        {/* Average Score Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-7 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1.5">Average Score</h3>
          <p className="text-4xl font-bold mb-1">{displayData.averageScore.toFixed(1)}</p>
          <p className="text-white/70 text-xs mt-2">Across all practice areas</p>
        </div>

        {/* Practice Time Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-7 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1.5">Practice Time</h3>
          <p className="text-4xl font-bold mb-1">{Math.floor(displayData.totalPracticeTime / 3600)}h</p>
          <p className="text-white/70 text-xs mt-2">Total learning hours</p>
        </div>

        {/* Achievements Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-7 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1.5">Achievements</h3>
          <p className="text-4xl font-bold mb-1">{displayData.achievementsCount}</p>
          <p className="text-white/70 text-xs mt-2">Milestones unlocked</p>
        </div>
      </div>

      {/* Quick Actions - Sana.ai inspired card layout - Hidden for admins */}
      {!isAdmin && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {/* Let's Communicate Card */}
          <Link 
            to="/ielts"
            className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-7 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-3 text-lg">Let's Communicate</h3>
            <p className="text-sm text-blue-100 mb-5 leading-relaxed">
              Improve your communication skills with AI-powered feedback and personalized coaching sessions.
            </p>
            <div className="flex items-center text-white font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Start Practice
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Interview Practice Card */}
          <Link 
            to="/interview"
            className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-7 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-3 text-lg">Interview Practice</h3>
            <p className="text-sm text-emerald-100 mb-5 leading-relaxed">
              Prepare for job interviews with mock sessions, real-time feedback, and expert tips.
            </p>
            <div className="flex items-center text-white font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Start Interview
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Progress Analytics Card */}
          <Link 
            to="/progress"
            className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-7 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-3 text-lg">View Progress</h3>
            <p className="text-sm text-purple-100 mb-5 leading-relaxed">
              Track your improvement with detailed analytics, insights, and performance metrics.
            </p>
            <div className="flex items-center text-white font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              View Analytics
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>
      )}

      {/* Motivational Message Section - Hidden for admins */}
      {!isAdmin && (
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">Your Learning Journey</h2>
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 text-white">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Keep Going! You're Doing Great!</h3>
              <p className="text-purple-100 text-base leading-relaxed mb-6">
                Every practice session brings you one step closer to mastering communication. Consistency is key to improvement. 
                {displayData.totalSessions > 0 
                  ? ` You've already completed ${displayData.totalSessions} session${displayData.totalSessions > 1 ? 's' : ''} - that's amazing progress!`
                  : " Start your first practice session today and begin your journey to excellence!"
                }
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-medium shadow-md">
                  💪 Stay Consistent
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-medium shadow-md">
                  🎯 Focus on Growth
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-medium shadow-md">
                  ✨ Believe in Yourself
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
      </div>
    </div>
  )
}