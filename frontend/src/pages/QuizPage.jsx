import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes, startQuiz, answerQuestion, restartQuiz, exitQuiz } from '../store/quizSlice';

export default function QuizPage() {
  const dispatch = useDispatch();
  const { quizzes, loading, error, activeQuizId, currentIndex, score, finished } = useSelector((s) => s.quiz);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  // Chỉ có 1 quiz thì vào làm luôn
  useEffect(() => {
    if (!activeQuizId && quizzes.length === 1) dispatch(startQuiz(quizzes[0]._id));
  }, [quizzes, activeQuizId, dispatch]);

  if (loading && !quizzes.length) return <p className="text-center">Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!quizzes.length) return <p className="text-center text-muted">No quizzes available.</p>;

  const quiz = quizzes.find((q) => q._id === activeQuizId);

  // Nhiều quiz: cho chọn
  if (!quiz) {
    return (
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        <h2 className="text-center mb-4">Choose a Quiz</h2>
        <div className="list-group">
          {quizzes.map((q) => (
            <button
              key={q._id}
              className="list-group-item list-group-item-action d-flex justify-content-between"
              onClick={() => dispatch(startQuiz(q._id))}
            >
              <span>{q.title}</span>
              <span className="badge text-bg-primary rounded-pill">{q.questions.length} questions</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const total = quiz.questions.length;

  if (!total) return <p className="text-center text-muted">This quiz has no questions yet.</p>;

  if (finished) {
    return (
      <div className="text-center">
        <h2 className="mb-2">Quiz Completed</h2>
        <p className="fs-5">Your score: {score}</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            setSelected(null);
            dispatch(restartQuiz());
          }}
        >
          Restart Quiz
        </button>
        {quizzes.length > 1 && (
          <button className="btn btn-outline-secondary btn-lg ms-2" onClick={() => dispatch(exitQuiz())}>
            Other Quizzes
          </button>
        )}
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  if (!question) return null;

  const handleSubmit = () => {
    if (selected === null) return;
    dispatch(answerQuestion({ isCorrect: selected === question.correctAnswerIndex, total }));
    setSelected(null);
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 640 }}>
      <h2 className="text-center">Quiz</h2>
      <p className="text-muted mb-1">
        Question {currentIndex + 1} / {total}
      </p>
      <h3 className="mb-3">{question.text}</h3>
      {question.options.map((opt, i) => (
        <div className="form-check fs-5" key={i}>
          <input
            className="form-check-input"
            type="radio"
            name="option"
            id={`opt-${i}`}
            checked={selected === i}
            onChange={() => setSelected(i)}
          />
          <label className="form-check-label" htmlFor={`opt-${i}`}>
            {opt}
          </label>
        </div>
      ))}
      <button className="btn btn-primary btn-lg mt-4" onClick={handleSubmit} disabled={selected === null}>
        Submit Answer
      </button>
    </div>
  );
}
