import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary, Account, Transaction, Category, CategoryStat, MonthlyStat, SubscriptionModel } from '../models/api.models';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }
  

  getChartData(): Observable<CategoryStat[]> {
  return this.http.get<CategoryStat[]>(`${this.baseUrl}/dashboard/charts`);
}
  // Dashboard
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/summary`);
  }

  // Cuentas
  
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/accounts`, account);
  }

  //Transactiones
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction);
  }

  updateTransaction(id: number, transaction: any): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}`, transaction);
  }
  
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/transactions/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(cat: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, cat);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }
  getHistory(): Observable<MonthlyStat[]> {
    return this.http.get<MonthlyStat[]>(`${this.baseUrl}/dashboard/history`);
  }


  getSubscriptions(): Observable<SubscriptionModel[]> {
    return this.http.get<SubscriptionModel[]>(`${this.baseUrl}/subscriptions`);
  }

  createSubscription(sub: SubscriptionModel): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(`${this.baseUrl}/subscriptions`, sub);
  }

  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subscriptions/${id}`);
  }
}