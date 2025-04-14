export interface Transaction {
    id: string;
    userId: string;
    serverId: string;
    amount: number;
    ratingAdded: number;
    paymentMethod: string;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
}