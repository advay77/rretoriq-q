/**
 * Resume Parsing Service using Gemini AI
 * 
 * Extracts structured profile data from resume files (PDF, DOC, DOCX, TXT)
 * Uses the same Gemini proxy as speech analysis for consistency
 */

// Proxy configuration
const API_PROXY_BASE = import.meta.env.VITE_API_PROXY_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname.includes('rretoriq25.web.app') ? 'https://rretoriq-backend-api.vercel.app/api' : '/api')
const GEMINI_PROXY_URL = `${API_PROXY_BASE}/gemini-proxy`

export interface ParsedResumeData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  location?: string
  dateOfBirth?: string
  occupation?: string
  company?: string
  education?: string
  languages?: string[]
  bio?: string
  skills?: string[]
  experience?: string
  linkedIn?: string
  github?: string
}

/**
 * Parse resume file using Gemini AI to extract structured profile data
 */
export async function parseResumeWithGemini(file: File): Promise<ParsedResumeData> {
  try {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.')
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit.')
    }

    // Convert file to base64
    const base64Data = await fileToBase64(file)

    // Create prompt for structured data extraction
    const prompt = `You are an expert resume parser. Extract the following information from this resume and return it as a valid JSON object. If any field is not found, omit it from the response.

Expected JSON structure:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "location": "city, country format",
  "dateOfBirth": "YYYY-MM-DD format if available",
  "occupation": "current or most recent job title",
  "company": "current or most recent company name",
  "education": "highest degree and institution",
  "languages": ["language1", "language2"],
  "bio": "a 2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "brief summary of total years and key roles",
  "linkedIn": "LinkedIn profile URL if found",
  "github": "GitHub profile URL if found"
}

Important guidelines:
- Extract only factual information present in the resume
- For location, use "City, Country" format
- For bio, create a concise professional summary based on experience
- Languages should include both programming languages and spoken languages
- Return ONLY the JSON object, no additional text or markdown
- Ensure all values are properly escaped strings`

    // Call Gemini proxy
    const response = await fetch(GEMINI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: prompt, // Use 'input' field that proxy expects
        fileData: {
          data: base64Data,
          mimeType: file.type
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini proxy error:', errorText)
      throw new Error('Failed to parse resume with AI')
    }

    const data = await response.json()
    
    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || data.response

    if (!text) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsedData: ParsedResumeData = JSON.parse(cleanedText)

    // Validate and sanitize parsed data
    return sanitizeParsedData(parsedData)
  } catch (error) {
    console.error('Resume parsing error:', error)
    throw new Error('Failed to parse resume. Please try again or fill the form manually.')
  }
}

/**
 * Convert file to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1]
      resolve(base64String)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Sanitize and validate parsed resume data
 */
function sanitizeParsedData(data: ParsedResumeData): ParsedResumeData {
  const sanitized: ParsedResumeData = {}

  // Validate and sanitize each field
  if (data.firstName && typeof data.firstName === 'string') {
    sanitized.firstName = data.firstName.trim()
  }
  
  if (data.lastName && typeof data.lastName === 'string') {
    sanitized.lastName = data.lastName.trim()
  }
  
  if (data.email && typeof data.email === 'string' && isValidEmail(data.email)) {
    sanitized.email = data.email.trim().toLowerCase()
  }
  
  if (data.phone && typeof data.phone === 'string') {
    sanitized.phone = data.phone.trim()
  }
  
  if (data.location && typeof data.location === 'string') {
    sanitized.location = data.location.trim()
  }
  
  if (data.dateOfBirth && typeof data.dateOfBirth === 'string') {
    sanitized.dateOfBirth = data.dateOfBirth.trim()
  }
  
  if (data.occupation && typeof data.occupation === 'string') {
    sanitized.occupation = data.occupation.trim()
  }
  
  if (data.company && typeof data.company === 'string') {
    sanitized.company = data.company.trim()
  }
  
  if (data.education && typeof data.education === 'string') {
    sanitized.education = data.education.trim()
  }
  
  if (data.languages && Array.isArray(data.languages)) {
    sanitized.languages = data.languages.filter(lang => typeof lang === 'string').map(lang => lang.trim())
  }
  
  if (data.bio && typeof data.bio === 'string') {
    sanitized.bio = data.bio.trim()
  }
  
  if (data.skills && Array.isArray(data.skills)) {
    sanitized.skills = data.skills.filter(skill => typeof skill === 'string').map(skill => skill.trim())
  }
  
  if (data.experience && typeof data.experience === 'string') {
    sanitized.experience = data.experience.trim()
  }
  
  if (data.linkedIn && typeof data.linkedIn === 'string' && isValidURL(data.linkedIn)) {
    sanitized.linkedIn = data.linkedIn.trim()
  }
  
  if (data.github && typeof data.github === 'string' && isValidURL(data.github)) {
    sanitized.github = data.github.trim()
  }

  return sanitized
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
