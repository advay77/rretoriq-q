import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class AIInterviewErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;
  private copyTimeoutId: number | null = null;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AI Interview Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service if configured
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real application, you would send this to your error tracking service
      // Examples: Sentry, LogRocket, Bugsnag, etc.
      console.log('Logging error to service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });

      // Example: Send to your API
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.message,
      //     stack: error.stack,
      //     componentStack: errorInfo.componentStack,
      //     timestamp: new Date().toISOString(),
      //     userAgent: navigator.userAgent,
      //     url: window.location.href,
      //   }),
      // });
    } catch (loggingError) {
      console.error('Failed to log error to service:', loggingError);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private copyErrorDetails = async () => {
    if (!this.state.error || !this.state.errorInfo) return;

    const errorDetails = {
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      this.setState({ copied: true });
      
      // Clear the copied state after 3 seconds
      if (this.copyTimeoutId) {
        clearTimeout(this.copyTimeoutId);
      }
      this.copyTimeoutId = window.setTimeout(() => {
        this.setState({ copied: false });
      }, 3000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  public componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-xl shadow-2xl border border-red-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-white text-center">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
                <p className="text-red-100">
                  An unexpected error occurred in the AI Interview System
                </p>
              </div>

              {/* Error Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">What happened?</h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Bug className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-red-800 mb-1">Error Message:</h3>
                        <p className="text-red-700 text-sm font-mono">
                          {this.state.error?.message || 'Unknown error occurred'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Troubleshooting Steps */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Try these solutions:</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Check your internet connection</h3>
                        <p className="text-gray-600 text-sm">Ensure you have a stable connection for AI features</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Verify API configuration</h3>
                        <p className="text-gray-600 text-sm">Make sure your OpenAI API key is valid and has credits</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Check browser permissions</h3>
                        <p className="text-gray-600 text-sm">Allow microphone access for voice recording</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Clear browser cache</h3>
                        <p className="text-gray-600 text-sm">Refresh your browser's stored data</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={this.handleReset}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <RefreshCw size={18} />
                      <span>Try Again</span>
                    </button>
                    
                    <button
                      onClick={this.handleRefresh}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <RefreshCw size={18} />
                      <span>Refresh Page</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={this.handleGoHome}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Home size={18} />
                      <span>Go to Dashboard</span>
                    </button>
                    
                    <button
                      onClick={this.copyErrorDetails}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                        this.state.copied
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {this.state.copied ? (
                        <>
                          <Check size={18} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>Copy Error</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Support Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm text-center">
                    If the problem persists, please contact support with the error details above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for voice recording
export class VoiceRecordingErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Voice Recording Error:', error, errorInfo);
    
    this.setState({ error, errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-medium text-red-800">Voice Recording Error</h3>
          </div>
          
          <p className="text-red-700 text-sm mb-4">
            {this.state.error?.message || 'Failed to access microphone or process voice recording'}
          </p>
          
          <div className="text-sm text-red-600 mb-4">
            <strong>Common solutions:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Allow microphone permissions in your browser</li>
              <li>Check if another app is using your microphone</li>
              <li>Try refreshing the page</li>
              <li>Ensure you're using HTTPS (required for microphone access)</li>
            </ul>
          </div>
          
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for AI evaluation
export class AIEvaluationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AI Evaluation Error:', error, errorInfo);
    
    this.setState({ error, errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-800">AI Evaluation Failed</h3>
          </div>
          
          <p className="text-yellow-700 text-sm mb-4">
            The AI evaluation service is currently unavailable. Your answer has been saved.
          </p>
          
          <div className="text-sm text-yellow-600 mb-4">
            <strong>Possible causes:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>OpenAI API key is invalid or has no credits</li>
              <li>API rate limits exceeded</li>
              <li>Network connectivity issues</li>
              <li>Service temporarily unavailable</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
            >
              <RefreshCw size={16} />
              <span>Retry Evaluation</span>
            </button>
            
            <button
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
              onClick={() => window.location.href = '/dashboard'}
            >
              Continue Without Evaluation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}