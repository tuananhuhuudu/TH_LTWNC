import type { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (import.meta.env.DEV && typeof action === 'object' && action !== null && 'type' in action) {
    const { type } = action as { type: string };
    console.groupCollapsed(`[redux] ${type}`);
    console.log('payload:', (action as { payload?: unknown }).payload);
    const result = next(action);
    console.log('state sau action:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};
