import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    const userInfo = this.authService.getUserInfo();
    if (userInfo?.roles?.includes('ROLE_ADMIN')) {
      return true;
    }

    this.snackBar.open('Access denied. Admin privileges required.', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
    this.router.navigate(['/products']);
    return false;
  }
}
