import { Component, OnInit, signal, effect, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { Router, RouterModule } from '@angular/router'; 
import { ApiService } from '../../services/api';
import { Account, DashboardSummary, MonthlyStat, CategoryStat } from '../../models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  // --- SIGNALS ---
  summary = signal<DashboardSummary | null>(null);
  accounts = signal<Account[]>([]);
  historyStats = signal<MonthlyStat[]>([]);
  categoryStats = signal<CategoryStat[]>([]);
  isLoading = signal(true);

  // --- OPCIONES DE GRÁFICOS ---
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  public doughnutChartType: ChartType = 'doughnut';
  // FALTABA ESTO:
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };
  
  // --- DATOS COMPUTADOS (Se actualizan solos) ---
  barChartData = computed<ChartData<'bar'>>(() => {
    const stats = this.historyStats();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      labels: stats.map(s => `${monthNames[s.month - 1]} ${s.year}`),
      datasets: [
        { data: stats.map(s => s.income), label: 'Ingresos', backgroundColor: '#2ecc71', borderRadius: 4 },
        { data: stats.map(s => s.expense), label: 'Gastos', backgroundColor: '#e74c3c', borderRadius: 4 }
      ]
    };
  });

  doughnutChartData = computed<ChartData<'doughnut'>>(() => {
    const stats = this.categoryStats();
    return {
      labels: stats.map(s => s.name || 'Sin Cat'),
      datasets: [{
        data: stats.map(s => s.total),
        backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6']
      }]
    };
  });

  // Helpers booleanos
  hasHistory = computed(() => this.historyStats().length > 0);
  hasCategories = computed(() => this.categoryStats().length > 0);

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.isLoading.set(true);
    this.api.getDashboardSummary().subscribe(res => this.summary.set(res));
    this.api.getAccounts().subscribe(res => this.accounts.set(res));
    this.api.getHistory().subscribe(res => this.historyStats.set(res));
    this.api.getChartData().subscribe(res => {
        this.categoryStats.set(res);
        this.isLoading.set(false);
    });
  }

  // FALTABA ESTO:
  goToAccount(accountId: number) {
    this.router.navigate(['/transactions'], { queryParams: { accountId: accountId } });
  }
}