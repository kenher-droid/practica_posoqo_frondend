import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  saveUser() {
    if (!this.selectedUser) {
      return;
    }

    this.usuarios.update(list =>
      list.map(user =>
        user.id === this.selectedUser.id ? { ...this.selectedUser } : user
      )
    );
    this.closeModals();
  }

  confirmDelete() {
    if (this.selectedUser) {
      this.usuarios.update(list => list.filter(u => u.id !== this.selectedUser.id));
    }
    this.closeModals();
  }
}
