import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { Routes } from '@angular/router';

@NgModule({
  declarations: [ClientListComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule, // Add this
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class ClientsModule {
  routes: Routes = [
    {
      path: 'clients',
      loadChildren: () => import('./clients.module').then(m => m.ClientsModule)
    }
  ];
}