const { formidable } = require('formidable')

module.exports.config = {
  api: {
    bodyParser: false,
  },
}

function setCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

module.exports = async (req, res) => {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST requests allowed' })

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured.' })
  }

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

      const fs = require('fs')
      const filePath = fileObj.filepath
      const mimeType = fileObj.mimetype || 'audio/webm'
      const audioBase64 = fs.readFileSync(filePath).toString('base64')

      const language = Array.isArray(fields.language) ? fields.language[0] : fields.language

      const prompt =
        `You are a speech-to-text transcriber. ` +
        `Transcribe the attached audio into plain text${language ? ` in language code \"${language}\"` : ''}. ` +
        `Return ONLY the transcript text, no markdown, no JSON, no timestamps.`

      const model = 'gemini-2.0-flash'
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: audioBase64,
                },
              },
            ],
          },
        ],
      }

      try {
        const geminiResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const raw = await geminiResponse.text()

        if (!geminiResponse.ok) {
          console.error('Gemini API error response:', raw)
          return res.status(geminiResponse.status).json({ error: `Gemini API error: ${raw}` })
        }

        const data = JSON.parse(raw)
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        return res.status(200).json({
          text,
          response: text,
          raw: data,
        })
      } catch (e) {
        console.error('Gemini transcribe error:', e)
        return res.status(500).json({ error: e?.message || 'Gemini transcription failed' })
      }
    })
  } catch (e) {
    console.error('Gemini transcribe setup error:', e)
    return res.status(500).json({ error: e?.message || 'Internal server error', stack: e?.stack })
  }
}
