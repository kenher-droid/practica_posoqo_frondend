import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-puntos',
  imports: [],
  templateUrl: './puntos.html',
  styleUrl: './puntos.css',
})
export class Puntos {
  usuarios = signal([
    { id: 1, nombre: 'Jose alvarez pinedo de la cruz', telefono: '987654321', puntos: 451 },
    { id: 2, nombre: 'Jose pinedo brrr', telefono: '912345678', puntos: 26 }
  ]);

  searchTerm = signal('');
  selectedUser = signal<any>(null);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  puntosAQuitar = 0;

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onPuntosChange(event: Event) {
    this.puntosAQuitar = Number((event.target as HTMLInputElement).value);
  }

  openAdd(user: any) {
    this.selectedUser.set(user);
    this.showAddModal.set(true);
  }

  openDelete(user: any) {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  confirmAdd() {
    const user = this.selectedUser();
    if (user) user.puntos += 1;
    this.close();
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (user && this.puntosAQuitar > 0) {
      user.puntos = Math.max(0, user.puntos - this.puntosAQuitar);
    }
    this.close();
  }

  close() {
    this.showAddModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
    this.puntosAQuitar = 0;
  }
}
