export interface HasId {
  id: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type ErrorMap<T> = {
  [P in keyof T]?: string;
};

export type ElementOf<T> = T extends (infer U)[] ? U : never;

export type UnwrapApi<T> = T extends ApiResponse<infer D> ? D : never;

export function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
