import { connect, Connection } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

async function runMigration() {
  console.log('Running migration...');

  const uri = process.env.DATABASE_URI;
  if (!uri) {
    throw new Error('DATABASE_URI is not defined in the environment variables');
  }

  const mongoose = await connect(uri); // Returns a Mongoose instance
  const connection: Connection = mongoose.connection;

  const collectionsToCheck = ['timers', 'users', 'tasks'];

  for (const collectionName of collectionsToCheck) {
    const collectionExists = await connection.db.listCollections({ name: collectionName }).hasNext();

    if (!collectionExists) {
      await connection.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    } else {
      console.log(`Collection already exists: ${collectionName}`);
    }
  }

  console.log('Migration completed.');
  await connection.close();
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
