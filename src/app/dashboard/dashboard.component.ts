import {
  Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import { Stock } from '../stock.service';
import { Zone } from '../zone.service';
import { PerformanceMetric } from '../metrics.service';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionService } from '../transaction.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('turnoverChartCanvas') turnoverChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('spaceUtilChartCanvas') spaceUtilChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topZonesChartCanvas') topZonesChartCanvas!: ElementRef<HTMLCanvasElement>;
  totalCapacity = 0;
  availableSpace = 0;
  occupiedSpace = 0;
  totalStocks = 0;
  totalZones = 0;
  
  turnoverChart?: Chart;
  spaceUtilChart?: Chart;
  categoryChart?: Chart;
  topZonesChart?: Chart;
  
  summaryMetrics: { label: string; value: number; change?: number }[] = [];
  
  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: data => {
        this.totalStocks = data.stocks?.length || 0;
        this.totalZones = data.zones?.length || 0;
        this.totalCapacity = data.zones.reduce((sum, z) => sum + z.zoneCapacity, 0);
        this.availableSpace = data.zones.reduce((sum, z) => sum + z.availableSpace, 0);
        this.occupiedSpace = this.totalCapacity - this.availableSpace;
  
        this.transactionService.getAllTransactions().subscribe(transactions => {
          this.calculateTrendsFromTransactions(transactions);
          this.summaryMetrics = [
            { label: 'Total Zones', value: this.totalZones },
            { label: 'Total Stocks', value: this.totalStocks },
            { label: 'Total Capacity', value: this.totalCapacity },
            { label: 'Available Space', value: this.availableSpace },
            { label: 'Occupied Space', value: this.occupiedSpace },
            { label: 'Turnover', value: this.currentSales, change: this.turnoverChange }
          ];
        });
  
        this.cdr.detectChanges();
        this.renderCategoryChart(data.stocks);
        this.renderTopUtilizedZonesChart(data.zones);
      },
      error: err => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  
    this.dashboardService.getRecentMetrics().subscribe({
      next: metrics => {
        this.renderTurnoverChart(metrics.turnover);
        this.renderSpaceUtilizationChart(metrics.spaceUtilization);
      },
      error: err => {
        console.error('Error fetching metrics:', err);
      }
    });
  }
  
  currentSales = 0;
  turnoverChange = 0;
  
  calculateTrendsFromTransactions(transactions: Transaction[]) {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - 30);
  
    const previousStart = new Date(currentStart);
    previousStart.setDate(currentStart.getDate() - 30);
  
    const currentPeriod = transactions.filter(txn =>
      new Date(txn.timestamp) >= currentStart && new Date(txn.timestamp) <= now
    );
  
    const previousPeriod = transactions.filter(txn =>
      new Date(txn.timestamp) >= previousStart && new Date(txn.timestamp) < currentStart
    );
  
    this.currentSales = currentPeriod
      .filter(txn => txn.type === 'OUTBOUND')
      .reduce((sum, txn) => sum + txn.quantity, 0);
  
    const previousSales = previousPeriod
      .filter(txn => txn.type === 'OUTBOUND')
      .reduce((sum, txn) => sum + txn.quantity, 0);
  
    this.turnoverChange = this.currentSales - previousSales;
  }
  

  renderTurnoverChart(metrics: PerformanceMetric[]) {
    const ctx = this.turnoverChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.turnoverChart) this.turnoverChart.destroy();

    const labels = metrics.map(m => new Date(m.timestamp).toLocaleString());
    const values = metrics.map(m => m.value);

    this.turnoverChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Turnover (Last 5)',
          data: values,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Turnover (Last 5 Records)' }
        },
        scales: {
          x: { title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'Value' } }
        }
      }
    });
  }

  renderSpaceUtilizationChart(metrics: PerformanceMetric[]) {
    const ctx = this.spaceUtilChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.spaceUtilChart) this.spaceUtilChart.destroy();

    const labels = metrics.map(m => new Date(m.timestamp).toLocaleString());
    const values = metrics.map(m => m.value);

    this.spaceUtilChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Space Utilization (Last 5)',
          data: values,
          borderColor: 'rgba(40, 167, 69, 1)',
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Space Utilization (Last 5 Records)' }
        },
        scales: {
          x: { title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'Value' } }
        }
      }
    });
  }

  renderCategoryChart(stocks: Stock[]) {
    const grouped = stocks.reduce((acc: Record<string, number>, stock) => {
      const category = stock.stockCategory || 'Uncategorized';
      acc[category] = (acc[category] || 0) + stock.stockQuantity;
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);
    const colors = labels.map(() => this.getRandomColor());

    const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
    if (this.categoryChart) this.categoryChart.destroy();

    this.categoryChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Stock Quantity by Category',
          data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Stock Categories' }
        }
      }
    });
  }


  renderTopUtilizedZonesChart(zones: Zone[]) {
    const utilizationData = zones.map(zone => ({
      name: zone.zoneName || `Zone ${zone.zoneId}`,
      utilization: zone.zoneCapacity > 0
        ? ((zone.zoneCapacity - zone.availableSpace) / zone.zoneCapacity) * 100
        : 0
    }));
  
    const topZones = utilizationData.sort((a, b) => b.utilization - a.utilization).slice(0, 5);
    const labels = topZones.map(z => z.name);
    const data = topZones.map(z => z.utilization);
    const colors = labels.map(() => this.getRandomColor());
  
    const ctx = this.topZonesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.topZonesChart) this.topZonesChart.destroy();
  
    this.topZonesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Top 5 Utilized Zones (%)',
          data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Top 5 Utilized Zones' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Utilization (%)' }
          }
        }
      }
    });
  }
  


  getRandomColor(): string {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  }








}
