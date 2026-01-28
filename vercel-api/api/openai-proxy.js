const axios = require('axios')

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

module.exports = async (req, res) => {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  try {
    const OPENAI_KEY = process.env.OPENAI_KEY
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI key not configured on server.' })

    const payload = req.body || {}

    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    })

    return res.status(response.status).json(response.data)
  } catch (err) {
    console.error('OpenAI proxy error:', err?.response?.data || err.message || err)
    const status = err?.response?.status || 500
    const data = err?.response?.data || { error: err.message }
    return res.status(status).json(data)
  }
}
