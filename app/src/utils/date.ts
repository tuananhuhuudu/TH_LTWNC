import type { Assignment, DeadlineStatus } from '../types/assignment';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Số ngày còn lại, âm là đã quá hạn
export function daysUntil(dueDate: string, now: Date = new Date()): number {
  const due = startOfDay(new Date(dueDate)).getTime();
  const today = startOfDay(now).getTime();
  return Math.round((due - today) / MS_PER_DAY);
}

export function getDeadlineStatus(assignment: Assignment, now: Date = new Date()): DeadlineStatus {
  if (assignment.completed) {
    return { kind: 'completed' };
  }
  const diff = daysUntil(assignment.dueDate, now);
  if (diff < 0) {
    return { kind: 'overdue', daysOverdue: Math.abs(diff) };
  }
  return { kind: 'upcoming', daysLeft: diff };
}

export function formatDeadlineStatus(status: DeadlineStatus): string {
  switch (status.kind) {
    case 'completed':
      return 'Đã hoàn thành';
    case 'overdue':
      return `Quá hạn ${status.daysOverdue} ngày`;
    case 'upcoming':
      if (status.daysLeft === 0) return 'Hạn hôm nay';
      if (status.daysLeft === 1) return 'Còn 1 ngày';
      return `Còn ${status.daysLeft} ngày`;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function formatDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function toDateInputValue(date: Date = new Date()): string {
  const d = startOfDay(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export type DeadlineGroupKey = 'overdue' | 'today' | 'thisWeek' | 'later' | 'completed';

export const GROUP_ORDER: readonly DeadlineGroupKey[] = [
  'overdue',
  'today',
  'thisWeek',
  'later',
  'completed',
] as const;

export const GROUP_LABELS: Record<DeadlineGroupKey, string> = {
  overdue: 'Quá hạn',
  today: 'Hôm nay',
  thisWeek: 'Trong 7 ngày tới',
  later: 'Sau đó',
  completed: 'Đã hoàn thành',
};

export function getGroupKey(assignment: Assignment, now: Date = new Date()): DeadlineGroupKey {
  const status = getDeadlineStatus(assignment, now);
  switch (status.kind) {
    case 'completed':
      return 'completed';
    case 'overdue':
      return 'overdue';
    case 'upcoming':
      if (status.daysLeft === 0) return 'today';
      return status.daysLeft <= 7 ? 'thisWeek' : 'later';
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
