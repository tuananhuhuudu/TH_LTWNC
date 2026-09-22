import { useState } from 'react';
import AssignmentForm from './features/assignments/components/AssignmentForm';
import AssignmentList from './features/assignments/components/AssignmentList';
import FilterTabs from './components/FilterTabs';
import { useAssignments } from './hooks/useAssignments';
import { FILTER_LABELS, FilterStatus } from './types/assignment';

export default function App() {
  const { assignments, stats, filter, error, loading, add, toggle, remove, changeFilter, reload } =
    useAssignments();

  const [formOpen, setFormOpen] = useState(false);

  const countOf = (status: FilterStatus): number => {
    switch (status) {
      case FilterStatus.All:
        return stats.total;
      case FilterStatus.Pending:
        return stats.pending;
      case FilterStatus.Overdue:
        return stats.overdue;
      case FilterStatus.Completed:
        return stats.completed;
      default:
        return 0;
    }
  };

  const percent = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  const summary = (): string => {
    if (loading) return 'Đang tải dữ liệu...';
    if (stats.total === 0) return 'Chưa có bài tập nào được theo dõi.';
    if (stats.overdue > 0) return `Bạn đang có ${stats.overdue} bài quá hạn cần xử lý gấp.`;
    if (stats.pending === 0) return 'Tuyệt vời, bạn đã hoàn thành tất cả bài tập.';
    return `Bạn còn ${stats.pending} bài tập chưa nộp.`;
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__text">
          <h1 className="header__title">Student Deadline Tracker</h1>
          <p className="header__summary">{summary()}</p>
        </div>

        <div className="header__actions">
          <button type="button" className="btn btn--ghost" onClick={reload} disabled={loading}>
            Tải lại
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setFormOpen((open) => !open)}
            aria-expanded={formOpen}
          >
            {formOpen ? 'Đóng' : 'Thêm bài tập'}
          </button>
        </div>
      </header>

      {/* Thanh tiến độ — nhìn phát biết ngay đã xong bao nhiêu phần */}
      <section className="progress" aria-label="Tiến độ hoàn thành">
        <div className="progress__head">
          <span className="progress__label">Tiến độ</span>
          <span className="progress__value">
            {stats.completed}/{stats.total} bài · {percent}%
          </span>
        </div>
        <div
          className="progress__track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress__bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="progress__notes">
          <span className="note note--overdue">{stats.overdue} quá hạn</span>
          <span className="note note--pending">{stats.pending} chưa xong</span>
          <span className="note note--done">{stats.completed} đã xong</span>
        </div>
      </section>

      {/* Yêu cầu 2 — form thêm bài tập, thu gọn được cho đỡ chiếm chỗ */}
      {formOpen && <AssignmentForm onAdd={add} onDone={() => setFormOpen(false)} />}

      {/* Yêu cầu 5 — lọc theo trạng thái, dùng COMPOUND COMPONENT */}
      <FilterTabs value={filter} onChange={changeFilter}>
        <FilterTabs.List>
          {Object.values(FilterStatus).map((status) => (
            <FilterTabs.Tab key={status} value={status} count={countOf(status)}>
              {FILTER_LABELS[status]}
            </FilterTabs.Tab>
          ))}
        </FilterTabs.List>
      </FilterTabs>

      {/*
        Yêu cầu 1 — danh sách bài tập.
        AssignmentList đã được bọc bởi HOC withLoading nên nhận thêm
        3 props: loading, error, onRetry.
      */}
      <AssignmentList
        assignments={assignments}
        onToggle={toggle}
        onRemove={remove}
        loading={loading}
        error={error}
        onRetry={reload}
      />

      <footer className="footer">
        <p>Bài thực hành 01 — Lập trình Web nâng cao (N2)</p>
      </footer>
    </div>
  );
}
