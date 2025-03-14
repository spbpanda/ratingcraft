import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs';

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
  readonly servers = signal<any[]>([]);

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

  findServers(req: { 
    search?: string | null, 
    versions?: number[] | null, 
    bases?: number[] | null, 
    mods?: number[] | null, 
    plugins?: number[] | null, 
    miniGames?: number[] | null 
  }) {
    return this.http.post('http://localhost:5000/servers', { ...req }).pipe(
      tap((res: any) => {
        this.servers.set(res)
      }) // Обновляем сигнал
    );
  }

  getServerInfo(id: number) {
    return this.http.get(`http://localhost:5000/servers/${id}`);
  }
}