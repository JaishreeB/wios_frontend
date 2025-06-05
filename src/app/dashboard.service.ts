import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Stock, StockService } from './stock.service';
import { Zone, ZoneService } from './zone.service';
import { MetricsService, PerformanceMetric } from './metrics.service';
import { Transaction, TransactionService } from './transaction.service';
 // Adjust paths as needed

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private stockService: StockService,
    private zoneService: ZoneService,
    private metricsService: MetricsService,
    private transactionService: TransactionService
  ) {}

  getDashboardData(): Observable<{
    stocks: Stock[],
    zones: Zone[],
    metrics: PerformanceMetric[],
    transactions: Transaction[]
  }> {
    return forkJoin({
      stocks: this.stockService.getAllStocks(),
      zones: this.zoneService.getAllZones(),
      metrics: this.metricsService.getMetricsByType('Turnover'),
      transactions: this.transactionService.getAllTransactions()
    });
  }
}
