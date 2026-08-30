export type UsuarioRole = 'ADMIN' | 'USER';

export interface CreateUsuarioDTO {
  email: string;
  nombre: string;
  password: string;
  role?: UsuarioRole;
}

export interface UpdateUsuarioDTO {
  email?: string;
  nombre?: string;
  password?: string;
  role?: UsuarioRole;
}