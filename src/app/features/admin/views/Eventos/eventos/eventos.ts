import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
})
export class Eventos {
  eventos = signal([
    { id: 1, nombre: 'Halloween Posoqo', fecha: '31/10/26', hora: '20:00', lugar: 'Local Principal', descripcion: 'Fiesta de disfraces y música en vivo.' }
  ]);

  // Estados de UI
  modalMode: 'create' | 'edit' | 'none' = 'none';
  showDeleteConfirm = false;
  selectedEvento: any = null;

  // Abrir modal para crear
  openCreate() {
    this.selectedEvento = { id: 0, nombre: '', fecha: '', hora: '', lugar: '', descripcion: '' };
    this.modalMode = 'create';
  }

  // Abrir modal para editar
  openEdit(evento: any) {
    this.selectedEvento = { ...evento };
    this.modalMode = 'edit';
  }

  // Abrir confirmación de eliminación
  openDelete(evento: any) {
    this.selectedEvento = evento;
    this.showDeleteConfirm = true;
  }

  closeAll() {
    this.modalMode = 'none';
    this.showDeleteConfirm = false;
    this.selectedEvento = null;
  }

  confirmDelete() {
    this.eventos.update(list => list.filter(e => e.id !== this.selectedEvento.id));
    this.closeAll();
  }
}
