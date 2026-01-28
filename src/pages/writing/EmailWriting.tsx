import React, { useState } from 'react';
import { Mail, BookOpen, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import EmailWritingSession from '../../components/EmailWritingSession';

type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

const EmailWriting: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  const startSession = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    setSessionActive(true);
  };

  const handleBackToSelection = () => {
    setSessionActive(false);
    setSelectedDifficulty(null);
  };

  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  // If session is active, show the session component
  if (sessionActive && selectedDifficulty) {
    return (
      <>
        <SEO
          title="Email Writing Practice - Let's Communicate"
          description="Practice professional email writing with AI-powered analysis and feedback"
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20">
          <EmailWritingSession
            difficulty={selectedDifficulty}
            onSessionComplete={handleBackToSelection}
          />
        </div>
      </>
    );
  }

  // Otherwise, show the difficulty selection page
  return (
    <>
      <SEO
        title="Email Writing Practice - Let's Communicate"
        description="Improve your professional email writing skills with AI-powered feedback and analysis"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-6 border border-purple-500/30">
              <Mail className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's Communicate
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Master the art of professional email writing with AI-powered analysis.
              <br />
              Practice writing emails for various scenarios and get instant feedback.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-World Scenarios</h3>
              <p className="text-sm text-gray-400">
                Practice with authentic workplace email situations from leave requests to client communications.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Analysis</h3>
              <p className="text-sm text-gray-400">
                Get comprehensive feedback on clarity, professionalism, tone, structure, and completeness.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Progressive Learning</h3>
              <p className="text-sm text-gray-400">
                Start with easy scenarios and progress to complex professional communications.
              </p>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Choose Your Difficulty Level
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Easy */}
              <button
                onClick={() => startSession('Easy')}
                className="group bg-gradient-to-br from-green-900/40 to-green-800/20 hover:from-green-800/60 hover:to-green-700/40 rounded-2xl p-8 border border-green-500/30 hover:border-green-500/60 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-green-500/20"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">📧</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-300 mb-3">Easy</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Basic workplace emails
                  </p>
                  <ul className="text-xs text-gray-500 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Simple requests and confirmations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Thank you notes and acknowledgments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Team communications</span>
                    </li>
                  </ul>
                </div>
              </button>

              {/* Medium */}
              <button
                onClick={() => startSession('Medium')}
                className="group bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 hover:from-yellow-800/60 hover:to-yellow-700/40 rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-yellow-500/20"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-3">Medium</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Professional communications
                  </p>
                  <ul className="text-xs text-gray-500 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Client communications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Progress updates and reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Follow-up emails</span>
                    </li>
                  </ul>
                </div>
              </button>

              {/* Hard */}
              <button
                onClick={() => startSession('Hard')}
                className="group bg-gradient-to-br from-red-900/40 to-red-800/20 hover:from-red-800/60 hover:to-red-700/40 rounded-2xl p-8 border border-red-500/30 hover:border-red-500/60 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-red-500/20"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-300 mb-3">Hard</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Complex situations
                  </p>
                  <ul className="text-xs text-gray-500 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>Conflict resolution and negotiations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>Leadership communications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>Sensitive professional situations</span>
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold text-purple-400">
                  1
                </div>
                <h4 className="font-semibold text-white mb-2">Choose Level</h4>
                <p className="text-sm text-gray-400">Select a difficulty level that matches your skill</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold text-purple-400">
                  2
                </div>
                <h4 className="font-semibold text-white mb-2">Read Scenario</h4>
                <p className="text-sm text-gray-400">Understand the email scenario and requirements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold text-purple-400">
                  3
                </div>
                <h4 className="font-semibold text-white mb-2">Write Email</h4>
                <p className="text-sm text-gray-400">Compose your professional email response</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold text-purple-400">
                  4
                </div>
                <h4 className="font-semibold text-white mb-2">Get Feedback</h4>
                <p className="text-sm text-gray-400">Receive detailed AI-powered analysis and tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailWriting;
