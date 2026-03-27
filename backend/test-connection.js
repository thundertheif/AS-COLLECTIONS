const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('📍 MONGO_URI:', process.env.MONGO_URI?.replace(/:[^@]+@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000 // 10 second timeout
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection State:', mongoose.connection.readyState);
    
    // Test if we can list collections
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        console.log('📁 Collections found:', collections.map(c => c.name));
        process.exit(0);
      })
      .catch(err => {
        console.warn('⚠️ Could not list collections:', err.message);
        process.exit(0); // Still exit success since connection worked
      });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Possible fixes:');
    console.error('   1. Check password in .env file');
    console.error('   2. Whitelist your IP in MongoDB Atlas → Network Access');
    console.error('   3. Verify cluster URL is correct');
    console.error('   4. Run: npm install mongoose dotenv');
    process.exit(1);
  });