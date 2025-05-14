import { Server } from '../interfaces/server.interface';

export const filterServers = (servers: Server[], criteria: {
  search?: string;
  versions?: number[];
  bases?: number[];
  mods?: number[];
  plugins?: number[];
  miniGames?: number[];
}) => {
  return servers.filter(server => {
    const nameMatch = criteria.search ? 
      server.name?.toLowerCase().includes(criteria.search.toLowerCase()) || 
      server.address.toLowerCase().includes(criteria.search.toLowerCase()) : true;

    const versionsMatch = criteria.versions && server.versions && server.versions.length > 0 ?
      criteria.versions.every(id => server.versions!.some(v => v.id === id)) : true;

    const basesMatch = criteria.bases && server.bases && server.bases.length > 0 ?
      criteria.bases.every(id => server.bases!.some(b => b.id === id)) : true;

    const modsMatch = criteria.mods && server.mods && server.mods.length > 0 ?
      criteria.mods.every(id => server.mods!.some(m => m.id === id)) : true;

    const pluginsMatch = criteria.plugins && server.plugins && server.plugins.length > 0 ?
      criteria.plugins.every(id => server.plugins!.some(p => p.id === id)) : true;

    const miniGamesMatch = criteria.miniGames && server.miniGames && server.miniGames.length > 0 ?
      criteria.miniGames.every(id => server.miniGames!.some(g => g.id === id)) : true;

    return nameMatch && versionsMatch && basesMatch && modsMatch && pluginsMatch && miniGamesMatch;
  });
};