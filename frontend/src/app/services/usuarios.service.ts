import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

export type UsuarioRole = 'ADMIN' | 'USER';

export interface UsuarioInput {
  email: string;
  nombre: string;
  password?: string;
  role: UsuarioRole;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  /**
   * Devuelve los usuarios reales de la base de datos.
   */
  getUsuariosCompletos(): Observable<Usuario[]> {
    return this.getUsuarios();
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  createUsuario(data: UsuarioInput): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, data);
  }

  updateUsuario(id: string, data: Partial<UsuarioInput>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, data);
  }

  deleteUsuario(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}