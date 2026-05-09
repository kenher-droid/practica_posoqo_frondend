import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Header } from "../../components/header/header";
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { Padding } from "../../components/padding/padding";

@Component({
  selector: 'app-public-layout',
  imports: [RouterModule, Header, HeroBanner, Padding],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
