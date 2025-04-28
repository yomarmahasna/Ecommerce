import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/shared/footer/footer.component";

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [NavbarComponent, RouterModule, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="customer-content">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>

  `
})
export class CustomerLayoutComponent {

}
