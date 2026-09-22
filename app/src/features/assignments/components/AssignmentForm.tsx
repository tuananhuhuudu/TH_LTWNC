import { useCallback } from 'react';
import { useForm } from '../../../hooks/useForm';
import { PRIORITY_CONFIG, Priority } from '../../../types/assignment';
import type { AssignmentDraft } from '../../../types/assignment';
import type { ErrorMap } from '../../../types/common';
import { daysUntil, toDateInputValue } from '../../../utils/date';

interface AssignmentFormProps {
  onAdd: (draft: AssignmentDraft) => void;
  onDone: () => void;
}

const INITIAL_VALUES: AssignmentDraft = {
  subject: '',
  title: '',
  dueDate: toDateInputValue(),
  priority: Priority.Medium,
};

export default function AssignmentForm({ onAdd, onDone }: AssignmentFormProps) {
  const validate = useCallback((values: AssignmentDraft): ErrorMap<AssignmentDraft> => {
    const errors: ErrorMap<AssignmentDraft> = {};

    if (!values.subject.trim()) {
      errors.subject = 'Vui lòng nhập tên môn học';
    }
    if (!values.title.trim()) {
      errors.title = 'Vui lòng nhập tên bài tập';
    } else if (values.title.trim().length < 3) {
      errors.title = 'Tên bài tập phải có ít nhất 3 ký tự';
    }
    if (!values.dueDate) {
      errors.dueDate = 'Vui lòng chọn hạn nộp';
    } else if (daysUntil(values.dueDate) < 0) {
      errors.dueDate = 'Hạn nộp không được ở trong quá khứ';
    }

    return errors;
  }, []);

  const { values, errors, touched, setFieldValue, handleBlur, handleSubmit, reset } =
    useForm<AssignmentDraft>(INITIAL_VALUES, validate);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitted = handleSubmit((valid) => {
      onAdd({
        ...valid,
        subject: valid.subject.trim(),
        title: valid.title.trim(),
      });
    });
    if (submitted) {
      reset();
      onDone();
    }
  };

  const handleCancel = () => {
    reset();
    onDone();
  };

  // Chỉ báo lỗi sau khi người dùng đã chạm vào field
  const showError = (field: keyof AssignmentDraft): string | undefined =>
    touched[field] ? errors[field] : undefined;

  const fieldClass = (field: keyof AssignmentDraft): string =>
    showError(field) ? 'field field--invalid' : 'field';

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__grid">
        <div className={fieldClass('title')}>
          <label htmlFor="title">Tên bài tập</label>
          <input
            id="title"
            type="text"
            placeholder="VD: Bài thực hành 01"
            value={values.title}
            onChange={(e) => setFieldValue('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            autoFocus
          />
          {showError('title') && <span className="field__error">{showError('title')}</span>}
        </div>

        <div className={fieldClass('subject')}>
          <label htmlFor="subject">Môn học</label>
          <input
            id="subject"
            type="text"
            placeholder="VD: Lập trình Web nâng cao"
            value={values.subject}
            onChange={(e) => setFieldValue('subject', e.target.value)}
            onBlur={() => handleBlur('subject')}
          />
          {showError('subject') && <span className="field__error">{showError('subject')}</span>}
        </div>

        <div className={fieldClass('dueDate')}>
          <label htmlFor="dueDate">Hạn nộp</label>
          <input
            id="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(e) => setFieldValue('dueDate', e.target.value)}
            onBlur={() => handleBlur('dueDate')}
          />
          {showError('dueDate') && <span className="field__error">{showError('dueDate')}</span>}
        </div>

        <div className="field">
          <label htmlFor="priority">Độ ưu tiên</label>
          <select
            id="priority"
            value={values.priority}
            onChange={(e) => setFieldValue('priority', e.target.value as Priority)}
          >
            {Object.values(Priority).map((value) => (
              <option key={value} value={value}>
                {PRIORITY_CONFIG[value].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={handleCancel}>
          Huỷ
        </button>
        <button type="submit" className="btn btn--primary">
          Thêm bài tập
        </button>
      </div>
    </form>
  );
}
