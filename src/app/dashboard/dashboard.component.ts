import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Stock, StockService } from '../stock.service';
import { Zone, ZoneService } from '../zone.service';
import { DashboardService } from '../dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('zoneChartCanvas') zoneChartCanvas!: ElementRef<HTMLCanvasElement>;

  totalStocks = 0;
  totalZones = 0;
  turnoverRate = 0;
  recentTransactions: any[] = [];

  categoryChart: any;
  zoneChart: any;

  constructor(
    private dashboardService: DashboardService,
    private stockService: StockService,
    private zoneService: ZoneService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.totalStocks = data.stocks.length;
      this.totalZones = data.zones.length;
      this.turnoverRate = data.metrics[0]?.value || 0;

      this.enrichTransactions(data.transactions);
      this.cdr.detectChanges(); // Ensure canvas is ready
      console.log("stocks fetched for category.......",data.stocks)
      this.renderCategoryChart(data.stocks);
      this.renderZoneChart(data.zones);
    });
  }

  renderCategoryChart(stocks: any[]) {
    const grouped = stocks.reduce((acc, stock) => {
      const category = stock.stockCategory || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);
  
    // Define category-specific colors
    const categoryColors: Record<string, string> = {
      Electronics: '#0d6efd',
      Furniture: '#198754',
      Clothing: '#ffc107',
      Food: '#dc3545',
      Uncategorized: '#6c757d'
    };
  
    // Assign colors based on category or fallback
    const backgroundColors = labels.map(label => categoryColors[label] || this.getRandomColor());
  
    const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
    if (this.categoryChart) this.categoryChart.destroy();
  
    this.categoryChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Stock by Category',
          data,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Stock by Category' },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Stock Count' }
          }
        }
      }
    });
  }
  

  renderZoneChart(zones: any[]) {
    const labels = zones.map(z => z.zoneName);
    const data = zones.map(z => z.zoneCapacity - z.availableSpace);
    const colors = labels.map(() => this.getRandomColor());

    const ctx = this.zoneChartCanvas.nativeElement.getContext('2d');
    if (this.zoneChart) this.zoneChart.destroy();

    this.zoneChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Used Space',
          data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Zone Utilization' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Used Capacity' }
          }
        }
      }
    });
  }

  enrichTransactions(transactions: any[]) {
    const enriched: any[] = [];

    transactions.slice(0, 5).forEach(txn => {
      const enrichedTxn: any = { ...txn };

      this.stockService.getStockById(txn.stockId).subscribe(stock => {
        enrichedTxn.stockName = stock.stockName;
        this.zoneService.getZoneById(txn.zoneId).subscribe(zone => {
          enrichedTxn.zoneName = zone.zoneName;
          enrichedTxn.date = txn.timestamp || new Date(); // fallback if date missing
          enriched.push(enrichedTxn);
        });
      });
    });

    // Delay assignment to allow async calls to complete
    setTimeout(() => {
      this.recentTransactions = enriched;
    }, 500);
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  }
}
 