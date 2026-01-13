const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dropIndex = async () => {
      try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected');

            const collection = mongoose.connection.collection('partners');

            // Check if index exists and drop it
            try {
                  await collection.dropIndex('user_1');
                  console.log('✅ Index "user_1" dropped successfully.');
            } catch (err) {
                  if (err.code === 27) {
                        console.log('ℹ️ Index "user_1" not found (already dropped).');
                  } else {
                        console.error('❌ Error dropping index:', err.message);
                  }
            }

            process.exit();
      } catch (error) {
            console.error(error);
            process.exit(1);
      }
};

dropIndex();
