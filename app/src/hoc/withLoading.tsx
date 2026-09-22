import type { ComponentType } from 'react';

export interface WithLoadingProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  loadingMessage = 'Đang tải dữ liệu...',
) {
  function ComponentWithLoading(props: P & WithLoadingProps) {
    const { loading, error, onRetry, ...restProps } = props;

    if (loading) {
      return (
        <div className="skeletons" role="status" aria-live="polite">
          <span className="sr-only">{loadingMessage}</span>
          {[0, 1, 2].map((i) => (
            <div className="skeleton" key={i}>
              <div className="skeleton__box" />
              <div className="skeleton__lines">
                <div className="skeleton__line skeleton__line--title" />
                <div className="skeleton__line skeleton__line--meta" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="notice notice--error" role="alert">
          <p className="notice__title">Không tải được dữ liệu</p>
          <p className="notice__text">{error}</p>
          {onRetry && (
            <button type="button" className="btn btn--primary" onClick={onRetry}>
              Thử lại
            </button>
          )}
        </div>
      );
    }

    return <WrappedComponent {...(restProps as unknown as P)} />;
  }

  const name = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';
  ComponentWithLoading.displayName = `withLoading(${name})`;

  return ComponentWithLoading;
}
