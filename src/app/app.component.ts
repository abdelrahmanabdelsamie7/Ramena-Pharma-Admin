import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./admin/shared/navbar/navbar.component";
import { FooterComponent } from "./admin/shared/footer/footer.component";
import { LoaderComponent } from "./admin/shared/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ramena-Pharma-Site';
}
