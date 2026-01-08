import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/api.models';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
  <h2>🏷️ Categorías</h2>
  
  <div class="input-group mb-4 mt-3" style="max-width: 500px;">
    <input type="text" class="form-control" [(ngModel)]="newCategoryName" placeholder="Nueva Categoría (ej: Comida)">
    <button class="btn btn-success" (click)="create()">Añadir</button>
  </div>

  <div class="list-group shadow-sm">
    @for (cat of categories(); track cat.id) {
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span>{{ cat.name }}</span>
        <button class="btn btn-outline-danger btn-sm border-0" (click)="delete(cat.id!)">🗑️</button>
      </div>
    } @empty {
      <div class="list-group-item text-center text-muted">Lista vacía</div>
    }
  </div>
</div>
  `,
  styles: []
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  newCategoryName: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCategories().subscribe(data => this.categories.set(data));
  }

  create() {
    if(!this.newCategoryName) return;
    this.api.createCategory({ name: this.newCategoryName }).subscribe(() => {
      this.api.getCategories().subscribe(data => this.categories.set(data));
      this.newCategoryName = '';
    });
  }

  delete(id: number) {
    if(confirm('¿Borrar categoría?')) {
      this.api.deleteCategory(id).subscribe(() => {
        this.categories.update(list => list.filter(c => c.id !== id));
      });
    }
  }
}