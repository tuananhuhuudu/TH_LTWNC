import { useMemo, useState } from 'react';
import AssignmentItem from './AssignmentItem';
import { withLoading } from '../../../hoc/withLoading';
import type { Assignment } from '../../../types/assignment';
import { GROUP_LABELS, GROUP_ORDER, getGroupKey } from '../../../utils/date';
import type { DeadlineGroupKey } from '../../../utils/date';

interface AssignmentListProps {
  assignments: Assignment[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

function AssignmentList({ assignments, onToggle, onRemove }: AssignmentListProps) {
  const [collapsed, setCollapsed] = useState<Set<DeadlineGroupKey>>(new Set());

  const groups = useMemo(() => {
    const result = new Map<DeadlineGroupKey, Assignment[]>();
    for (const assignment of assignments) {
      const key = getGroupKey(assignment);
      const bucket = result.get(key);
      if (bucket) {
        bucket.push(assignment);
      } else {
        result.set(key, [assignment]);
      }
    }
    return result;
  }, [assignments]);

  const toggleGroup = (key: DeadlineGroupKey) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (assignments.length === 0) {
    return (
      <div className="empty">
        <div className="empty__mark" aria-hidden="true" />
        <p className="empty__title">Không có bài tập nào</p>
        <p className="empty__hint">Thử chọn bộ lọc khác, hoặc thêm bài tập mới ở trên.</p>
      </div>
    );
  }

  return (
    <div className="groups">
      {GROUP_ORDER.map((key) => {
        const items = groups.get(key);
        if (!items || items.length === 0) return null;

        const isCollapsed = collapsed.has(key);

        return (
          <section key={key} className={`group group--${key}`}>
            <button
              type="button"
              className="group__head"
              onClick={() => toggleGroup(key)}
              aria-expanded={!isCollapsed}
            >
              <span
                className={isCollapsed ? 'group__caret' : 'group__caret group__caret--open'}
                aria-hidden="true"
              />
              <span className="group__label">{GROUP_LABELS[key]}</span>
              <span className="group__count">{items.length}</span>
            </button>

            {!isCollapsed && (
              <ul className="list">
                {items.map((assignment) => (
                  <AssignmentItem
                    key={assignment.id}
                    assignment={assignment}
                    onToggle={onToggle}
                    onRemove={onRemove}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default withLoading(AssignmentList, 'Đang tải danh sách bài tập từ API...');
