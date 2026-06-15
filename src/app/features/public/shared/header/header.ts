import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
