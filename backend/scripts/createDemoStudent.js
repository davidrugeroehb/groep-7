import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import studentModel from '../models/studentModel.js';

dotenv.config();

const createDemoStudent = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = 'student@test.com';
  const bestaand = await studentModel.findOne({ email });

  if (bestaand) {
    console.log('⚠️ Student bestaat al:', bestaand.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('test123', 10);

  const newStudent = new studentModel({
    name: 'Test Student',
    email: email,
    password: hashedPassword,
    richting: 'Toegepaste Informatica',
    taal: 'Nederlands',
  });

  try {
    await newStudent.save();
    console.log('✅ Demo student aangemaakt:', newStudent.email);
  } catch (err) {
    console.error('⚠️ Fout bij opslaan:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

createDemoStudent();
