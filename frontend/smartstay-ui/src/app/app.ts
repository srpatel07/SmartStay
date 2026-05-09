import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  isLoggedIn = false;

  constructor(public  auth: AuthService) { }

  ngOnInit() {
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}