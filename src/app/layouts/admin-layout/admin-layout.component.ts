import { Component } from '@angular/core';
import { AdminNavbarComponent } from "../../components/admin-navbar/admin-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminNavbarComponent,RouterOutlet],
  template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="admin-content">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AdminLayoutComponent {

}
