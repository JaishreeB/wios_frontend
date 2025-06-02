import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class PerformanceMetric {
  metricId!: number;
  type!: string;
  value!: number;
  timestamp!: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private baseUrl = 'http://localhost:9090/metrics';

  constructor(private http: HttpClient) {}

  /**
   * Fetch metrics by type, with optional date filtering.
   * @param type Metric type (e.g., "Turnover", "Space Utilization")
   * @param startDate Optional start date (YYYY-MM-DD)
   * @param endDate Optional end date (YYYY-MM-DD)
   */
  getMetricsByType(type: string, startDate?: string, endDate?: string): Observable<PerformanceMetric[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<PerformanceMetric[]>(`${this.baseUrl}/bytype/${type}`, { params });
  }

  /**
   * Trigger backend to calculate and save new metrics.
   */
  triggerCalculation(): Observable<string> {
    return this.http.get(`${this.baseUrl}/calmetrics`, { responseType: 'text' });
  }
}
