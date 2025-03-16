import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs';
import { Filter } from '../common/interfaces/filter';
import { Paginator } from '../common/interfaces/paginator';
import { ApiResponse } from '../common/interfaces/server';

@Injectable({
  providedIn: 'root',
})
export class RcBackendService {
  // Сигналы для хранения данных
  readonly bases = signal<any[]>([]);
  readonly miniGames = signal<any[]>([]);
  readonly mods = signal<any[]>([]);
  readonly plugins = signal<any[]>([]);
  readonly versions = signal<any[]>([]);
  readonly servers = signal<any>([]);
  readonly paginator = signal<Paginator>({page: 1, pageSize: 10}); 
  readonly filter = signal<Filter | null>(null)

  constructor(private http: HttpClient) {}

  // Методы для загрузки данных и обновления сигналов
  loadBases() {
    return this.http.get('http://localhost:5000/bases').pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.bases.set(res)),
      shareReplay(1)
    );
  }

  loadMiniGames() {
    return this.http.get('http://localhost:5000/mini-games').pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.miniGames.set(res)),
      shareReplay(1)
    );
  }

  loadMods() {
    return this.http.get('http://localhost:5000/mods').pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.mods.set(res)),
      shareReplay(1)
    );
  }

  loadPlugins() {
    return this.http.get('http://localhost:5000/plugins').pipe(
      map((res: any) => res.map((item: any) => ({ value: item, viewValue: item.value }))),
      tap((res: any) => this.plugins.set(res)),
      shareReplay(1)
    );
  }

  loadVersions() {
    return this.http.get('http://localhost:5000/versions').pipe(
      map((res: any) => res.map((item: any) => ({ ...item, active: false }))),
      tap((res: any) => this.versions.set(res)),
      shareReplay(1)
    );
  }

  findServers() {
    return this.http.post('http://localhost:5000/servers', { ...this.filter() }).pipe(
      tap((res: any) => {
        this.servers.set(res.data);
        this.paginator.set({total: res.total, page: res.page, pageSize: res.pageSize});
      }) // Обновляем сигнал
    );
  }

  getServerInfo(id: number) {
    return this.http.get(`http://localhost:5000/servers/${id}`);
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
    return this.http.post('http://localhost:5000/add-server', { address: address, port: port });
  }
}