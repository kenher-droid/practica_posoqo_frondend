import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { HeroBanner } from './components/hero-banner/hero-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HeroBanner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('posoqo_frondend');
}
