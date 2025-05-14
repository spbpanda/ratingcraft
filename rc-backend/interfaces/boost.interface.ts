export interface BoostRequest {
    serverId: string;
    amount: number; // Количество "рейтинг-очков"
    paymentMethod: string; // 'card', 'crypto', 'balance' и т.д.
}