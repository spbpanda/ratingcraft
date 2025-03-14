import { Item } from "./item";

export interface Server {
    id: number; // Assuming you'll need to define id as a number
    name: string;
    slogan: string;
    banner: string;
    address: string;
    port: number;
    online: number;
    state: string;
    description: string;
    rating: number;
    ownerId: string;
    createDate: Date; // Assuming this is a JavaScript Date object
    version: Item;
    site: string;
    vk: string;
    discord: string;
    videoUrl: string;
    launcher: string;
    screenshots: string[];
    borderColor: string;
    bases: Item[];
    mods: Item[];
    plugins: Item[];
    miniGames: Item[];
}