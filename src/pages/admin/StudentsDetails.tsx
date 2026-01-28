import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { getInstitution } from '../../services/adminService'
import { dashboardService } from '../../services/dashboardService'
import { 
  Loader2, 
  GraduationCap, 
  Mail, 
  Calendar,
  BarChart3,
  Clock,
  Target,
  Award,
  Search
} from 'lucide-react'

interface StudentDetail {
  id: string
  username: string
  email: string
  displayName: string
  createdAt: string
  stats?: {
    totalSessions: number
    averageScore: number
    totalPracticeTime: number
    achievementsCount: number
  }
}

export default function StudentsDetails() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<StudentDetail[]>([])
  const [institutionName, setInstitutionName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true)
      try {
        if (user) {
          const institutionInfo = await getInstitution((user as any).id)
          
          if (institutionInfo.hasInstitution && institutionInfo.institution && institutionInfo.studentDetails) {
            setInstitutionName(institutionInfo.institution.institutionName)
            
            // Load stats for each student
            const studentsWithStats = await Promise.all(
              institutionInfo.studentDetails.map(async (student: any) => {
                const stats = await dashboardService.getUserStats(student.id)
                return {
                  ...student,
                  stats
                }
              })
            )
            
            setStudents(studentsWithStats)
          }
        }
      } catch (error) {
        console.error('Error loading students:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [user])

  const filteredStudents = students.filter(student =>
    student.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <GraduationCap className="w-7 h-7 text-blue-600" />
          Students Details
        </h1>
        <p className="text-gray-600 mt-1">
          {institutionName ? `${institutionName} - ` : ''}View and manage all students in your institution
        </p>
      </div>

      {/* Search and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Search Bar - takes more space */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4 h-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Compact Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            <p className="text-xs text-gray-600 mt-1">Total Students</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {students.filter(s => (s.stats?.totalSessions || 0) > 0).length}
            </p>
            <p className="text-xs text-gray-600 mt-1">Active Students</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(students.reduce((sum, s) => sum + (s.stats?.totalPracticeTime || 0), 0) / 60)}h
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Hours</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {students.reduce((sum, s) => sum + (s.stats?.totalSessions || 0), 0)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Sessions</p>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Study Time
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      {searchQuery ? 'No students found matching your search' : 'No students added yet'}
                    </p>
                    {!searchQuery && (
                      <p className="text-gray-400 text-sm mt-1">Students will appear here once added to your institution</p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {student.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.displayName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                        <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">{student.stats?.totalSessions || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                        <Target className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">
                          {student.stats?.averageScore ? `${Math.round(student.stats.averageScore)}%` : '0%'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">
                          {student.stats?.totalPracticeTime ? `${Math.round(student.stats.totalPracticeTime / 60)}h` : '0h'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(student.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
