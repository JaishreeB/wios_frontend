import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { StockService } from './stock.service';
import { ZoneService } from './zone.service';
import { MetricsService } from './metrics.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    public stockService: StockService,
    public zoneService: ZoneService,
    public metricsService: MetricsService
  ) {}

  getDashboardData() {
    return forkJoin({
      stocks: this.stockService.getAllStocks(),
      zones: this.zoneService.getAllZones()
    });
  }

  getRecentMetrics() {
    return forkJoin({
      turnover: this.metricsService.getMetricsByType('Turnover'),
      spaceUtilization: this.metricsService.getMetricsByType('Space Utilization')
    }).pipe(
      map(({ turnover, spaceUtilization }) => ({
        turnover: turnover
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
          .reverse(),
        spaceUtilization: spaceUtilization
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
          .reverse()
      }))
    );
  }
  
  
}
