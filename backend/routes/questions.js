const router = require('express').Router();
const { body, param } = require('express-validator');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { verifyUser, verifyAdmin, validate } = require('../middleware/auth');

const idRule = param('id').isMongoId().withMessage('Invalid question id');
const questionRules = [
  body('text').trim().notEmpty().withMessage('Question text is required'),
  body('options').isArray({ min: 2 }).withMessage('Options must be an array with at least 2 items'),
  body('options.*').trim().notEmpty().withMessage('Options cannot be empty'),
  body('correctAnswerIndex').isInt({ min: 0 }).withMessage('Correct answer index must be a number >= 0').toInt(),
  body('correctAnswerIndex').custom((v, { req }) => {
    if (Array.isArray(req.body.options) && v >= req.body.options.length) {
      throw new Error('Correct answer index must point to one of the options');
    }
    return true;
  }),
];

// GET /api/questions  (mọi user đã đăng nhập)
router.get('/', verifyUser, async (req, res, next) => {
  try {
    res.json(await Question.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// GET /api/questions/:id
router.get('/:id', verifyUser, idRule, validate, async (req, res, next) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json(q);
  } catch (err) {
    next(err);
  }
});

// POST /api/questions  (admin) — body có thể kèm quizId để gắn vào quiz
router.post('/', verifyUser, verifyAdmin, questionRules, validate, async (req, res, next) => {
  try {
    const { text, options, correctAnswerIndex, quizId } = req.body;
    const q = await Question.create({ text, options, correctAnswerIndex });
    const quiz = quizId ? await Quiz.findById(quizId) : await Quiz.findOne().sort({ createdAt: 1 });
    if (quiz) {
      quiz.questions.push(q._id);
      await quiz.save();
    }
    res.status(201).json(q);
  } catch (err) {
    next(err);
  }
});

// PUT /api/questions/:id  (admin)
router.put('/:id', verifyUser, verifyAdmin, idRule, questionRules, validate, async (req, res, next) => {
  try {
    const { text, options, correctAnswerIndex } = req.body;
    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { text, options, correctAnswerIndex },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json(q);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/questions/:id  (admin) — đồng thời gỡ khỏi các quiz
router.delete('/:id', verifyUser, verifyAdmin, idRule, validate, async (req, res, next) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    await Quiz.updateMany({ questions: q._id }, { $pull: { questions: q._id } });
    res.json({ message: 'Question deleted', _id: q._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
