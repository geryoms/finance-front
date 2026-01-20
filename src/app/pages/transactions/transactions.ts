import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Transaction, Account, Category } from '../../models/api.models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styles: []
})
export class TransactionsComponent implements OnInit {
  private api = inject(ApiService);

  transactions = signal<Transaction[]>([]);
  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);
  
  filterAccountId = signal<number | null>(null);

  isEditing = signal(false);
  formData = signal<any>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'GASTO',
    accountId: null,
    categoryId: null
  });

  filteredTransactions = computed(() => {
    const all = this.transactions();
    const filter = this.filterAccountId();
    
    if (filter) {
      return all.filter(t => t.account?.id === filter);
    }
    return all;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getTransactions().subscribe(data => this.transactions.set(data));
    this.api.getAccounts().subscribe(data => this.accounts.set(data));
    this.api.getCategories().subscribe(data => this.categories.set(data));
  }

  saveTransaction() {
    const data = this.formData();
    
    if (!data.accountId) {
      alert('Por favor selecciona una cuenta.');
      return;
    }
    if (data.description.length < 3) {
      alert('La descripción debe tener al menos 3 caracteres.');
      return;
    }

    const payload: any = {
      description: data.description,
      amount: data.amount,
      date: data.date,
      type: data.type,
      account: { id: Number(data.accountId) }, 
      category: data.categoryId ? { id: Number(data.categoryId) } : null
    };

    if (this.isEditing() && data.id) {
        this.api.updateTransaction(data.id, payload).subscribe({
            next: () => {
                this.resetForm();
                this.loadData();
            },
            error: (err) => console.error('Error actualizando:', err)
        });
    } else {
        this.api.createTransaction(payload).subscribe({
            next: () => {
                this.resetForm();
                this.loadData();
            },
            error: (err) => console.error('Error creando:', err)
        });
    }
  }

  editTransaction(tx: Transaction) {
    this.isEditing.set(true);
    this.formData.set({
        id: tx.id,
        description: tx.description,
        amount: tx.amount,
        date: tx.date,
        type: tx.type,
        accountId: tx.account?.id,
        categoryId: tx.category?.id || null
    });
  }

  deleteTransaction(id: number) {
    if(confirm('¿Borrar movimiento?')) {
        this.api.deleteTransaction(id).subscribe(() => {
            this.transactions.update(list => list.filter(t => t.id !== id));
        });
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.formData.set({
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'GASTO',
        accountId: this.accounts()[0]?.id || null,
        categoryId: null
    });
  }

  clearFilter() {
    this.filterAccountId.set(null);
  }
}