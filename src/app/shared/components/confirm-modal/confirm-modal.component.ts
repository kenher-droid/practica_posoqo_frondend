import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal-content" [class.dark-theme]="isDarkTheme" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ title }}</h2>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="onCancel()">Cancelar</button>
            <button class="btn-confirm" (click)="onConfirm()">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      animation: slideUp 0.3s ease;
      overflow: hidden;
    }

    .modal-content.dark-theme {
      background: rgba(20, 20, 20, 0.98);
      border: 1px solid rgba(225, 190, 33, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .modal-content.dark-theme .modal-header {
      border-bottom-color: rgba(225, 190, 33, 0.2);
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.4rem;
      color: #1a1a1a;
      font-weight: 700;
    }

    .modal-content.dark-theme .modal-header h2 {
      color: #f5f5f5;
    }

    .modal-body {
      padding: 1.5rem;
      color: #333;
      line-height: 1.5;
    }

    .modal-content.dark-theme .modal-body {
      color: #d0d0d0;
    }

    .modal-body p {
      margin: 0;
      font-size: 0.95rem;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .modal-content.dark-theme .modal-footer {
      border-top-color: rgba(225, 190, 33, 0.2);
    }

    .btn-cancel,
    .btn-confirm {
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .btn-cancel {
      background: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
      transform: translateY(-1px);
    }

    .modal-content.dark-theme .btn-cancel {
      background: rgba(255, 255, 255, 0.08);
      color: #d0d0d0;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .modal-content.dark-theme .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .btn-confirm {
      background: #e1be21;
      color: #0b0b0c;
    }

    .btn-confirm:hover {
      background: #d4a91d;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(225, 190, 33, 0.3);
    }
  `]
})
export class ConfirmModalComponent {
  isOpen = false;
  isDarkTheme = false;
  title = '';
  message = '';
  confirmText = 'Confirmar';
  private onConfirmCallback: (() => void) | null = null;
  private onCancelCallback: (() => void) | null = null;

  open(title: string, message: string, confirmText: string = 'Confirmar', isDarkTheme: boolean = false): Promise<boolean> {
    return new Promise((resolve) => {
      this.title = title;
      this.message = message;
      this.confirmText = confirmText;
      this.isDarkTheme = isDarkTheme;
      this.isOpen = true;
      
      this.onConfirmCallback = () => {
        this.isOpen = false;
        resolve(true);
      };

      this.onCancelCallback = () => {
        this.isOpen = false;
        resolve(false);
      };
    });
  }

  onConfirm(): void {
    if (this.onConfirmCallback) {
      this.onConfirmCallback();
    }
  }

  onCancel(): void {
    if (this.onCancelCallback) {
      this.onCancelCallback();
    }
  }
}
