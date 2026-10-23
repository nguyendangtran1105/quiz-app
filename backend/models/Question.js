const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: [true, 'Question text is required'], trim: true },
    options: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2 && arr.every((o) => o && o.trim()),
        message: 'A question needs at least 2 non-empty options',
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      validate: {
        validator: function (v) {
          // Khi update (this là Query) thì lấy options từ dữ liệu update
          const options = this instanceof mongoose.Query ? this.getUpdate().options : this.options;
          return Number.isInteger(v) && v >= 0 && (!options || v < options.length);
        },
        message: 'Correct answer index must point to one of the options',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
