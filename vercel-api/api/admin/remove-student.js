// Remove student from institution
// POST /api/admin/remove-student
// Body: { institutionId, username }

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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
    const { institutionId, username } = req.body;

    if (!institutionId || !username) {
      return res.status(400).json({ 
        error: 'Missing required fields: institutionId, username' 
      });
    }

    // Get institution
    const institutionRef = db.collection('institutions').doc(institutionId);
    const institutionDoc = await institutionRef.get();

    if (!institutionDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const institutionData = institutionDoc.data();
    const currentStudents = institutionData.students || [];

    // Check if student exists in institution
    if (!currentStudents.includes(username)) {
      return res.status(404).json({ 
        error: 'Student not found in this institution' 
      });
    }

    // Remove student from institution's student list
    const updatedStudents = currentStudents.filter(s => s !== username);
    await institutionRef.update({
      students: updatedStudents,
      updatedAt: new Date().toISOString(),
    });

    // Find and update student's institutionId
    const usersQuery = await db
      .collection('users')
      .where('email', '==', username)
      .limit(1)
      .get();

    if (!usersQuery.empty) {
      await usersQuery.docs[0].ref.update({
        institutionId: null,
        institutionName: null,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Try by displayName
      const usersQueryByName = await db
        .collection('users')
        .where('displayName', '==', username)
        .limit(1)
        .get();

      if (!usersQueryByName.empty) {
        await usersQueryByName.docs[0].ref.update({
          institutionId: null,
          institutionName: null,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    console.log(`✅ Student ${username} removed from institution ${institutionId}`);

    return res.status(200).json({
      success: true,
      message: `Student ${username} removed successfully`,
      remainingSeats: institutionData.seatsPurchased - updatedStudents.length,
    });

  } catch (error) {
    console.error('❌ Error removing student:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to remove student' 
    });
  }
};
