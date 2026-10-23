import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  clearQuestionError,
} from '../store/questionSlice';

const emptyForm = { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 };

export default function ManageQuestions() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.questions);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchQuestions());
    return () => dispatch(clearQuestionError());
  }, [dispatch]);

  const setOption = (i, value) => {
    const options = [...form.options];
    options[i] = value;
    setForm({ ...form, options });
  };

  const validate = () => {
    if (!form.text.trim()) return 'Question text is required';
    if (form.options.some((o) => !o.trim())) return 'All 4 options are required';
    const idx = Number(form.correctAnswerIndex);
    if (!Number.isInteger(idx) || idx < 0 || idx > 3) return 'Correct answer index must be 0, 1, 2 or 3';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    setFormError(msg);
    if (msg) return;
    const payload = { ...form, correctAnswerIndex: Number(form.correctAnswerIndex) };
    const action = editingId ? updateQuestion({ _id: editingId, ...payload }) : addQuestion(payload);
    const result = await dispatch(action);
    if (!result.error) {
      setForm(emptyForm);
      setEditingId(null);
    }
  };

  const startEdit = (q) => {
    setEditingId(q._id);
    setFormError('');
    setForm({
      text: q.text,
      options: [0, 1, 2, 3].map((i) => q.options[i] || ''),
      correctAnswerIndex: q.correctAnswerIndex,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleDelete = (q) => {
    if (window.confirm(`Delete "${q.text}"?`)) dispatch(deleteQuestion(q._id));
  };

  return (
    <div className="px-md-3">
      <h2 className="mb-3">Questions</h2>

      <form className="card card-body mb-4" onSubmit={handleSubmit} noValidate>
        {(formError || error) && <div className="alert alert-danger py-2">{formError || error}</div>}
        <div className="row mb-3">
          <label className="col-md-2 col-form-label" htmlFor="qtext">Question Text:</label>
          <div className="col-md-10">
            <input
              id="qtext"
              className="form-control"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-md-2 col-form-label">Options:</label>
          <div className="col-md-10">
            {form.options.map((opt, i) => (
              <input
                key={i}
                className="form-control mb-2"
                aria-label={`Option ${i}`}
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-md-2 col-form-label" htmlFor="qidx">Correct Answer Index:</label>
          <div className="col-md-10">
            <input
              id="qidx"
              type="number"
              min="0"
              max="3"
              className="form-control"
              value={form.correctAnswerIndex}
              onChange={(e) => setForm({ ...form, correctAnswerIndex: e.target.value })}
            />
          </div>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
            {editingId ? 'Update Question' : 'Add Question'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-group">
        {items.map((q) => (
          <div className="list-group-item p-4" key={q._id}>
            <h4>{q.text}</h4>
            <ul>
              {q.options.map((o, i) => (
                <li key={i} className={i === q.correctAnswerIndex ? 'fw-semibold text-success' : ''}>
                  {o}
                </li>
              ))}
            </ul>
            <div className="btn-group">
              <button className="btn btn-warning" onClick={() => startEdit(q)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(q)}>Delete</button>
            </div>
          </div>
        ))}
        {!items.length && !loading && <p className="text-muted">No questions yet.</p>}
      </div>
    </div>
  );
}
