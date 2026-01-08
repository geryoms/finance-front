import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/api.models';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.html',
  styles: []
})
export class AccountsComponent implements OnInit {
  accounts = signal<Account[]>([]);
  
  newAccount: any = { name: '', currentBalance: 0 };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.api.getAccounts().subscribe(data => {
      this.accounts.set(data);
    });
  }

  create() {
    this.api.createAccount(this.newAccount).subscribe(() => {
      this.loadAccounts();
      this.newAccount = { name: '', currentBalance: 0 };
    });
  }

  delete(id: number) {
    if(confirm('¿Borrar cuenta? Se borrarán sus movimientos.')) {
      //this.api.deleteAccount(id).subscribe(() => {
      //  this.accounts.update(list => list.filter(a => a.id !== id));
     // });
    }
  }
}