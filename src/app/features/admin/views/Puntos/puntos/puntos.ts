import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PuntosService } from './puntos.service';

interface TransaccionLocal {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  cantidad: number;
  tipo: 'suma' | 'resta';
  razon: string;
  fecha: Date;
}

@Component({
  selector: 'app-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './puntos.html',
  styleUrl: './puntos.css',
})
export class Puntos implements OnInit {
  usuarios = signal([
    { id: 1, nombre: 'Jose alvarez pinedo de la cruz', telefono: '987654321', puntos: 451 },
    { id: 2, nombre: 'Jose pinedo brrr', telefono: '912345678', puntos: 26 }
  ]);

  transacciones = signal<TransaccionLocal[]>([]);
  searchTerm = signal('');
  selectedUser = signal<any>(null);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showHistorial = signal(false);
  // Lista de items del menú que pueden tener puntos promocionales
  menuItems = signal([
    { id: 101, nombre: 'Hamburguesa clásica', puntosPromocion: 50 },
    { id: 102, nombre: 'Papas fritas grandes', puntosPromocion: 0 },
    { id: 103, nombre: 'Combo familiar', puntosPromocion: 120 },
    { id: 104, nombre: 'Refresco 1L', puntosPromocion: 10 }
  ]);

  // IDs de promociones seleccionadas para descontar
  selectedPromociones = signal<number[]>([]);
  promotionSearch = signal('');

  // IDs de promociones seleccionadas para añadir
  selectedAddPromociones = signal<number[]>([]);
  addPromotionSearch = signal('');

  constructor() { }

  ngOnInit() {
    // Cargar historial inicial (simular datos si no hay API)
    this.cargarHistorialInicial();
  }

  promocionesDisponibles() {
    const term = this.promotionSearch().trim().toLowerCase();
    return this.menuItems()
      .filter(m => (m as any).puntosPromocion > 0)
      .filter(m => !term || m.nombre.toLowerCase().includes(term));
  }

  promocionesDisponiblesParaAgregar() {
    const term = this.addPromotionSearch().trim().toLowerCase();
    return this.menuItems()
      .filter(m => (m as any).puntosPromocion > 0)
      .filter(m => !term || m.nombre.toLowerCase().includes(term));
  }

  private cargarHistorialInicial() {
    // Datos de ejemplo para el historial
    this.transacciones.set([
      {
        id: 1,
        usuarioId: 1,
        usuarioNombre: 'Jose alvarez pinedo de la cruz',
        cantidad: 50,
        tipo: 'suma',
        razon: 'Compra completada',
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        usuarioId: 1,
        usuarioNombre: 'Jose alvarez pinedo de la cruz',
        cantidad: 20,
        tipo: 'resta',
        razon: 'Canje de promoción',
        fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        usuarioId: 2,
        usuarioNombre: 'Jose pinedo brrr',
        cantidad: 15,
        tipo: 'suma',
        razon: 'Referencia de amigo',
        fecha: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ]);
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onPromotionSearch(event: Event) {
    this.promotionSearch.set((event.target as HTMLInputElement).value);
  }

  onAddPromotionSearch(event: Event) {
    this.addPromotionSearch.set((event.target as HTMLInputElement).value);
  }

  togglePromocion(id: number, checked: boolean) {
    this.selectedPromociones.update(prev => {
      if (checked) return [...prev, id];
      return prev.filter(x => x !== id);
    });
  }

  toggleAddPromocion(id: number, checked: boolean) {
    this.selectedAddPromociones.update(prev => {
      if (checked) return [...prev, id];
      return prev.filter(x => x !== id);
    });
  }

  totalSelectedPoints(): number {
    const ids = this.selectedPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      return sum + (m ? (m as any).puntosPromocion || 0 : 0);
    }, 0);
  }

  totalAddPoints(): number {
    const ids = this.selectedAddPromociones();
    return ids.reduce((sum, id) => {
      const m = this.menuItems().find(mi => mi.id === id);
      return sum + (m ? (m as any).puntosPromocion || 0 : 0);
    }, 0);
  }

  openAdd(user: any) {
    this.selectedUser.set(user);
    this.selectedAddPromociones.set([]);
    this.addPromotionSearch.set('');
    this.showAddModal.set(true);
  }

  openDelete(user: any) {
    this.selectedUser.set(user);
    this.selectedPromociones.set([]);
    this.promotionSearch.set('');
    this.showDeleteModal.set(true);
  }

  openHistorial(user: any) {
    this.selectedUser.set(user);
    this.showHistorial.set(true);
  }

  confirmAdd() {
    const user = this.selectedUser();
    if (!user) {
      this.close();
      return;
    }

    const total = this.totalAddPoints();
    if (total <= 0) {
      this.close();
      return;
    }

    user.puntos += total;
    const nombres = this.selectedAddPromociones().map(id => this.menuItems().find(m => m.id === id)?.nombre).filter(Boolean).join(', ');
    this.registrarTransaccion(user.id, user.nombre, total, 'suma', `Promociones añadidas: ${nombres}`);
    // Ejemplo de llamada a API (desactivada si no hay backend)
    // this.puntosService.agregarPuntos(user.id, total, `Promociones añadidas: ${nombres}`).subscribe();
    this.close();
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (!user) { this.close(); return; }
    const total = this.totalSelectedPoints();
    if (total <= 0) {
      this.close();
      return;
    }
    user.puntos = Math.max(0, user.puntos - total);
    const nombres = this.selectedPromociones().map(id => this.menuItems().find(m => m.id === id)?.nombre).filter(Boolean).join(', ');
    this.registrarTransaccion(user.id, user.nombre, total, 'resta', `Canje promoción: ${nombres}`);
    // Ejemplo de llamada a API (desactivada si no hay backend)
    // this.puntosService.quitarPuntos(user.id, total, `Canje promoción: ${nombres}`).subscribe();
    this.close();
  }

  private registrarTransaccion(usuarioId: number, usuarioNombre: string, cantidad: number, tipo: 'suma' | 'resta', razon: string) {
    const nuevaTransaccion: TransaccionLocal = {
      id: Date.now(),
      usuarioId,
      usuarioNombre,
      cantidad,
      tipo,
      razon,
      fecha: new Date()
    };

    this.transacciones.update(trans => [nuevaTransaccion, ...trans]);
  }

  close() {
    this.showAddModal.set(false);
    this.showDeleteModal.set(false);
    this.showHistorial.set(false);
    this.selectedUser.set(null);
    this.selectedPromociones.set([]);
    this.selectedAddPromociones.set([]);
    this.promotionSearch.set('');
    this.addPromotionSearch.set('');
  }

  obtenerTransaccionesUsuario(usuarioId?: number): TransaccionLocal[] {
    if (!usuarioId) return [];
    return this.transacciones().filter(t => t.usuarioId === usuarioId);
  }
}
