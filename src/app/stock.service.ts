import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class Stock {
  stockId!: number;
  stockName!: string;
  stockCategory!: string;
  stockQuantity!: number;
  zoneId!: number;
  vendorId!: number;
}

export class CreateStock {
  stockName!: string;
  stockCategory!: string;
  stockQuantity!: number;
  zoneId!: number;
  vendorId!: number;
}

export class Vendor {
  vendorId!: number;
  vendorName!: string;
  contactInfo!: string;
  email!: string;
}

export class Zone {
  zoneId!: number;
  zoneName!: string;
  zoneCapacity!: number;
  availableSpace!: number;
}

export interface ZoneStockResponse {
  zone: Zone;
  stock: Stock[];
}

export interface VendorStockResponse {
  vendor: Vendor;
  stock: Stock[];
}

@Injectable({
  providedIn: 'root'
})
export class StockService {


  private baseUrl = 'http://localhost:9090/stock';
  private vendorUrl = 'http://localhost:9090/vendors';
  private zoneUrl = 'http://localhost:9090/zone';

  constructor(private http: HttpClient) { }

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/fetchAll`);
  }

  createStock(stock: CreateStock): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, stock, { responseType: 'text' });
  }

  updateStock(stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.baseUrl}/updateInbound`, stock);
  }

  deleteStock(stockId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${stockId}`);
  }

  getVendorById(vendorId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.vendorUrl}/fetchById/${vendorId}`);
  }

  getZoneById(zoneId: number): Observable<Zone> {
    return this.http.get<Zone>(`${this.zoneUrl}/fetchById/${zoneId}`);
  }
  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.zoneUrl}/fetchAll`);
  }

  getAllVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.vendorUrl}/fetchAll`);
  }
  getStocksByCategory(category: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/fetchCategory/${category}`);
  }


  getStocksByZone(zoneId: number): Observable<ZoneStockResponse> {
    return this.http.get<ZoneStockResponse>(`${this.baseUrl}/fetchZone/${zoneId}`);
  }


  getStockById(stockId: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/fetchById/${stockId}`);
  }
  getStocksByVendor(vendorId: number): Observable<VendorStockResponse> {
    return this.http.get<VendorStockResponse>(`${this.baseUrl}/fetchVendor/${vendorId}`);
  }


}
