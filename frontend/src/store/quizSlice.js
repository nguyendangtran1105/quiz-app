import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errorMessage } from '../api/client';

export const fetchQuizzes = createAsyncThunk('quiz/fetchQuizzes', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/quizzes');
    return data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizzes: [],
    loading: false,
    error: null,
    // Trạng thái lượt làm bài hiện tại
    activeQuizId: null,
    currentIndex: 0,
    score: 0,
    finished: false,
  },
  reducers: {
    startQuiz(state, { payload }) {
      state.activeQuizId = payload;
      state.currentIndex = 0;
      state.score = 0;
      state.finished = false;
    },
    answerQuestion(state, { payload }) {
      // payload: { isCorrect, total }
      if (payload.isCorrect) state.score += 1;
      if (state.currentIndex + 1 >= payload.total) state.finished = true;
      else state.currentIndex += 1;
    },
    restartQuiz(state) {
      state.currentIndex = 0;
      state.score = 0;
      state.finished = false;
    },
    exitQuiz(state) {
      state.activeQuizId = null;
      state.currentIndex = 0;
      state.score = 0;
      state.finished = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.quizzes = payload;
        // Nếu admin vừa xóa bớt câu hỏi thì làm lại từ đầu cho an toàn
        const active = payload.find((q) => q._id === state.activeQuizId);
        if (state.activeQuizId && (!active || state.currentIndex >= active.questions.length)) {
          state.currentIndex = 0;
          state.score = 0;
          state.finished = false;
          if (!active) state.activeQuizId = null;
        }
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('auth/logout', () => quizSlice.getInitialState());
  },
});

export const { startQuiz, answerQuestion, restartQuiz, exitQuiz } = quizSlice.actions;
export default quizSlice.reducer;
