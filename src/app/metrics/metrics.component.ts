import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricsService, PerformanceMetric } from '../metrics.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css'
})
export class MetricsComponent implements OnInit,AfterViewInit {
  @ViewChild('metricsCanvas') metricsCanvas: ElementRef<HTMLCanvasElement>;


  metrics: PerformanceMetric[] = [];
  filteredMetrics: PerformanceMetric[] = [];

  selectedType = 'Turnover';
  startDate: string = '';
  endDate: string = '';

  currentPage = 1;
  pageSize = 5;

  loading = false;
  error = '';
  chart: any;

  constructor(
 
    private metricsService: MetricsService,
    private cdr: ChangeDetectorRef
  ) {
    console.log("inside metrix constructor:",this.metricsCanvas)
  }

  ngOnInit(): void {
    this.loadMetrics();

  }
  
   ngAfterViewInit() {
    console.log("inside metrix After:",this.metricsCanvas)
  }
    

  loadMetrics(): void {
    this.loading = true;
    this.error = '';
    this.metricsService.getMetricsByType(this.selectedType, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.metrics = data;
        this.filteredMetrics = [...data];
        this.currentPage = 1;
        this.loading = false;

        // Wait for view to update
        this.cdr.detectChanges();
        this.renderChart();
      },
      error: () => {
        this.error = 'Failed to load metrics.';
        this.loading = false;
      }
    });
  }

  triggerCalculation(): void {
    this.metricsService.triggerCalculation().subscribe({
      next: () => this.loadMetrics(),
      error: () => this.error = 'Failed to trigger metric calculation.'
    });
  }

  get paginatedMetrics(): PerformanceMetric[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMetrics.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredMetrics.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  renderChart(): void {
    const canvas = this.metricsCanvas?.nativeElement;
    if (!canvas) {
     console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    if (this.chart) this.chart.destroy();

    const labels = this.metrics.map(m => new Date(m.timestamp).toLocaleString());
    const values = this.metrics.map(m => m.value);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${this.selectedType} Over Time`,
          data: values,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'Value' } }
        }
      }
    });
  }
}
