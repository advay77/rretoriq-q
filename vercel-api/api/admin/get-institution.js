// Get institution data with student list
// GET /api/admin/get-institution?adminUserId=xxx
// or GET /api/admin/get-institution?institutionId=xxx

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (only once)
let db;
try {
  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Missing Firebase environment variables');
    }
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  }
  db = getFirestore();
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

module.exports = async (req, res) => {
  // Set CORS headers first, before any logic
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET requests allowed' });
  }

  try {
    if (!db) {
      throw new Error('Firebase Admin not initialized');
    }
    
    const { adminUserId, institutionId } = req.query;
    
    console.log('🔍 get-institution called with:', { adminUserId, institutionId });

    if (!adminUserId && !institutionId) {
      return res.status(400).json({ 
        error: 'Either adminUserId or institutionId is required' 
      });
    }

    let institutionDoc;
    let institutionDocId;

    if (institutionId) {
      // Get by institution ID
      const docRef = db.collection('institutions').doc(institutionId);
      institutionDoc = await docRef.get();
      institutionDocId = institutionId;
    } else {
      // Get by admin user ID
      const query = await db
        .collection('institutions')
        .where('adminUserId', '==', adminUserId)
        .limit(1)
        .get();

      if (query.empty) {
        return res.status(404).json({ 
          error: 'No institution found for this admin',
          hasInstitution: false 
        });
      }

      institutionDoc = query.docs[0];
      institutionDocId = institutionDoc.id;
    }

    if (!institutionDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const institutionData = institutionDoc.data();
    const studentUsernames = institutionData.students || [];

    // Get detailed student information
    const studentsDetails = [];
    
    if (studentUsernames.length > 0) {
      // Fetch student details from users collection
      for (const username of studentUsernames) {
        const userQuery = await db
          .collection('users')
          .where('email', '==', username)
          .limit(1)
          .get();

        if (!userQuery.empty) {
          const userData = userQuery.docs[0].data();
          studentsDetails.push({
            id: userQuery.docs[0].id,
            username: username,
            email: userData.email,
            displayName: userData.displayName || 'N/A',
            createdAt: userData.createdAt,
          });
        } else {
          // Try by displayName
          const userQueryByName = await db
            .collection('users')
            .where('displayName', '==', username)
            .limit(1)
            .get();

          if (!userQueryByName.empty) {
            const userData = userQueryByName.docs[0].data();
            studentsDetails.push({
              id: userQueryByName.docs[0].id,
              username: username,
              email: userData.email,
              displayName: userData.displayName || 'N/A',
              createdAt: userData.createdAt,
            });
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      institution: {
        id: institutionDocId,
        name: institutionData.institutionName,
        adminUserId: institutionData.adminUserId,
        seatsPurchased: institutionData.seatsPurchased,
        seatsUsed: studentUsernames.length,
        seatsRemaining: institutionData.seatsPurchased - studentUsernames.length,
        students: studentsDetails,
        createdAt: institutionData.createdAt,
        updatedAt: institutionData.updatedAt,
      },
    });

  } catch (error) {
    console.error('❌ Error fetching institution:', error);
    console.error('Stack:', error.stack);
    
    // Make sure CORS headers are set even on error
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch institution data',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
