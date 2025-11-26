import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoListComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: 'todos' }
];

