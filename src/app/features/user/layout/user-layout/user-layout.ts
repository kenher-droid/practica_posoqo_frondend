import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-layout',
  imports: [RouterModule, ConfirmModalComponent],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout {
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  
  private readonly authService = inject(AuthService);

  async logout(): Promise<void> {
    const confirmed = await this.confirmModal.open(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      'Cerrar sesión',
      true
    );
    if (confirmed) {
      this.authService.logout();
    }
  }
}