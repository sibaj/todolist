import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoListComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: 'todos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
