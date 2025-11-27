import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-todo-list',
  standalone: false,
  template: `
    <section>
      <h2>Your Todos</h2>
      <form (submit)="add($event)">
        <input [(ngModel)]="newTitle" name="title" placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        <li *ngFor="let t of todos">
          <label>
            <input type="checkbox" name="done-{{t.id}}" [(ngModel)]="t.done" (change)="save()" />
            <span [style.textDecoration]="t.done ? 'line-through' : 'none'">{{ t.title }}</span>
          </label>
          <button (click)="remove(t.id)">Remove</button>
        </li>
      </ul>
    </section>
  `,
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  newTitle = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    try {
      this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    } catch {
      this.todos = [];
    }
  }

  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  add(e?: Event) {
    e?.preventDefault();
    if (!this.newTitle.trim()) return;
    this.todos.push({ id: Date.now().toString(36), title: this.newTitle.trim(), done: false });
    this.newTitle = '';
    this.save();
  }

  remove(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.save();
  }


}