import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasComponent } from '../categorias/categorias';
import { MenuGeneralComponent } from '../menu-general/menu-general';
import { MenusActivosComponent } from '../menus-activos/menus-activos';
import { MenusInactivosComponent } from '../menus-inactivos/menus-inactivos';

type TabType = 'activos' | 'inactivos' | 'general' | 'categorias';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    CategoriasComponent,
    MenuGeneralComponent,
    MenusActivosComponent,
    MenusInactivosComponent,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  tabActiva = signal<TabType>('categorias');

  cambiarTab(tab: TabType): void {
    this.tabActiva.set(tab);
  }
}
