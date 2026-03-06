export interface Student {
    id: number;
    studentId: number;
    firstName: string;
    lastName: string;
    dob: string;
    studentClass: string;
    score: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}