export interface Transaction {
    id: string;
    userId: string;
    serverId: string;
    serverName: string;
    amount: number;
    ratingAdded: number;
    paymentMethod: string;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
}