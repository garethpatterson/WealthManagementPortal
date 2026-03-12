// scripts/populateFirestore.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Make sure you have downloaded a service account JSON file from Firebase Console -> Project Settings -> Service Accounts
// and placed it in the scripts directory named "serviceAccountKey.json"
// DO NOT COMMIT THAT FILE
import serviceAccount from './serviceAccountKey.json' with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = getFirestore();
const auth = getAuth();

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const generateHistory = (startValue) => {
  const history = [];
  const today = new Date();
  let netWorth = startValue;
  let benchmarkValue = startValue;
  
  for (let i = 60; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const portfolioReturn = (Math.random() * 0.04) - 0.01; 
    const benchmarkReturn = (Math.random() * 0.05) - 0.015; 
    
    netWorth = netWorth * (1 + portfolioReturn);
    benchmarkValue = benchmarkValue * (1 + benchmarkReturn);
    
    if (i % 6 === 0 && i !== 60) {
      netWorth += (startValue * 0.02); 
      benchmarkValue += (startValue * 0.02);
    }

    history.push({
      date: d.toISOString().split('T')[0],
      netWorth,
      benchmarkValue,
      twr: 0.04 + ((60 - i) * 0.001), 
      irr: 0.038 + ((60 - i) * 0.0008)
    });
  }
  return history;
};

const CLIENTS = [
  { email: 'sarah.connor@example.com', name: 'Sarah Connor', password: 'password123', wealthTier: 2500000 },
  { email: 'james.holden@example.com', name: 'James Holden', password: 'password123', wealthTier: 850000 },
  { email: 'ellen.ripley@example.com', name: 'Ellen Ripley', password: 'password123', wealthTier: 4200000 },
  { email: 'alex.kamal@example.com', name: 'Alex Kamal', password: 'password123', wealthTier: 150000 },
  { email: 'chris.jenjen@example.com', name: 'Chris Jenjen', password: 'password123', wealthTier: 12500000 },
];

async function run() {
  console.log('🚀 Starting Data Migration to Firestore...');
  
  for (const client of CLIENTS) {
    try {
      console.log(`\nProcessing client: ${client.email}`);
      
      // 1. Create or get Auth User
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(client.email);
        console.log(`User already exists: ${userRecord.uid}`);
      } catch (e) {
        userRecord = await auth.createUser({
          email: client.email,
          password: client.password,
          displayName: client.name,
        });
        console.log(`Created new user auth: ${userRecord.uid}`);
      }

      const uid = userRecord.uid;

      // 2. Set Users Document
      await db.collection('users').doc(uid).set({
        email: client.email,
        name: client.name,
        role: 'client',
        createdAt: new Date().toISOString()
      });

      // 3. Create Accounts
      const accountsRef = db.collection('accounts');
      const taxableRef = accountsRef.doc(`${uid}-taxable`);
      const rrpsRef = accountsRef.doc(`${uid}-rrsp`);
      
      const taxableBal = client.wealthTier * 0.6;
      const rrspBal = client.wealthTier * 0.4;

      await taxableRef.set({
        userId: uid,
        name: "Individual Non-Registered (CAD)",
        type: "Taxable",
        balance: taxableBal,
        currency: "CAD"
      });

      await rrpsRef.set({
        userId: uid,
        name: "Registered Retirement Savings Plan",
        type: "Retirement",
        balance: rrspBal,
        currency: "CAD"
      });

      // 4. Create History
      const history = generateHistory(client.wealthTier * 0.6); // start smaller to show growth
      const historyRef = db.collection('history');
      
      // Delete old history first for clean re-runs
      const oldHistory = await historyRef.where('userId', '==', uid).get();
      const batch = db.batch();
      oldHistory.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      // Batch insert new history
      const newBatch = db.batch();
      history.forEach((point, i) => {
        const docRef = historyRef.doc(`${uid}-hist-${i}`);
        newBatch.set(docRef, {
          userId: uid,
          ...point
        });
      });
      await newBatch.commit();
      console.log(`Added ${history.length} months of history for ${client.name}.`);

      // 5. Create basic positions for Taxable account
      const posRef = db.collection('positions');
      const positionsBatch = db.batch();
      
      const samplePositions = [
        { symbol: "VFV.TO", name: "Vanguard S&P 500 ETF", type: "Equity", region: "US", shares: Math.floor((taxableBal * 0.4)/124), price: 124.50 },
        { symbol: "XIC.TO", name: "iShares Core S&P/TSX", type: "Equity", region: "Canada", shares: Math.floor((taxableBal * 0.3)/34), price: 34.10 },
        { symbol: "XBB.TO", name: "iShares Universe Bond", type: "Fixed Income", region: "Canada", shares: Math.floor((taxableBal * 0.3)/28), price: 27.80 },
      ];

      samplePositions.forEach((pos, i) => {
        const docRef = posRef.doc(`${uid}-pos-${i}`);
        positionsBatch.set(docRef, {
          accountId: taxableRef.id,
          userId: uid,
          symbol: pos.symbol,
          name: pos.name,
          type: pos.type,
          region: pos.region,
          shares: pos.shares,
          price: pos.price,
          costBasis: pos.price * 0.85, // 15% unrealized gain assumption
          marketValue: pos.shares * pos.price
        });
      });
      await positionsBatch.commit();
      
      console.log(`✅ Finished setting up database for ${client.name}`);
      await delay(500); // Throttling slightly
      
    } catch (e) {
      console.error(`Error processing ${client.email}: `, e);
    }
  }

  console.log('🎉 All users generated and pushed to Firestore Canada region!');
}

run().catch(console.error);
