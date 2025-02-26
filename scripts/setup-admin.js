// scripts/setup-admin.js
// This script is meant to be run from the Firebase Admin SDK or Firebase Cloud Functions
// to set up the initial admin user and claim
require('dotenv').config();
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin with service account
const serviceAccount = require('../private-key.json'); // Replace with your path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
});

async function setupAdmin() {
  // Email of the user you want to make an admin
  const userEmail = 'mitra@test.com'; // Replace with your admin email
  
  try {
    // Get the user by email
    const userRecord = await getAuth().getUserByEmail(userEmail);
    
    // Set admin custom claim
    await getAuth().setCustomUserClaims(userRecord.uid, { admin: true });
    
    console.log(`Successfully set admin claim for user: ${userEmail}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
}

setupAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });