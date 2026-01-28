// Health check endpoint to verify environment variables are loaded
// GET /api/admin/health

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
  const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
  const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      FIREBASE_PROJECT_ID: hasProjectId ? 'Set ✅' : 'Missing ❌',
      FIREBASE_CLIENT_EMAIL: hasClientEmail ? 'Set ✅' : 'Missing ❌',
      FIREBASE_PRIVATE_KEY: hasPrivateKey ? 'Set ✅' : 'Missing ❌',
    },
    firebaseConfig: {
      projectId: hasProjectId ? process.env.FIREBASE_PROJECT_ID : 'Not set',
      clientEmail: hasClientEmail ? process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 20) + '...' : 'Not set',
      privateKeyLength: hasPrivateKey ? process.env.FIREBASE_PRIVATE_KEY?.length : 0,
    }
  });
};
