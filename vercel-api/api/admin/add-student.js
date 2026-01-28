// Add student to institution by username
// POST /api/admin/add-student
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

    // Check if student already added
    if (currentStudents.includes(username)) {
      return res.status(400).json({ 
        error: 'Student already added to this institution' 
      });
    }

    // Check seat limit
    if (currentStudents.length >= institutionData.seatsPurchased) {
      return res.status(400).json({ 
        error: `Seat limit reached. You have ${institutionData.seatsPurchased} seats purchased.` 
      });
    }

    // Find student by username in users collection
    const usersQuery = await db
      .collection('users')
      .where('email', '==', username) // Assuming username is email or unique identifier
      .limit(1)
      .get();

    if (usersQuery.empty) {
      // Try by displayName or custom username field
      const usersQueryByName = await db
        .collection('users')
        .where('displayName', '==', username)
        .limit(1)
        .get();

      if (usersQueryByName.empty) {
        return res.status(404).json({ 
          error: `Student with username "${username}" not found. Please ask the student to register first.` 
        });
      }

      var studentDoc = usersQueryByName.docs[0];
    } else {
      var studentDoc = usersQuery.docs[0];
    }

    const studentId = studentDoc.id;
    const studentData = studentDoc.data();

    // Check if student is already in another institution
    if (studentData.institutionId && studentData.institutionId !== institutionId) {
      return res.status(400).json({ 
        error: 'Student is already enrolled in another institution' 
      });
    }

    // Add student to institution's student list
    await institutionRef.update({
      students: [...currentStudents, username],
      updatedAt: new Date().toISOString(),
    });

    // Update student's institutionId
    await db.collection('users').doc(studentId).update({
      institutionId: institutionId,
      institutionName: institutionData.institutionName,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ Student ${username} added to institution ${institutionId}`);

    return res.status(200).json({
      success: true,
      message: `Student ${username} added successfully`,
      student: {
        id: studentId,
        username: username,
        email: studentData.email,
        displayName: studentData.displayName,
      },
      remainingSeats: institutionData.seatsPurchased - (currentStudents.length + 1),
    });

  } catch (error) {
    console.error('❌ Error adding student:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to add student' 
    });
  }
};
