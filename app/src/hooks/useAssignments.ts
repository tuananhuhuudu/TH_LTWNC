import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  addAssignment,
  fetchAssignments,
  removeAssignment,
  setFilter,
  toggleCompleted,
  updateAssignment,
  selectError,
  selectFilter,
  selectFilteredAssignments,
  selectStats,
  selectStatus,
} from '../features/assignments/assignmentsSlice';
import type { AssignmentStats, LoadingStatus } from '../features/assignments/assignmentsSlice';
import type { Assignment, AssignmentDraft, AssignmentUpdate, FilterStatus } from '../types/assignment';

export interface UseAssignmentsResult {
  assignments: Assignment[];
  stats: AssignmentStats;
  filter: FilterStatus;
  status: LoadingStatus;
  error: string | null;
  loading: boolean;
  add: (draft: AssignmentDraft) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  update: (id: string, changes: AssignmentUpdate) => void;
  changeFilter: (filter: FilterStatus) => void;
  reload: () => void;
}

export function useAssignments(): UseAssignmentsResult {
  const dispatch = useAppDispatch();

  const assignments = useAppSelector(selectFilteredAssignments);
  const stats = useAppSelector(selectStats);
  const filter = useAppSelector(selectFilter);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  // Chỉ gọi khi idle để không fetch lại mỗi lần component mount
  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchAssignments());
    }
  }, [dispatch, status]);

  const add = useCallback(
    (draft: AssignmentDraft) => {
      dispatch(addAssignment(draft));
    },
    [dispatch],
  );

  const toggle = useCallback(
    (id: string) => {
      dispatch(toggleCompleted(id));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: string) => {
      dispatch(removeAssignment(id));
    },
    [dispatch],
  );

  const update = useCallback(
    (id: string, changes: AssignmentUpdate) => {
      dispatch(updateAssignment({ id, changes }));
    },
    [dispatch],
  );

  const changeFilter = useCallback(
    (next: FilterStatus) => {
      dispatch(setFilter(next));
    },
    [dispatch],
  );

  const reload = useCallback(() => {
    void dispatch(fetchAssignments());
  }, [dispatch]);

  return {
    assignments,
    stats,
    filter,
    status,
    error,
    loading: status === 'loading',
    add,
    toggle,
    remove,
    update,
    changeFilter,
    reload,
  };
}
