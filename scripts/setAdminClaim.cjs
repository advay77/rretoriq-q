/**
 * Script to set admin custom claims for a user
 * 
 * This script uses Firebase Admin SDK to set the `admin: true` custom claim
 * on a user account, allowing them to access the institutional admin portal.
 * 
 * Usage:
 *   node scripts/setAdminClaim.js <user-email>
 * 
 * Example:
 *   node scripts/setAdminClaim.js admin@university.edu
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require(path.join(__dirname, '..', '..', 'rretoriq25-firebase-adminsdk-fbsvc-6e2a60ea50.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'rretoriq25'
});

/**
 * Set admin custom claim for a user
 * @param {string} email - User email address
 */
async function setAdminClaim(email) {
  try {
    console.log(`🔍 Looking up user: ${email}...`);
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    console.log(`✅ User found: ${user.uid}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Display Name: ${user.displayName || 'Not set'}`);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`\n🎉 SUCCESS! Admin claim set for ${email}`);
    console.log(`\n⚠️  IMPORTANT: User must log out and log back in for changes to take effect.`);
    
    // Verify the claim was set
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log(`\n🔍 Verification - Custom Claims:`, updatedUser.customClaims);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log(`\n💡 User with email "${email}" does not exist in Firebase Auth.`);
      console.log(`   Please create the user account first, then run this script again.`);
    }
    
    process.exit(1);
  }
}

/**
 * List all users with admin claims (optional utility)
 */
async function listAdmins() {
  try {
    console.log('📋 Listing all users with admin claims...\n');
    
    const listUsers = await admin.auth().listUsers(1000);
    const admins = listUsers.users.filter(user => user.customClaims?.admin === true);
    
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      console.log(`Found ${admins.length} admin user(s):\n`);
      admins.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (UID: ${user.uid})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

/**
 * Remove admin claim from a user (optional utility)
 */
async function removeAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: false });
    console.log(`✅ Admin claim removed from ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

// ============================================
// Command Line Interface
// ============================================

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║         🔐 Admin Custom Claim Manager                    ║
╚══════════════════════════════════════════════════════════╝

Usage:
  node scripts/setAdminClaim.js <command> [email]

Commands:
  set <email>       Set admin claim for user
  remove <email>    Remove admin claim from user
  list              List all users with admin claims

Examples:
  node scripts/setAdminClaim.js set admin@university.edu
  node scripts/setAdminClaim.js remove admin@university.edu
  node scripts/setAdminClaim.js list
`);
  process.exit(0);
}

// Handle commands
switch (command.toLowerCase()) {
  case 'set':
    if (!args[1]) {
      console.error('❌ Error: Email address required');
      console.log('Usage: node scripts/setAdminClaim.js set <email>');
      process.exit(1);
    }
    setAdminClaim(args[1]);
    break;
    
  case 'remove':
    if (!args[1]) {
      console.error('❌ Error: Email address required');
      console.log('Usage: node scripts/setAdminClaim.js remove <email>');
      process.exit(1);
    }
    removeAdminClaim(args[1]);
    break;
    
  case 'list':
    listAdmins();
    break;
    
  default:
    // Backward compatibility: if no command specified, assume 'set'
    if (command.includes('@')) {
      setAdminClaim(command);
    } else {
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run without arguments to see usage.');
      process.exit(1);
    }
}
