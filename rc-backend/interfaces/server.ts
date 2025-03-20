import { Item } from "./item";

export interface Server {
    id?: number; // Опционально, так как ID будет генерироваться автоматически
    name?: string;
    slogan?: string;
    banner?: string;
    address: string; // Обязательное поле
    port?: number;
    online?: number;
    state?: string;
    description?: string;
    rating?: number;
    ownerId?: string;
    createDate?: Date;
    version?: Item;
    site?: string;
    vk?: string;
    discord?: string;
    videoUrl?: string;
    launcher?: string;
    screenshots?: string[];
    borderColor?: string;
    bases?: Item[];
    mods?: Item[];
    plugins?: Item[];
    miniGames?: Item[];
    onlinePlayers?: number;
    maxPlayers?: number;
}