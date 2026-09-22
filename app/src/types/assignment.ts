import type { HasId } from './common';

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum FilterStatus {
  All = 'all',
  Pending = 'pending',
  Overdue = 'overdue',
  Completed = 'completed',
}

export interface Subject extends HasId {
  id: string;
  name: string;
  code: string;
}

export interface Assignment extends HasId {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

// id, completed, createdAt do hệ thống tự sinh nên form không nhập
export type AssignmentDraft = Omit<Assignment, 'id' | 'completed' | 'createdAt'>;

export type AssignmentUpdate = Partial<Pick<Assignment, 'title' | 'subject' | 'dueDate' | 'priority'>>;

export type AssignmentPreview = Pick<Assignment, 'id' | 'title' | 'dueDate'>;

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  [Priority.Low]: { label: 'Thấp', color: '#2b8a3e' },
  [Priority.Medium]: { label: 'Trung bình', color: '#e8590c' },
  [Priority.High]: { label: 'Cao', color: '#d6336c' },
};

export const FILTER_LABELS: Record<FilterStatus, string> = {
  [FilterStatus.All]: 'Tất cả',
  [FilterStatus.Pending]: 'Chưa hoàn thành',
  [FilterStatus.Overdue]: 'Quá hạn',
  [FilterStatus.Completed]: 'Đã hoàn thành',
};

export interface CompletedStatus {
  kind: 'completed';
}

export interface UpcomingStatus {
  kind: 'upcoming';
  daysLeft: number;
}

export interface OverdueStatus {
  kind: 'overdue';
  daysOverdue: number;
}

export type DeadlineStatus = CompletedStatus | UpcomingStatus | OverdueStatus;

export function isOverdue(status: DeadlineStatus): status is OverdueStatus {
  return status.kind === 'overdue';
}

export function isUpcoming(status: DeadlineStatus): status is UpcomingStatus {
  return status.kind === 'upcoming';
}

export function isCompleted(status: DeadlineStatus): status is CompletedStatus {
  return status.kind === 'completed';
}

// Dữ liệu API không kiểm soát được lúc biên dịch nên phải kiểm tra khi chạy
export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.subject === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.dueDate === 'string' &&
    typeof obj.completed === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    isPriority(obj.priority)
  );
}

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && Object.values(Priority).includes(value as Priority);
}
