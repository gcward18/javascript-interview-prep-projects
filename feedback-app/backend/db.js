const dbUri = "mongodb://localhost:27017";
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(`${dbUri}/FeedbackDatabase`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected with Mongoose");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    }
;}

module.exports = connectDB;