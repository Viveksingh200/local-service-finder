const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://vviveksingh8874_db_user:localservicefinder123@cluster0.lb3kkfv.mongodb.net/?appName=Cluster0";

// Define simple schema to check
const workerSchema = new mongoose.Schema({}, { strict: false });
const Worker = mongoose.models.Worker || mongoose.model('Worker', workerSchema, 'workers');

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected! Counting workers...");
    const count = await Worker.countDocuments({});
    console.log("Total workers in database:", count);
    
    if (count > 0) {
      const workers = await Worker.find({});
      console.log("Worker list:");
      workers.forEach(w => {
        const details = w.toObject();
        console.log(`- Name: ${details.name}, Profession: ${details.profession}, City: ${details.city}, Area: ${details.area}, Approved: ${details.approved}`);
      });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
