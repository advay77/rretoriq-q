import React from 'react'
import { Link } from 'react-router-dom'

const DebugHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Hero Section for Testing */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Test 1: Plain text */}
          <h1 className="text-8xl font-black text-white">
            Rretoriq
          </h1>
          
          {/* Test 2: With gradient */}
          <h1 className="text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Rretoriq
          </h1>
          
          {/* Test 3: With different colors */}
          <h1 className="text-8xl font-black text-cyan-400">
            Rretoriq
          </h1>
          
          {/* Test 4: Simple subtitle */}
          <h2 className="text-4xl font-bold text-white">
            Transform Your Communication
          </h2>
          
          <p className="text-xl text-gray-300">
            This is a debug version to test visibility
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              to="/ielts"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/glimpse"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg"
            >
              See AI in Action
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DebugHome