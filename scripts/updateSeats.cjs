const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccountPath = path.resolve(__dirname, '../../rretoriq25-firebase-adminsdk-fbsvc-6e2a60ea50.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rretoriq25.firebaseio.com'
});

/**
 * Add more seats to an existing admin
 * Usage: node updateSeats.cjs <email> <additional_seats>
 * Example: node updateSeats.cjs vocalens.projecct@gmail.com 25
 */
async function updateSeats(email, additionalSeats) {
  try {
    console.log(`\n🔍 Finding user: ${email}...`);
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;
    
    console.log(`✅ User found: ${uid}`);
    console.log(`\n📊 Fetching current seat allocation...`);
    
    // Get current seats
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    const currentSeats = userDoc.data()?.seats || { total: 0, allocated: 0, available: 0 };
    
    console.log(`Current seats: ${currentSeats.total} (${currentSeats.available} available, ${currentSeats.allocated} allocated)`);
    console.log(`\n➕ Adding ${additionalSeats} seats...`);
    
    const newTotal = currentSeats.total + additionalSeats;
    const newAvailable = currentSeats.available + additionalSeats;
    
    // Update seats
    await db.collection('users').doc(uid).update({
      'seats.total': newTotal,
      'seats.available': newAvailable,
      'seats.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
      'seats.updatedBy': 'admin-script'
    });
    
    console.log(`✅ Seats updated`);
    console.log(`\n✨ SUCCESS!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Email:          ${email}`);
    console.log(`User ID:        ${uid}`);
    console.log(`Previous Total: ${currentSeats.total}`);
    console.log(`Added:          +${additionalSeats}`);
    console.log(`New Total:      ${newTotal}`);
    console.log(`Available:      ${newAvailable}`);
    console.log(`Allocated:      ${currentSeats.allocated}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}\n`);
    
    if (error.code === 'auth/user-not-found') {
      console.log(`💡 Tip: Make sure the user exists in Firebase Auth.\n`);
    }
    
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('\n❌ Invalid arguments');
  console.log('\nUsage: node updateSeats.cjs <email> <additional_seats>');
  console.log('Example: node updateSeats.cjs vocalens.projecct@gmail.com 25\n');
  process.exit(1);
}

const [email, seatsArg] = args;
const additionalSeats = parseInt(seatsArg, 10);

if (isNaN(additionalSeats) || additionalSeats <= 0) {
  console.log('\n❌ Additional seats must be a valid number > 0\n');
  process.exit(1);
}

updateSeats(email, additionalSeats);
