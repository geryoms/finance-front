import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Account } from '../../models/api.models';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.html'
})
export class AccountsComponent implements OnInit {
  private api = inject(ApiService);
  
  accounts = signal<Account[]>([]);
  
  newAccount = signal<Account>({ 
    name: '', 
    initialBalance: 0, 
    currentBalance: 0 
  });

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.api.getAccounts().subscribe(res => this.accounts.set(res));
  }

  create() {
    this.api.createAccount(this.newAccount()).subscribe(() => {
      this.loadAccounts();
      this.newAccount.set({ name: '', initialBalance: 0, currentBalance: 0 });
    });
  }

  delete(id: number) {
    if(confirm('¿Borrar cuenta?')) {
    }
  }
}