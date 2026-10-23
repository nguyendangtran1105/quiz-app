// Tạo dữ liệu mẫu: 2 tài khoản + 1 quiz gồm 5 câu hỏi. Chạy: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');

const questions = [
  { text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswerIndex: 0 },
  { text: 'What is the capital of England?', options: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswerIndex: 1 },
  { text: 'What is the capital of Germany?', options: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswerIndex: 2 },
  { text: 'What is the symbol for iron on the periodic table?', options: ['Fe', 'I', 'Au', 'Ag'], correctAnswerIndex: 0 },
  {
    text: 'Who developed the theory of relativity?',
    options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'],
    correctAnswerIndex: 0,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // "npm run seed:if-empty": chỉ tạo dữ liệu khi database chưa có user (dùng cho Render)
    if (process.argv.includes('--if-empty') && (await User.countDocuments()) > 0) {
      console.log('Database already has data, skip seeding');
      return;
    }

    await Promise.all([User.deleteMany({}), Question.deleteMany({}), Quiz.deleteMany({})]);

    const hash = await bcrypt.hash('123', 10);
    await User.create([
      { username: 'Mary', password: hash, admin: true },
      { username: 'John', password: hash, admin: false },
    ]);

    const created = [];
    for (const q of questions) created.push(await Question.create(q));
    await Quiz.create({ title: 'General Knowledge', description: 'Basic quiz', questions: created.map((q) => q._id) });

    console.log('Seed done: admin Mary/123, user John/123, 1 quiz, 5 questions');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
