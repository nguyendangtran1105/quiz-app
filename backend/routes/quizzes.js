const router = require('express').Router();
const { body, param } = require('express-validator');
const Quiz = require('../models/Quiz');
const { verifyUser, verifyAdmin, validate } = require('../middleware/auth');

const idRule = param('id').isMongoId().withMessage('Invalid quiz id');
const quizRules = [
  body('title').trim().notEmpty().withMessage('Quiz title is required'),
  body('questions').optional().isArray().withMessage('Questions must be an array of ids'),
  body('questions.*').optional().isMongoId().withMessage('Each question must be a valid id'),
];

// GET /api/quizzes  (kèm câu hỏi đầy đủ)
router.get('/', verifyUser, async (req, res, next) => {
  try {
    res.json(await Quiz.find().populate('questions').sort({ createdAt: 1 }));
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/:id
router.get('/:id', verifyUser, idRule, validate, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes  (admin)
router.post('/', verifyUser, verifyAdmin, quizRules, validate, async (req, res, next) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = await Quiz.create({ title, description, questions: questions || [] });
    res.status(201).json(await quiz.populate('questions'));
  } catch (err) {
    next(err);
  }
});

// PUT /api/quizzes/:id  (admin)
router.put('/:id', verifyUser, verifyAdmin, idRule, quizRules, validate, async (req, res, next) => {
  try {
    const { title, description, questions } = req.body;
    const update = { title, description };
    if (questions) update.questions = questions;
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate(
      'questions'
    );
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/quizzes/:id  (admin)
router.delete('/:id', verifyUser, verifyAdmin, idRule, validate, async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted', _id: quiz._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
