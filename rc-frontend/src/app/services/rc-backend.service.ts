import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { Filter } from '../common/interfaces/filter';
import { Paginator } from '../common/interfaces/paginator';
import { ApiResponse, Server } from '../common/interfaces/server';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RcBackendService {
  private readonly api = environment.api;
  // Сигналы для хранения данных
  readonly bases = signal<any[]>([]);
  readonly miniGames = signal<any[]>([]);
  readonly mods = signal<any[]>([]);
  readonly plugins = signal<any[]>([]);
  readonly versions = signal<any[]>([]);
  readonly servers = signal<any>([]);
  readonly paginator = signal<Paginator>({page: 1, pageSize: 10}); 
  readonly filter = signal<Filter | null>(null);
  readonly favoriteServers = signal<Server[]>([]);
  
  readonly transactions = signal<any>([]);

  constructor(private http: HttpClient) {}

  // Методы для загрузки данных и обновления сигналов
  loadBases() {
    return this.http.get(`${this.api}/bases`).pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.bases.set(res)),
      shareReplay(1)
    );
  }

  loadMiniGames() {
    return this.http.get(`${this.api}/mini-games`).pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.miniGames.set(res)),
      shareReplay(1)
    );
  }

  loadMods() {
    return this.http.get(`${this.api}/mods`).pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.mods.set(res)),
      shareReplay(1)
    );
  }

  loadPlugins() {
    return this.http.get(`${this.api}/plugins`).pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.plugins.set(res)),
      shareReplay(1)
    );
  }

  loadVersions() {
    return this.http.get(`${this.api}/versions`).pipe(
      map((res: any) => res.map((item: any) => ({ ...item, active: false }))),
      tap((res: any) => this.versions.set(res)),
      shareReplay(1)
    );
  }

  findServers() {
    return this.http.post(`${this.api}/servers`, { ...this.filter() }).pipe(
      tap((res: any) => {
        this.servers.set(res.data);
        this.paginator.set({total: res.total, page: res.page, pageSize: res.pageSize});
      }) // Обновляем сигнал
    );
  }

  getServerById(id: string): Observable<Server> {
    return this.http.get<Server>(`${this.api}/servers/${id}`);
  }

  // Обновление search, versions, bases, mods, plugins, miniGames
  updateFilterDetails(details: Partial<Filter>) {
    this.filter.update(currentFilter => ({
        ...currentFilter,
        ...details
    }));
  }

  // Обновление page и pageSize
  updateFilterPagination(page: number, pageSize: number) {
    this.filter.update(currentFilter => ({
        ...currentFilter,
        page,
        pageSize
    }));
  }

  addServer(address: string, port: number) {
    return this.http.post(`${this.api}/add-server`, { address: address, port: port });
  }

  deleteServer(id: string) {
    return this.http.delete(`${this.api}/servers/${id}`);
  }

  updateServer(server: Server) {
    return this.http.put(`${this.api}/servers/${server.id}`, server);
  }

  getUserServers(): Observable<Server[]> {
    return this.http.get<Server[]>(`${this.api}/my-servers`);
  }

  addUserServer(serverData: any) {
    return this.http.post(`${this.api}/add-server`, serverData);
  }

  boostServer(server: Server, boostAmount: number) {
    return this.http.post(`${this.api}/servers/${server.id}/boost`, {
      amount: boostAmount,
      paymentMethod: 'card'
    })
  }

  loadTransactions() {
    return this.http.get(`${this.api}/transactions`).pipe(
      tap((res: any) => this.transactions.set(res)),
      shareReplay(1)
    );
  }

  /**
   * Загрузка избранных серверов пользователя
   */
  loadFavoriteServers(): Observable<Server[]> {
    return this.http.get<Server[]>(`${this.api}/favorite-servers`).pipe(
      tap((servers) => this.favoriteServers.set(servers)),
      shareReplay(1)
    );
  }

  /**
   * Добавить сервер в избранное
   */
  addFavoriteServer(serverId: string): Observable<void> {
    return this.http.post<void>(`${this.api}/favorite-servers`, { serverId }).pipe(
      tap(() => {
        const current = this.favoriteServers();
        const server = this.servers().find((s: Server) => s.id === serverId);
        if (server && !current.some(s => s.id === serverId)) {
          this.favoriteServers.set([...current, server]);
        }
      })
    );
  }

  /**
   * Удалить сервер из избранного
   */
  removeFavoriteServer(serverId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/favorite-servers/${serverId}`).pipe(
      tap(() => {
        this.favoriteServers.set(this.favoriteServers().filter(s => s.id !== serverId));
      })
    );
  }

  /**
   * Проверить, находится ли сервер в избранном
   */
  isServerFavorite(serverId: string): boolean {
    return this.favoriteServers().some(s => s.id === serverId);
  }
}