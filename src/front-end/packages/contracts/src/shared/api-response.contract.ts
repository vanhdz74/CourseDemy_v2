export interface ApiResponse<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T | null;
  errors?: unknown | null;
  timestamp?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
