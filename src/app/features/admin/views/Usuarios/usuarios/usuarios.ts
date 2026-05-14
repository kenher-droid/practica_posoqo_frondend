import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  usuarios = signal([
    { id: 1, nombre: 'Jhon Juan', apellidos: 'Velarde', telefono: '+51 999 000 111', gmail: 'jhon@example.com', contrasena: '********', puntos: 150, fecha_nacimiento: '1995-05-12' }
  ]);

  // Control de Modales
  showEditModal = false;
  showDeleteConfirm = false;
  selectedUser: any = null;

  openEdit(usuario: any) {
    this.selectedUser = { ...usuario };
    this.showEditModal = true;
  }

  openDelete(usuario: any) {
    this.selectedUser = usuario;
    this.showDeleteConfirm = true;
  }

  closeModals() {
    this.showEditModal = false;
    this.showDeleteConfirm = false;
    this.selectedUser = null;
  }

  confirmDelete() {
    this.usuarios.update(list => list.filter(u => u.id !== this.selectedUser.id));
    this.closeModals();
  }
}
