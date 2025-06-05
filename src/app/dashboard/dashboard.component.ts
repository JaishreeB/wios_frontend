import {
  Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import { Stock } from '../stock.service';
import { Zone } from '../zone.service';
import { PerformanceMetric } from '../metrics.service';
import { CommonModule } from '@angular/common';

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
  @ViewChild('spaceBreakdownChartCanvas') spaceBreakdownChartCanvas!: ElementRef<HTMLCanvasElement>;

  totalCapacity = 0;
  availableSpace = 0;
  occupiedSpace = 0;
  totalStocks = 0;
  totalZones = 0;

  turnoverChart?: Chart;
  spaceUtilChart?: Chart;
  categoryChart?: Chart;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: data => {
        this.totalStocks = data.stocks?.length || 0;
        this.totalZones = data.zones?.length || 0;
        this.totalCapacity = data.zones.reduce((sum, z) => sum + z.zoneCapacity, 0);
        this.availableSpace = data.zones.reduce((sum, z) => sum + z.availableSpace, 0);
        this.occupiedSpace = this.totalCapacity - this.availableSpace;

        this.cdr.detectChanges();
        this.renderCategoryChart(data.stocks);

        this.renderSpaceBreakdownChart();

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
      type: 'pie',
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
          title: {
            display: true,
            text: 'Stock Quantity by Category'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                return `${label}: ${value}`;
              }
            }
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
  renderSpaceBreakdownChart() {
    const ctx = this.spaceBreakdownChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = [this.occupiedSpace, this.availableSpace];
    const labels = ['Occupied Space', 'Available Space'];
    const colors = ['#ff6384', '#36a2eb'];

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Space Breakdown'
          }
        }
      }
    });
  }
}  