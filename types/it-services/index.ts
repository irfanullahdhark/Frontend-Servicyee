export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}


export interface Response<T> {
    success: boolean;
    error?: string | null;
    data?: PaginatedResponse<T>;
}