export interface Filter {
    search?: string | null;
    versions?: Item[] | null;
    bases?: Item[] | null;
    mods?: Item[] | null;
    plugins?: Item[] | null;
    miniGames?: Item[] | null;
    page?: number | null;
    pageSize?: number | null;
}

export interface Item {
    id: number;
    value: string;
    protocol?: number;
    active?: boolean;
}