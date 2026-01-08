import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction, Account, Category } from '../../models/api.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styles: []
})
export class TransactionsComponent implements OnInit {
  
  transactions = signal<Transaction[]>([]);
  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);
  filterAccountId = signal<number | null>(null);

  filteredTransactions = computed(() => {
    const all = this.transactions();
    const filterId = this.filterAccountId();
    if (!filterId) return all;
    return all.filter(t => t.account?.id === filterId);
  });

  isEditing = false;
  editingId: number | null = null;

  formData: any = {
    description: '',
    amount: null,
    type: 'GASTO',
    date: new Date().toISOString().split('T')[0],
    accountId: null,
    categoryId: null
  };

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.apiService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.checkRouteParams();
      },
      error: (err) => console.error('Error cargando transacciones', err)
    });

    this.apiService.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        if (!this.isEditing && data.length > 0 && !this.formData.accountId) {
          this.formData.accountId = data[0].id;
        }
        this.checkRouteParams();
      }
    });

    this.apiService.getCategories().subscribe({
      next: (data) => this.categories.set(data)
    });
  }

  saveTransaction() {
    if (!this.formData.description || !this.formData.amount || !this.formData.accountId) {
      alert('Por favor completa descripción, monto y cuenta.');
      return;
    }

    const payload: any = {
      description: this.formData.description,
      amount: this.formData.amount,
      type: this.formData.type,
      date: this.formData.date,
      account: { id: Number(this.formData.accountId) },
      category: this.formData.categoryId ? { id: Number(this.formData.categoryId) } : null
    };

    if (this.isEditing && this.editingId) {
      this.apiService.updateTransaction(this.editingId, payload).subscribe({
        next: (updatedTx) => {
          this.transactions.update(currentList => 
            currentList.map(t => t.id === this.editingId ? updatedTx : t)
          );
          
          alert('Movimiento actualizado.');
          this.resetForm();
          this.reloadAccounts(); 
        },
        error: () => alert('Error al actualizar.')
      });

    } else {
      this.apiService.createTransaction(payload).subscribe({
        next: (tx) => {
          this.transactions.update(currentList => [tx, ...currentList]);
          
          this.updateLocalBalance(Number(this.formData.accountId), Number(this.formData.amount), this.formData.type);

          alert('Transacción registrada!');
          this.resetForm();
        },
        error: () => alert('Error al crear transacción.')
      });
    }
  }

  editTransaction(tx: Transaction) {
    this.isEditing = true;
    this.editingId = tx.id!;
    this.formData = {
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      date: tx.date,
      accountId: tx.account?.id,
      categoryId: tx.category?.id || null 
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTransaction(id: number) {
    if(confirm('¿Seguro que quieres borrar este movimiento?')) {
        this.apiService.deleteTransaction(id).subscribe(() => {
            this.transactions.update(list => list.filter(t => t.id !== id));
            this.reloadAccounts();
        });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = {
      description: '',
      amount: null,
      type: 'GASTO',
      date: new Date().toISOString().split('T')[0],
      accountId: this.accounts().length > 0 ? this.accounts()[0].id : null,
      categoryId: null
    };
  }

  reloadAccounts() {
      this.apiService.getAccounts().subscribe(data => this.accounts.set(data));
  }

  updateLocalBalance(accountId: number, amount: number, type: string) {
    this.accounts.update(cuentas => {
        return cuentas.map(acc => {
            if (acc.id === accountId) {
                const newBalance = type === 'INGRESO' 
                    ? acc.currentBalance + amount 
                    : acc.currentBalance - amount;
                return { ...acc, currentBalance: newBalance };
            }
            return acc;
        });
    });
  }

  checkRouteParams() {
    this.route.queryParams.subscribe(params => {
      const accId = params['accountId'];
      if (accId) {
        const id = Number(accId);
        this.formData.accountId = id;
        this.filterAccountId.set(id);
      }
    });
  }

  clearFilter() {
    this.filterAccountId.set(null);
    this.router.navigate([], { queryParams: {} });
  }
}