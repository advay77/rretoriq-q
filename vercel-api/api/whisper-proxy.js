const axios = require('axios')
const { formidable } = require('formidable')
const FormData = require('form-data')

module.exports.config = {
  api: {
    bodyParser: false,
  },
}

function setCors(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  const origin = req.headers.origin
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  } else if (allowed.length === 0 || allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}

// This handler uses Busboy to parse multipart file uploads and streams them to OpenAI.
module.exports = (req, res) => {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const OPENAI_KEY = process.env.OPENAI_KEY
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI key not configured on server.' })

  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    return res.status(400).json({ error: 'This endpoint expects multipart/form-data with field `file`' })
  }

  try {
    const form = formidable({ multiples: false, keepExtensions: true })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parse error:', err)
        return res.status(400).json({ error: 'Invalid multipart request' })
      }

      const fileField = files.file
      const fileObj = Array.isArray(fileField) ? fileField[0] : fileField
      if (!fileObj) return res.status(400).json({ error: 'Missing file field' })

      const filePath = fileObj.filepath
      const filename = fileObj.originalFilename || 'recording'
      const buffer = require('fs').readFileSync(filePath)

      try {
        const fd = new FormData()
        fd.append('file', buffer, { filename })
        fd.append('model', 'whisper-1')

        const language = Array.isArray(fields.language) ? fields.language[0] : fields.language
        const temperature = Array.isArray(fields.temperature) ? fields.temperature[0] : fields.temperature
        const responseFormat = Array.isArray(fields.response_format) ? fields.response_format[0] : fields.response_format

        if (language) fd.append('language', language)
        if (temperature) fd.append('temperature', temperature)
        if (responseFormat) fd.append('response_format', responseFormat)

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', fd, {
          headers: {
            Authorization: `Bearer ${OPENAI_KEY}`,
            ...fd.getHeaders()
          },
          timeout: 120000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        })

        return res.status(response.status).json(response.data)
      } catch (err) {
        console.error('Whisper proxy error:', err?.response?.data || err.message || err)
        const status = err?.response?.status || 500
        const data = err?.response?.data || { error: err.message }
        return res.status(status).json(data)
      }
    })
  } catch (err) {
    console.error('Whisper proxy setup error:', err)
    // Return detailed error for debugging (remove in production)
    return res.status(500).json({ error: err?.message || 'Internal server error', stack: err?.stack })
  }
}
