import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { HeroBanner } from './components/hero-banner/hero-banner';
import { Padding } from './components/padding/padding';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HeroBanner,Padding],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('posoqo_frondend');
}
