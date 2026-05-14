import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Header } from "../shared/header/header";
import { LandingPage } from "../shared/landing-page/landing-page";
import { Footer } from "../shared/footer/footer";

@Component({
  selector: 'app-public-layout',
  imports: [RouterModule, Header, LandingPage, Footer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
