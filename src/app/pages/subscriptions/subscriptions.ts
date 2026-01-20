import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { SubscriptionModel, Account, Category } from '../../models/api.models';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.html'
})
export class SubscriptionsComponent implements OnInit {
  private api = inject(ApiService);

  subscriptions = signal<SubscriptionModel[]>([]);
  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);

  newSub = signal<any>({
    name: '',
    amount: 0,
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    accountId: null,
    categoryId: null
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getSubscriptions().subscribe(res => this.subscriptions.set(res));
    this.api.getAccounts().subscribe(res => this.accounts.set(res));
    this.api.getCategories().subscribe(res => this.categories.set(res));
  }

  create() {
    const data = this.newSub();
    if (!data.accountId) return alert('Selecciona cuenta');

    this.api.createSubscription(data).subscribe(() => {
        this.loadData();
        // Reset form
        this.newSub.set({
            name: '',
            amount: 0,
            frequency: 'MONTHLY',
            startDate: new Date().toISOString().split('T')[0],
            accountId: this.accounts()[0]?.id, // Mantener una cuenta por defecto
            categoryId: null
        });
    });
  }

  delete(id: number) {
    if(confirm('¿Cancelar suscripción?')) {
        this.api.deleteSubscription(id).subscribe(() => {
            this.subscriptions.update(list => list.filter(s => s.id !== id));
        });
    }
  }

  // Helper para calcular días (puedes usarlo en el template)
  getDaysRemaining(dateStr?: string): number {
    if(!dateStr) return 0;
    const payment = new Date(dateStr);
    const today = new Date();
    const diff = payment.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}