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
    { id: 1, nombre: 'Halloween Posoqo', fecha: '2026-10-31', hora: '20:00', lugar: 'Local Principal', descripcion: 'Fiesta de disfraces y música en vivo.', imagen: '' }
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

  // 🔥 AQUÍ SE HACE LA MAGIA DE LA CONVERSIÓN RÁPIDA A WEBP
  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file || !this.selectedEvento) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        // 1. Creamos un lienzo (canvas) en memoria
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 2. Establecemos límites para que no suban fotos exageradamente gigantes
        const MAX_WIDTH = 1000; // Un ancho excelente para eventos web
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        // 3. Dibujamos la imagen redimensionada en el lienzo
        ctx?.drawImage(img, 0, 0, width, height);

        // 4. Transformamos a formato image/webp con calidad balanceada (0.75 = 75%)
        // Esto reduce fotos de 5MB a solo 70KB-120KB al instante.
        const webpBase64 = canvas.toDataURL('image/webp', 0.75);

        // 5. Guardamos en el estado el string .webp ultra liviano para la vista previa y la API
        if (this.selectedEvento) {
          this.selectedEvento = {
            ...this.selectedEvento,
            imagen: webpBase64
          };
        }
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
      
      /* =======================================================================
         🚀 CONEXIÓN API: CREAR EVENTO REAL
         =======================================================================
         Aquí enviarías tu 'nuevoEvento' a la base de datos a través de tu servicio HTTP.
         Como la propiedad .imagen ya viaja en formato WebP comprimido, subirá volando.
      */
      this.eventos.update(list => [...list, nuevoEvento]);
      
    } else {
      /* =======================================================================
         🔄 CONEXIÓN API: EDITAR EVENTO REAL
         =======================================================================
         Aquí llamarías a tu API con un método PUT o PATCH pasando el ID actual.
      */
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

    /* =======================================================================
       🗑️ CONEXIÓN API: ELIMINAR EVENTO REAL
       =======================================================================
       Aquí ejecutas el servicio de eliminación mandando this.selectedEvento.id
    */
    this.eventos.update(list => list.filter(e => e.id !== this.selectedEvento!.id));
    this.closeAll();
  }
}