import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmModalComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    const confirmed = await this.confirmModal.open(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      'Cerrar sesión'
    );
    if (confirmed) {
      this.authService.logout();
    }
  }
}
