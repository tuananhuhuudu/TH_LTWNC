import { Priority, isAssignment } from '../types/assignment';
import type { Assignment } from '../types/assignment';
import type { ApiResponse, Paginated } from '../types/common';
import { toDateInputValue } from '../utils/date';

function dayOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toDateInputValue(d);
}

// Để unknown[] để mô phỏng dữ liệu thật từ server, phải lọc bằng type guard
const RAW_ASSIGNMENTS: unknown[] = [
  {
    id: 'as-001',
    subject: 'Lập trình Web nâng cao',
    title: 'Bài thực hành 01 — Student Deadline Tracker',
    dueDate: dayOffset(3),
    priority: Priority.High,
    completed: false,
    createdAt: dayOffset(-4),
  },
  {
    id: 'as-002',
    subject: 'Cơ sở dữ liệu phân tán',
    title: 'Báo cáo chương 2: Phân mảnh dữ liệu',
    dueDate: dayOffset(7),
    priority: Priority.Medium,
    completed: false,
    createdAt: dayOffset(-2),
  },
  {
    id: 'as-003',
    subject: 'Trí tuệ nhân tạo',
    title: 'Cài đặt thuật toán A* cho bài toán 8-puzzle',
    dueDate: dayOffset(-2),
    priority: Priority.High,
    completed: false,
    createdAt: dayOffset(-10),
  },
  {
    id: 'as-004',
    subject: 'Nhập môn Công nghệ phần mềm',
    title: 'Vẽ sơ đồ Use Case cho hệ thống quản lý thư viện',
    dueDate: dayOffset(-5),
    priority: Priority.Low,
    completed: true,
    createdAt: dayOffset(-12),
  },
  {
    id: 'as-005',
    subject: 'Tiếng Anh chuyên ngành',
    title: 'Thuyết trình nhóm: Cloud Computing Trends',
    dueDate: dayOffset(1),
    priority: Priority.Medium,
    completed: false,
    createdAt: dayOffset(-6),
  },
  {
    id: 'as-006',
    subject: 'Lập trình Web nâng cao',
    title: 'Bài tập về nhà Buổi 2 — Accordion & usePagination',
    dueDate: dayOffset(0),
    priority: Priority.High,
    completed: false,
    createdAt: dayOffset(-3),
  },
  {
    id: 'as-007',
    subject: 'Mạng máy tính',
    title: 'Bài tập chương 3: Định tuyến IP',
    dueDate: dayOffset(12),
    priority: Priority.Low,
    completed: true,
    createdAt: dayOffset(-8),
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAssignmentsApi(): Promise<ApiResponse<Paginated<Assignment>>> {
  await delay(800);

  const items: Assignment[] = RAW_ASSIGNMENTS.filter(isAssignment);

  return {
    statusCode: 200,
    message: 'Lấy danh sách bài tập thành công',
    data: {
      items,
      page: 1,
      pageSize: items.length,
      total: items.length,
    },
  };
}
