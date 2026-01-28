// Create or update institution profile
// POST /api/admin/create-institution
// Body: { institutionName, seatsPurchased, adminUserId }

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { institutionName, seatsPurchased, adminUserId } = req.body;

    // Validation
    if (!institutionName || !seatsPurchased || !adminUserId) {
      return res.status(400).json({ 
        error: 'Missing required fields: institutionName, seatsPurchased, adminUserId' 
      });
    }

    if (typeof seatsPurchased !== 'number' || seatsPurchased <= 0) {
      return res.status(400).json({ error: 'seatsPurchased must be a positive number' });
    }

    // Check if admin already has an institution
    const existingInstitutionsQuery = await db
      .collection('institutions')
      .where('adminUserId', '==', adminUserId)
      .limit(1)
      .get();

    let institutionId;
    let institutionRef;

    if (!existingInstitutionsQuery.empty) {
      // Update existing institution
      institutionRef = existingInstitutionsQuery.docs[0].ref;
      institutionId = existingInstitutionsQuery.docs[0].id;

      await institutionRef.update({
        institutionName,
        seatsPurchased,
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Institution updated: ${institutionId}`);
    } else {
      // Create new institution
      institutionRef = await db.collection('institutions').add({
        institutionName,
        adminUserId,
        seatsPurchased,
        students: [], // Array of usernames
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      institutionId = institutionRef.id;
      console.log(`✅ Institution created: ${institutionId}`);
    }

    // Get the created/updated institution data
    const institutionDoc = await institutionRef.get();
    const institutionData = institutionDoc.data();

    return res.status(200).json({
      success: true,
      institutionId,
      institution: {
        id: institutionId,
        ...institutionData,
      },
    });

  } catch (error) {
    console.error('❌ Error creating/updating institution:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create/update institution' 
    });
  }
};
