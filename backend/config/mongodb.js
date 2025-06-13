import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log("✅ Database verbonden"));

  await mongoose.connect(`${process.env.MONGODB_URI}/career-match`);
};

export default connectDB;