import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Institution } from '../../types/institution';
import { 
  Building2, 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Settings,
  Mail,
  X,
  GraduationCap
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_PROXY_BASE || 'https://rretoriq-backend-api.vercel.app/api';

export default function InstitutionAdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [institutionData, setInstitutionData] = useState<Institution | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Seats from user document (backend-controlled)
  const [userSeats, setUserSeats] = useState<{ total: number; allocated: number; available: number } | null>(null);

  // Form states
  const [institutionName, setInstitutionName] = useState('');
  const [seatsPurchased, setSeatsPurchased] = useState<number>(0);
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Loading states
  const [creatingInstitution, setCreatingInstitution] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);
  const [removingStudent, setRemovingStudent] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadInstitutionData();
  }, [user, navigate]);

  const loadInstitutionData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      // Fetch user seats from Firestore (backend-controlled)
      const userDocRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.seats) {
          setUserSeats(userData.seats);
        }
      }

      const response = await fetch(
        `${API_BASE}/admin/get-institution?adminUserId=${user.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setInstitutionData(data.institution);
        setInstitutionName(data.institution.name);
        setSeatsPurchased(data.institution.seatsPurchased);
      } else if (response.status === 404) {
        setInstitutionData(null);
      } else {
        setError(data.error || 'Failed to load institution data');
      }
    } catch (err) {
      console.error('Error loading institution:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreatingInstitution(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/admin/create-institution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionName,
          seatsPurchased: Number(seatsPurchased),
          adminUserId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(institutionData ? 'Institution updated successfully!' : 'Institution created successfully!');
        await loadInstitutionData();
      } else {
        setError(data.error || 'Failed to save institution');
      }
    } catch (err) {
      console.error('Error saving institution:', err);
      setError('Failed to connect to server');
    } finally {
      setCreatingInstitution(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionData || !user) return;

    setAddingStudent(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/admin/add-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: institutionData.id,
          username: usernameToAdd,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Student ${usernameToAdd} added successfully!`);
        setUsernameToAdd('');
        await loadInstitutionData();
      } else {
        setError(data.error || 'Failed to add student');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to connect to server');
    } finally {
      setAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (username: string) => {
    if (!institutionData || !confirm(`Remove ${username} from institution?`)) return;

    setRemovingStudent(username);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/admin/remove-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: institutionData.id,
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Student ${username} removed successfully!`);
        await loadInstitutionData();
      } else {
        setError(data.error || 'Failed to remove student');
      }
    } catch (err) {
      console.error('Error removing student:', err);
      setError('Failed to connect to server');
    } finally {
      setRemovingStudent(null);
    }
  };

  const filteredStudents = institutionData?.students?.filter(student =>
    student.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-500 font-medium">Loading institution data...</p>
        </div>
      </div>
    );
  }

  const seatsUsed = userSeats?.allocated || institutionData?.seatsUsed || 0;
  const seatsRemaining = userSeats?.available || institutionData?.seatsRemaining || 0;
  const seatsTotal = userSeats?.total || institutionData?.seatsPurchased || seatsPurchased || 0;
  const occupancyPercentage = seatsTotal > 0 ? Math.round((seatsUsed / seatsTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            Institution Admin Portal
          </h1>
          <Link 
            to="/admin/students"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <GraduationCap className="w-4 h-4" />
            View All Students
          </Link>
        </div>
        <p className="text-gray-600">Manage your institution's student accounts and seat allocation</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Institution Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Institution Settings Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Institution Settings
            </h2>

            <form onSubmit={handleCreateOrUpdateInstitution} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  required
                  placeholder="e.g., MUJ"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seats Purchased
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={seatsTotal}
                    readOnly
                    disabled
                    placeholder="Contact admin to update seats"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      Backend Controlled
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Seats are managed via admin script. Contact support to purchase more seats.
                </p>
              </div>

              <button
                type="submit"
                disabled={creatingInstitution}
                className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {creatingInstitution ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {institutionData ? 'Update Institution' : 'Create Institution'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Seat Usage Card */}
          {institutionData && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Seat Usage</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Seats:</span>
                  <span className="font-semibold text-gray-900">{seatsTotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Used:</span>
                  <span className="font-semibold text-blue-600">{seatsUsed}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-green-600">{seatsRemaining}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Occupancy</span>
                  <span className="font-medium">{occupancyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${occupancyPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {occupancyPercentage}% occupied
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Student Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Student Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-600" />
              Add Student
            </h2>

            <form onSubmit={handleAddStudent} className="flex gap-3">
              <input
                type="text"
                value={usernameToAdd}
                onChange={(e) => setUsernameToAdd(e.target.value)}
                placeholder="Enter student username or email"
                required
                disabled={!institutionData}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={addingStudent || !institutionData}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {addingStudent ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Students List Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  Students ({filteredStudents.length})
                </h2>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? 'No students found matching your search' : 'No students added yet'}
                  </p>
                  {!searchQuery && institutionData && (
                    <p className="text-gray-400 text-xs mt-1">Add students using the form above</p>
                  )}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.username} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {student.displayName?.charAt(0).toUpperCase() || student.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{student.displayName || 'N/A'}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {student.email || student.username}
                          </div>
                          {student.username && student.email && (
                            <p className="text-xs text-gray-400 mt-0.5">Username: {student.username}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveStudent(student.username)}
                        disabled={removingStudent === student.username}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Remove student"
                      >
                        {removingStudent === student.username ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserMinus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
