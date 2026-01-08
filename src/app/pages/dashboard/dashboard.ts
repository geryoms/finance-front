import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { Account, CategoryStat, DashboardSummary, MonthlyStat } from '../../models/api.models';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  summary: DashboardSummary | null = null;
  isLoading = true;
  hasChartData = false;
  hasHistoryData = false;


  
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ 
      data: [], 
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      hoverOffset: 4
    }]
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Ingresos', backgroundColor: '#2ecc71', hoverBackgroundColor: '#27ae60' },
      { data: [], label: 'Gastos', backgroundColor: '#e74c3c', hoverBackgroundColor: '#c0392b' }
    ]
  };
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  
constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadAccounts();
    this.loadChart();
        this.loadHistory();

  }

  loadDashboard() {
    this.apiService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadChart() {
    this.apiService.getChartData().subscribe({
      next: (stats: CategoryStat[]) => {
        if (stats.length > 0) {
          this.doughnutChartData = {
            labels: stats.map(s => s.name || 'Sin Categoría'),
            datasets: [{
              data: stats.map(s => s.total),
              backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#34495e']
            }]
          };
          this.hasChartData = true;
        }
        this.cdr.detectChanges();
      }
    });
  }


  loadHistory() {
    this.apiService.getHistory().subscribe({
      next: (stats: MonthlyStat[]) => {
        if (stats.length > 0) {
          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          
          this.barChartData = {
            labels: stats.map(s => `${monthNames[s.month - 1]} ${s.year}`),
            datasets: [
              { 
                data: stats.map(s => s.income), 
                label: 'Ingresos', 
                backgroundColor: '#2ecc71',
                borderRadius: 4 
              },
              { 
                data: stats.map(s => s.expense), 
                label: 'Gastos', 
                backgroundColor: '#e74c3c', 
                borderRadius: 4
              }
            ]
          };
          this.hasHistoryData = true;
        }
        this.cdr.detectChanges();
      }
    });
  }


  loadAccounts() {
    this.apiService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.cdr.detectChanges();
      }
    });
  }

  goToAccount(accountId: number) {
    this.router.navigate(['/transactions'], { queryParams: { accountId: accountId } });
  }
}