export interface News {
    id: number;
    date: string;
    title: string;
    content: string;
}

export type NewsCreate = Omit<News, 'id'>