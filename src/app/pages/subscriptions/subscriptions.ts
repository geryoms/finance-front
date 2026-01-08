import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account, Category, SubscriptionModel } from '../../models/api.models';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.html',
  styles: []
})
export class SubscriptionsComponent implements OnInit {
  
  subscriptions = signal<SubscriptionModel[]>([]);
  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);

  newSub: any = {
    name: '',
    amount: null,
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    accountId: null,
    categoryId: null
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getSubscriptions().subscribe(data => {
      this.subscriptions.set(data);
    });

    this.api.getAccounts().subscribe(data => {
      this.accounts.set(data);
      if (data.length > 0 && !this.newSub.accountId) {
        this.newSub.accountId = data[0].id;
      }
    });

    this.api.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  create() {
    if (!this.newSub.name || !this.newSub.amount || !this.newSub.accountId) {
      alert('Por favor, rellena nombre, monto y cuenta.');
      return;
    }

    const payload: SubscriptionModel = {
      name: this.newSub.name,
      amount: this.newSub.amount,
      frequency: this.newSub.frequency,
      startDate: this.newSub.startDate,
      account: { id: Number(this.newSub.accountId) },
      category: this.newSub.categoryId ? { id: Number(this.newSub.categoryId) } : undefined
    };

    this.api.createSubscription(payload).subscribe({
      next: () => {
        this.loadData(); 
        
        alert('Suscripción creada correctamente.');
        
        this.newSub.name = '';
        this.newSub.amount = null;
        this.newSub.categoryId = null;
      },
      error: (err) => {
        console.error('Error creando suscripción:', err);
        alert('Hubo un error al crear la suscripción.');
      }
    });
  }

  delete(id: number) {
    if(confirm('¿Seguro que quieres cancelar esta suscripción?')) {
      this.api.deleteSubscription(id).subscribe(() => {
        this.subscriptions.update(current => current.filter(s => s.id !== id));
      });
    }
  }

  getDaysRemaining(dateStr?: string): number {
    if(!dateStr) return 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const next = new Date(dateStr);
    next.setHours(0,0,0,0);
    
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }
}