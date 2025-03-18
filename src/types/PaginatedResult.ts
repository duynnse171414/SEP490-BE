export interface PaginatedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
    message?: string;
}
