export interface User {
    name: string;
    role: 'admin' | 'user';
    passwordHash?: string;
    id?: number;
    email?: string;
    picture?: string;
}