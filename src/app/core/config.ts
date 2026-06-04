export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: '/auth',
  login: '/auth/login',
  register: '/auth/registro',
  roles: '/roles/',
  usuarios: '/usuarios/',
  usuariosMe: '/usuarios/me',
  clientes: '/clientes/',
  clientesMe: '/clientes/me',
  buscarClientes: '/clientes/buscar',
  sumarPuntos: '/clientes/sumar-puntos',
  canjearPuntos: '/clientes/canjear-puntos',
  categorias: '/categorias/',
  subcategorias: '/subcategorias/',
  menus: '/menus/',
  eventos: '/eventos/',
  promociones: '/promociones/',
  historialMe: '/historial-puntos/me',
  historialPuntos: '/historial-puntos',
  imagenesSubir: '/imagenes/subir'
};

export const API_DEFAULT_TIMEOUT = 15000; // ms
