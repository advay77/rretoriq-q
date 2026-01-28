/**
 * API Utilities
 * 
 * Centralized API error handling, retry logic, and rate limiting utilities
 */

// ==========================================
// Types & Interfaces
// ==========================================

export interface ApiError {
  message: string
  code: string
  status?: number
  details?: any
}

export interface RetryConfig {
  maxRetries: number
  retryDelay: number // base delay in ms
  exponentialBackoff: boolean
  retryOnStatus?: number[] // HTTP status codes to retry on
}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number // time window in milliseconds
}

// ==========================================
// Error Handling
// ==========================================

/**
 * Custom API Error class
 */
export class ApiRequestError extends Error {
  code: string
  status?: number
  details?: any

  constructor(message: string, code: string, status?: number, details?: any) {
    super(message)
    this.name = 'ApiRequestError'
    this.code = code
    this.status = status
    this.details = details
  }
}

/**
 * Parse and format API errors
 * @param error - Error object
 * @returns ApiError
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiRequestError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
    }
  }

  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return {
        message: 'Authentication failed. Please check your API keys.',
        code: 'AUTH_ERROR',
        status: 401
      }
    }

    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMIT_ERROR',
        status: 429
      }
    }

    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return {
        message: 'Access denied. Please check your API key permissions.',
        code: 'PERMISSION_ERROR',
        status: 403
      }
    }

    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return {
        message: 'Resource not found.',
        code: 'NOT_FOUND_ERROR',
        status: 404
      }
    }

    if (error.message.includes('500') || error.message.includes('Internal Server')) {
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        status: 500
      }
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      }
    }

    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    }
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR'
  }
}

/**
 * Get user-friendly error message
 * @param error - Error object
 * @returns string
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = parseApiError(error)
  
  const friendlyMessages: Record<string, string> = {
    'AUTH_ERROR': 'Unable to authenticate. Please check your API configuration.',
    'RATE_LIMIT_ERROR': 'You\'re making requests too quickly. Please wait a moment.',
    'PERMISSION_ERROR': 'Permission denied. Please check your API key settings.',
    'NOT_FOUND_ERROR': 'The requested resource was not found.',
    'SERVER_ERROR': 'The server encountered an error. Please try again later.',
    'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
    'TIMEOUT_ERROR': 'The request took too long. Please try again.',
    'VALIDATION_ERROR': 'Invalid input data. Please check your submission.'
  }

  return friendlyMessages[apiError.code] || apiError.message
}

// ==========================================
// Retry Logic
// ==========================================

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  retryDelay: 1000,
  exponentialBackoff: true,
  retryOnStatus: [408, 429, 500, 502, 503, 504]
}

/**
 * Execute function with retry logic
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @returns Promise<T>
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = finalConfig.exponentialBackoff
          ? finalConfig.retryDelay * Math.pow(2, attempt - 1)
          : finalConfig.retryDelay

        console.log(`🔄 Retry attempt ${attempt}/${finalConfig.maxRetries} after ${delay}ms`)
        await sleep(delay)
      }

      return await fn()
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Check if we should retry based on error
      const shouldRetry = shouldRetryError(error, finalConfig.retryOnStatus)
      
      if (!shouldRetry || attempt === finalConfig.maxRetries) {
        throw lastError
      }

      console.error(`❌ Attempt ${attempt + 1} failed:`, lastError.message)
    }
  }

  throw lastError || new Error('All retry attempts failed')
}

/**
 * Determine if error should trigger a retry
 * @param error - Error object
 * @param retryOnStatus - HTTP status codes to retry on
 * @returns boolean
 */
function shouldRetryError(error: unknown, retryOnStatus?: number[]): boolean {
  if (!retryOnStatus || retryOnStatus.length === 0) {
    return true // Retry all errors if no specific statuses configured
  }

  const apiError = parseApiError(error)
  return apiError.status ? retryOnStatus.includes(apiError.status) : true
}

