import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,    RouterModule,   // for routerLink
    FormsModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchTerm = '';

  constructor(private router: Router) {}

  onSearch() {
    // navigate to /searchresults?q=whatever
    this.router.navigate(
      ['/sr'],
      { queryParams: { q: this.searchTerm.trim() } }
    );
  }
}
