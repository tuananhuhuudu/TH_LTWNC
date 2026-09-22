import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAssignmentsApi } from '../../api/mockApi';
import { FilterStatus, Priority } from '../../types/assignment';
import type { Assignment, AssignmentDraft, AssignmentUpdate } from '../../types/assignment';
import { getDeadlineStatus, daysUntil } from '../../utils/date';
import type { RootState } from '../../app/store';

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AssignmentsState {
  items: Assignment[];
  status: LoadingStatus;
  error: string | null;
  filter: FilterStatus;
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: FilterStatus.All,
};

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/fetchAll', async (_arg, { rejectWithValue }) => {
  try {
    const response = await fetchAssignmentsApi();
    if (response.statusCode !== 200) {
      return rejectWithValue(response.message);
    }
    return response.data.items;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không tải được danh sách bài tập';
    return rejectWithValue(message);
  }
});

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment(state, action: PayloadAction<AssignmentDraft>) {
      const newAssignment: Assignment = {
        ...action.payload,
        id: nanoid(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newAssignment);
    },

    toggleCompleted(state, action: PayloadAction<string>) {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.completed = !target.completed;
      }
    },

    removeAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateAssignment(state, action: PayloadAction<{ id: string; changes: AssignmentUpdate }>) {
      const target = state.items.find((item) => item.id === action.payload.id);
      if (target) {
        Object.assign(target, action.payload.changes);
      }
    },

    setFilter(state, action: PayloadAction<FilterStatus>) {
      state.filter = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã có lỗi xảy ra';
      });
  },
});

export const {
  addAssignment,
  toggleCompleted,
  removeAssignment,
  updateAssignment,
  setFilter,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;

export const selectAllAssignments = (state: RootState): Assignment[] => state.assignments.items;
export const selectStatus = (state: RootState): LoadingStatus => state.assignments.status;
export const selectError = (state: RootState): string | null => state.assignments.error;
export const selectFilter = (state: RootState): FilterStatus => state.assignments.filter;

const PRIORITY_WEIGHT: Record<Priority, number> = {
  [Priority.High]: 0,
  [Priority.Medium]: 1,
  [Priority.Low]: 2,
};

export const selectFilteredAssignments = createSelector(
  [selectAllAssignments, selectFilter],
  (items, filter): Assignment[] => {
    const filtered = items.filter((item) => {
      const status = getDeadlineStatus(item);
      switch (filter) {
        case FilterStatus.All:
          return true;
        case FilterStatus.Completed:
          return item.completed;
        case FilterStatus.Pending:
          return !item.completed;
        case FilterStatus.Overdue:
          return status.kind === 'overdue';
        default:
          return true;
      }
    });

    // Chưa xong lên trước, rồi tới hạn gần nhất, cuối cùng mới xét độ ưu tiên
    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dayDiff = daysUntil(a.dueDate) - daysUntil(b.dueDate);
      if (dayDiff !== 0) return dayDiff;
      return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    });
  },
);

export interface AssignmentStats {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
}

export const selectStats = createSelector(
  [selectAllAssignments],
  (items): AssignmentStats => ({
    total: items.length,
    pending: items.filter((item) => !item.completed).length,
    overdue: items.filter((item) => getDeadlineStatus(item).kind === 'overdue').length,
    completed: items.filter((item) => item.completed).length,
  }),
);
