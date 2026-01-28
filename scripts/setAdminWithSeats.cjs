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
 * Set admin claim + seat allocation for an institution admin
 * Usage: node setAdminWithSeats.cjs <email> <seats>
 * Example: node setAdminWithSeats.cjs vocalens.projecct@gmail.com 50
 */
async function setAdminWithSeats(email, seats) {
  try {
    console.log(`\n🔍 Finding user: ${email}...`);
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;
    
    console.log(`✅ User found: ${uid}`);
    console.log(`\n⚙️  Setting admin claim...`);
    
    // Set admin custom claim (using 'admin' key to match authStore)
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    console.log(`✅ Admin claim set`);
    console.log(`\n💺 Setting ${seats} seats in Firestore...`);
    
    // Get current seats data first (for logging)
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const currentData = userDoc.exists ? userDoc.data() : null;
    
    if (currentData?.seats) {
      console.log(`   Current seats: ${currentData.seats.total} (${currentData.seats.available} available, ${currentData.seats.allocated} allocated)`);
    } else {
      console.log(`   No existing seat allocation found`);
    }
    
    // Force overwrite seats (not merge)
    await userRef.set({
      seats: {
        total: seats,
        allocated: 0,
        available: seats,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'admin-script'
      }
    }, { merge: true });
    
    // Verify update
    const updatedDoc = await userRef.get();
    const updatedSeats = updatedDoc.data()?.seats;
    
    console.log(`✅ Seats allocated`);
    console.log(`   New seats: ${updatedSeats?.total} (${updatedSeats?.available} available)`);

    console.log(`\n✨ SUCCESS!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Email:     ${email}`);
    console.log(`User ID:   ${uid}`);
    console.log(`Admin:     ✓ YES`);
    console.log(`Seats:     ${seats} (${seats} available)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}\n`);
    
    if (error.code === 'auth/user-not-found') {
      console.log(`💡 Tip: Make sure the user has signed up in your app first.\n`);
    }
    
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('\n❌ Invalid arguments');
  console.log('\nUsage: node setAdminWithSeats.cjs <email> <seats>');
  console.log('Example: node setAdminWithSeats.cjs vocalens.projecct@gmail.com 50\n');
  process.exit(1);
}

const [email, seatsArg] = args;
const seats = parseInt(seatsArg, 10);

if (isNaN(seats) || seats < 0) {
  console.log('\n❌ Seats must be a valid number >= 0\n');
  process.exit(1);
}

setAdminWithSeats(email, seats);
