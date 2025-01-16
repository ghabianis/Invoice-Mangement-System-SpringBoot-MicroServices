import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [mode]="'side'"
          [opened]="isLoggedIn() && !isAuthPage()">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/products" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Products</span>
          </a>
          <a mat-list-item routerLink="/invoices" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt</mat-icon>
            <span matListItemTitle>Invoices</span>
          </a>
          <a mat-list-item *ngIf="isAdmin()" routerLink="/clients" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Clients</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" *ngIf="!isAuthPage()">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Invoice Management System</span>
          <span class="spacer"></span>
          <ng-container *ngIf="isLoggedIn()">
            <button mat-button (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </ng-container>
        </mat-toolbar>
        <div class="content" [class.auth-content]="isAuthPage()">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }
    .sidenav {
      width: 200px;
    }
    .content {
      padding: 20px;
    }
    .auth-content {
      padding: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.roles?.includes('ROLE_ADMIN');
  }

  isAuthPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/login') || currentUrl.includes('/register');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Force reload to clear any cached state
    });
  }
}
