export interface News {
    id: number;
    date: string;
    title: string;
    content: string;
}

// API DTOs
export interface NewsCreateDto {
    date: string
    title: string
    content: string
}

export interface NewsUpdateDto {
    date: string
    title: string
    content: string
}