import { useCallback, useState } from 'react';
import type { ErrorMap } from '../types/common';

export type Validator<T> = (values: T) => ErrorMap<T>;

export interface UseFormResult<T> {
  values: T;
  errors: ErrorMap<T>;
  touched: Partial<Record<keyof T, boolean>>;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (onValid: (values: T) => void) => boolean;
  reset: () => void;
  isValid: boolean;
}

export function useForm<T extends object>(
  initialValues: T,
  validate: Validator<T>,
): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ErrorMap<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        setErrors(validate(next));
        return next;
      });
    },
    [validate],
  );

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    (onValid: (values: T) => void): boolean => {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Đánh dấu hết field là touched để hiện đủ lỗi khi bấm submit
      const allTouched = (Object.keys(values) as Array<keyof T>).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>,
      );
      setTouched(allTouched);

      if (Object.keys(validationErrors).length > 0) return false;
      onValid(values);
      return true;
    },
    [validate, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
