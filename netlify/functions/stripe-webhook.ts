
import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { Buffer } from 'buffer';

// This file now handles Gumroad Pings (webhooks).
// It's responsible for granting course access after a successful purchase.

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_ADMIN_SDK_CONFIG!, 'base64').toString('utf8')
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch(e) {
    console.error("Failed to initialize Firebase Admin SDK:", e);
  }
}

const db = admin.firestore();

const handler: Handler = async (event) => {
  // 1. Check for POST request
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { GUMROAD_PRODUCT_ID } = process.env;
  if (!GUMROAD_PRODUCT_ID) {
    console.error("Server configuration error: Missing GUMROAD_PRODUCT_ID.");
    return { statusCode: 500, body: 'Server configuration error.' };
  }

  try {
    const saleData = new URLSearchParams(event.body || '');
    const email = saleData.get('email');
    const productId = saleData.get('product_id');

    // 2. Validate the webhook payload
    if (!email || !productId) {
      console.warn("Webhook received with missing email or product_id.");
      return { statusCode: 400, body: "Bad Request: Missing required fields." };
    }
    
    // 3. Security check: Ensure the purchase is for our specific course product
    if (productId !== GUMROAD_PRODUCT_ID) {
      console.warn(`Webhook received for wrong product_id. Expected: ${GUMROAD_PRODUCT_ID}, Got: ${productId}`);
      return { statusCode: 400, body: "Invalid product." };
    }

    // 4. Find the user in Firebase Auth by their email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    if (!uid) {
      // This can happen if a user purchases with an email not registered on our site.
      // Manual intervention would be needed.
      console.error(`User with email ${email} purchased, but no matching user found in Firebase Auth.`);
      return { statusCode: 404, body: "User not found." };
    }

    // 5. Update the user's document in Firestore to grant access
    const userRef = db.collection('users').doc(uid);
    await userRef.set({ hasPaid: true }, { merge: true });
    
    console.log(`Successfully granted course access to user ${uid} (${email}).`);

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (err: any) {
    console.error("Error in Gumroad webhook handler:", err);
    // If getUserByEmail fails, it means the user doesn't exist.
    if (err.code === 'auth/user-not-found') {
        console.warn(`Purchase received for non-existent user: ${err.message}`);
        // Return 200 to Gumroad to prevent retries, as this is not a server error.
        return { statusCode: 200, body: "User not found, but webhook acknowledged."}
    }
    return { statusCode: 500, body: `Webhook Error: ${err.message}` };
  }
};

export { handler };
