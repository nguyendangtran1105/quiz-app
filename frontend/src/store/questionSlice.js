import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errorMessage } from '../api/client';

const wrap = (fn) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
};

export const fetchQuestions = createAsyncThunk('questions/fetch', wrap(async () => (await api.get('/questions')).data));
export const addQuestion = createAsyncThunk('questions/add', wrap(async (q) => (await api.post('/questions', q)).data));
export const updateQuestion = createAsyncThunk(
  'questions/update',
  wrap(async ({ _id, ...q }) => (await api.put(`/questions/${_id}`, q)).data)
);
export const deleteQuestion = createAsyncThunk(
  'questions/delete',
  wrap(async (id) => (await api.delete(`/questions/${id}`)).data._id)
);

const questionSlice = createSlice({
  name: 'questions',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearQuestionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.fulfilled, (state, { payload }) => {
        state.items = payload;
      })
      .addCase(addQuestion.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(updateQuestion.fulfilled, (state, { payload }) => {
        const i = state.items.findIndex((q) => q._id === payload._id);
        if (i !== -1) state.items[i] = payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((q) => q._id !== payload);
      })
      .addCase('auth/logout', () => questionSlice.getInitialState())
      .addMatcher(
        (a) => a.type.startsWith('questions/') && a.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith('questions/') && a.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith('questions/') && a.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearQuestionError } = questionSlice.actions;
export default questionSlice.reducer;