/**
 * Sleep helper for delays
 * @param ms - Milliseconds to sleep
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ==========================================
// Rate Limiting
// ==========================================

class RateLimiter {
  private requests: number[] = []
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  /**
   * Check if request can be made
   * @returns boolean
   */
  canMakeRequest(): boolean {
    const now = Date.now()
    
    // Remove requests outside the time window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    )

    return this.requests.length < this.config.maxRequests
  }

  /**
   * Record a new request
   */
  recordRequest(): void {
    this.requests.push(Date.now())
  }

  /**
   * Get time until next request is allowed
   * @returns number - milliseconds until next request
   */
  getWaitTime(): number {
    if (this.requests.length === 0) return 0
    
    const oldest = this.requests[0]
    const now = Date.now()
    const timeElapsed = now - oldest
    
    return Math.max(0, this.config.windowMs - timeElapsed)
  }

  /**
   * Wait until rate limit allows request
   * @returns Promise<void>
   */
  async waitForSlot(): Promise<void> {
    while (!this.canMakeRequest()) {
      const waitTime = this.getWaitTime()
      console.log(`⏳ Rate limit reached. Waiting ${waitTime}ms...`)
      await sleep(Math.min(waitTime, 1000)) // Wait in 1s increments
    }
    this.recordRequest()
  }
}

// Rate limiter instances for different services
export const openAIRateLimiter = new RateLimiter({
  maxRequests: 3, // 3 requests
  windowMs: 60 * 1000 // per minute
})

export const whisperRateLimiter = new RateLimiter({
  maxRequests: 50, // 50 requests
  windowMs: 60 * 1000 // per minute
})

// ==========================================
// Request Helpers
// ==========================================

/**
 * Make fetch request with timeout
 * @param url - Request URL
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise<Response>
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    
    clearTimeout(timeout)
    return response
    
  } catch (error) {
    clearTimeout(timeout)
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiRequestError(
        'Request timeout. Please try again.',
        'TIMEOUT_ERROR',
        408
      )
    }
    
    throw error
  }
}

/**
 * Parse JSON response with error handling
 * @param response - Fetch response
 * @returns Promise<T>
 */
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return await response.json()
  } catch (error) {
    throw new ApiRequestError(
      'Invalid JSON response from server',
      'PARSE_ERROR',
      response.status
    )
  }
}

/**
 * Validate response status
 * @param response - Fetch response
 * @throws ApiRequestError if status is not OK
 */
export async function validateResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    
    throw new ApiRequestError(
      errorData.message || errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
      getErrorCode(response.status),
      response.status,
      errorData
    )
  }
}

/**
 * Get error code from HTTP status
 * @param status - HTTP status code
 * @returns string
 */
function getErrorCode(status: number): string {
  const codes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'AUTH_ERROR',
    403: 'PERMISSION_ERROR',
    404: 'NOT_FOUND_ERROR',
    408: 'TIMEOUT_ERROR',
    429: 'RATE_LIMIT_ERROR',
    500: 'SERVER_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT'
  }
  
  return codes[status] || 'UNKNOWN_ERROR'
}

// ==========================================
// Logging Utilities
// ==========================================

export const logger = {
  error: (message: string, error?: unknown) => {
    console.error(`❌ ${message}`, error)
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ ${message}`, data)
  },
  
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data)
  },
  
  success: (message: string, data?: any) => {
    console.log(`✅ ${message}`, data)
  },
  
  debug: (message: string, data?: any) => {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log(`🔍 ${message}`, data)
    }
  }
}

// ==========================================
// Export Everything
// ==========================================

export default {
  parseApiError,
  getUserFriendlyErrorMessage,
  withRetry,
  sleep,
  openAIRateLimiter,
  whisperRateLimiter,
  fetchWithTimeout,
  parseJsonResponse,
  validateResponse,
  logger,
  ApiRequestError
}
