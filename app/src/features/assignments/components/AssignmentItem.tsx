import { PRIORITY_CONFIG, isOverdue, isUpcoming } from '../../../types/assignment';
import type { Assignment } from '../../../types/assignment';
import { formatDate, formatDeadlineStatus, getDeadlineStatus } from '../../../utils/date';

interface AssignmentItemProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function AssignmentItem({ assignment, onToggle, onRemove }: AssignmentItemProps) {
  const status = getDeadlineStatus(assignment);
  const priority = PRIORITY_CONFIG[assignment.priority];

  // Mức độ gấp quyết định màu vạch bên trái và màu nhãn
  let tone = 'done';
  if (isOverdue(status)) {
    tone = 'overdue';
  } else if (isUpcoming(status)) {
    if (status.daysLeft === 0) tone = 'today';
    else if (status.daysLeft <= 3) tone = 'soon';
    else tone = 'normal';
  }

  return (
    <li className={`card card--${tone}${assignment.completed ? ' card--completed' : ''}`}>
      <label className="card__check">
        <input
          type="checkbox"
          checked={assignment.completed}
          onChange={() => onToggle(assignment.id)}
          aria-label={
            assignment.completed
              ? `Bỏ đánh dấu hoàn thành: ${assignment.title}`
              : `Đánh dấu hoàn thành: ${assignment.title}`
          }
        />
        <span className="card__box" aria-hidden="true" />
      </label>

      <div className="card__body">
        <h3 className="card__title">{assignment.title}</h3>

        <div className="card__meta">
          <span className="chip chip--subject">{assignment.subject}</span>
          <span className="chip chip--priority" style={{ color: priority.color }}>
            <span className="dot" style={{ backgroundColor: priority.color }} aria-hidden="true" />
            {priority.label}
          </span>
          <span className="chip chip--date">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>

      <div className="card__right">
        <span className={`badge badge--${tone}`}>{formatDeadlineStatus(status)}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onRemove(assignment.id)}
          aria-label={`Xoá bài tập ${assignment.title}`}
          title="Xoá bài tập"
        >
          Xoá
        </button>
      </div>
    </li>
  );
}
