import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion: string;
  imagen?: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
})
export class Eventos {
  eventos = signal<Evento[]>([
    { id: 1, nombre: 'Halloween Posoqo', fecha: '31/10/26', hora: '20:00', lugar: 'Local Principal', descripcion: 'Fiesta de disfraces y música en vivo.', imagen: '' }
  ]);

  // Estados de UI
  modalMode: 'create' | 'edit' | 'none' = 'none';
  showDeleteConfirm = false;
  selectedEvento: Evento | null = null;

  // Abrir modal para crear
  openCreate() {
    this.selectedEvento = { id: 0, nombre: '', fecha: '', hora: '', lugar: '', descripcion: '', imagen: '' };
    this.modalMode = 'create';
  }

  // Abrir modal para editar
  openEdit(evento: Evento) {
    this.selectedEvento = { ...evento };
    this.modalMode = 'edit';
  }

  // Abrir confirmación de eliminación
  openDelete(evento: Evento) {
    this.selectedEvento = evento;
    this.showDeleteConfirm = true;
  }

  closeAll() {
    this.modalMode = 'none';
    this.showDeleteConfirm = false;
    this.selectedEvento = null;
  }

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file || !this.selectedEvento) {
      return;
    }

    const eventoActual = this.selectedEvento;
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedEvento = {
        ...eventoActual,
        imagen: reader.result as string
      };
    };
    reader.readAsDataURL(file);
  }

  saveEvento() {
    if (!this.selectedEvento || !this.selectedEvento.nombre || !this.selectedEvento.fecha) {
      return;
    }

    if (this.modalMode === 'create') {
      const nuevoEvento: Evento = {
        ...this.selectedEvento,
        id: Date.now()
      };
      this.eventos.update(list => [...list, nuevoEvento]);
    } else {
      this.eventos.update(list =>
        list.map(evento =>
          evento.id === this.selectedEvento?.id ? { ...this.selectedEvento } : evento
        )
      );
    }

    this.closeAll();
  }

  confirmDelete() {
    if (!this.selectedEvento) {
      return;
    }
    this.eventos.update(list => list.filter(e => e.id !== this.selectedEvento!.id));
    this.closeAll();
  }
}
