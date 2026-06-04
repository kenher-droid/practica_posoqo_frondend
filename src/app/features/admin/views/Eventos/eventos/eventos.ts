import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { EventoCreate, RestauranteApiService } from '../../../../../core/services/restaurante-api.service';

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
export class Eventos implements OnInit {
  eventos = signal<Evento[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  selectedImageFile = signal<File | null>(null);

  // Estados de UI
  modalMode: 'create' | 'edit' | 'none' = 'none';
  showDeleteConfirm = false;
  selectedEvento: Evento | null = null;

  constructor(private readonly restauranteApi: RestauranteApiService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.loading.set(true);
    this.restauranteApi.listarEventos().subscribe({
      next: (eventos) => {
        this.eventos.set(eventos.map((evento) => ({
          id: evento.id,
          nombre: evento.nombre,
          fecha: evento.fecha,
          hora: evento.hora,
          lugar: evento.lugar,
          descripcion: evento.descripcion,
          imagen: evento.imagen_url
        })));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos.');
        this.loading.set(false);
      }
    });
  }

  // Abrir modal para crear
  openCreate() {
    this.error.set('');
    this.selectedImageFile.set(null);
    this.selectedEvento = { id: 0, nombre: '', fecha: '', hora: '', lugar: '', descripcion: '', imagen: '' };
    this.modalMode = 'create';
  }

  // Abrir modal para editar
  openEdit(evento: Evento) {
    this.error.set('');
    this.selectedImageFile.set(null);
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
    this.selectedImageFile.set(null);
    this.saving.set(false);
  }

  // 🔥 AQUÍ SE HACE LA MAGIA DE LA CONVERSIÓN RÁPIDA A WEBP
  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImageFile.set(file);
    if (!file || !this.selectedEvento) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.src = String(e.target?.result ?? '');

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
    this.error.set('');
    if (
      !this.selectedEvento ||
      !this.selectedEvento.nombre.trim() ||
      !this.selectedEvento.fecha ||
      !this.selectedEvento.hora ||
      !this.selectedEvento.lugar.trim() ||
      !this.selectedEvento.descripcion.trim()
    ) {
      this.error.set('Completa todos los campos del evento.');
      return;
    }

    this.saving.set(true);
    const evento = { ...this.selectedEvento };

    if (this.modalMode === 'create') {
      this.resolveImagenUrl(evento.imagen || '').pipe(
        switchMap((imagenUrl) => this.restauranteApi.crearEvento(this.toEventoPayload(evento, imagenUrl)))
      ).subscribe({
        next: (nuevoEvento) => {
          this.eventos.update(list => [...list, this.fromApiEvento(nuevoEvento)]);
          this.closeAll();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('No se pudo crear el evento. Revisa que la imagen y los campos sean validos.');
        }
      });
    } else {
      this.resolveImagenUrl(evento.imagen || '').pipe(
        switchMap((imagenUrl) => this.restauranteApi.actualizarEvento(evento.id, this.toEventoPayload(evento, imagenUrl)))
      ).subscribe({
        next: (eventoActualizado) => {
          this.eventos.update(list =>
            list.map(item =>
              item.id === eventoActualizado.id ? this.fromApiEvento(eventoActualizado) : item
            )
          );
          this.closeAll();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('No se pudo actualizar el evento. Revisa que la imagen y los campos sean validos.');
        }
      });
    }
  }

  private resolveImagenUrl(currentImage: string): Observable<string> {
    const file = this.selectedImageFile();
    if (!file) {
      return of(currentImage);
    }

    return this.restauranteApi.subirImagen(file).pipe(
      switchMap((response) => of(response.url ?? response.imagen_url ?? response.path ?? currentImage))
    );
  }

  private toEventoPayload(evento: Evento, imagenUrl: string): EventoCreate {
    return {
      nombre: evento.nombre.trim(),
      fecha: evento.fecha,
      hora: this.normalizeHora(evento.hora),
      lugar: evento.lugar.trim(),
      imagen_url: imagenUrl,
      descripcion: evento.descripcion.trim()
    };
  }

  private normalizeHora(hora: string): string {
    return hora.length === 5 ? `${hora}:00` : hora;
  }

  private fromApiEvento(evento: EventoCreate & { id: number }): Evento {
    return {
      id: evento.id,
      nombre: evento.nombre,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      descripcion: evento.descripcion,
      imagen: evento.imagen_url
    };
  }

  confirmDelete() {
    if (!this.selectedEvento) {
      return;
    }

    const id = this.selectedEvento.id;
    this.restauranteApi.eliminarEvento(id).subscribe({
      next: () => {
        this.eventos.update(list => list.filter(e => e.id !== id));
        this.closeAll();
      },
      error: () => this.error.set('No se pudo eliminar el evento.')
    });
  }
}
