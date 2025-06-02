import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class Transaction {
  transactionId!: number;
  stockId!: number;
  userId!: number;
  zoneId!: number;
  quantity!: number;
  type!: string;
  timestamp!: string;
  price!: number;
}

export class CreateTransaction {
  stockId!: number;
  userId!: number;
  zoneId!: number;
  quantity!: number;
  type!: string;
  price!: number;
}

export class Stock {
  stockId!: number;
  stockName!: string;
  stockCategory!: string;
  stockQuantity!: number;
  zoneId!: number;
  vendorId!: number;
}

export class Zone {
  zoneId!: number;
  zoneName!: string;
  zoneCapacity!: number;
  availableSpace!: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = 'http://localhost:9090/transactionLog';
  private stockUrl = 'http://localhost:9090/stock';
  private userUrl = 'http://localhost:9090/auth';
  private zoneUrl = 'http://localhost:9090/zone';

  constructor(private http: HttpClient) {}

  // Transaction CRUD
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/fetchAll`);
  }

  createTransaction(txn: CreateTransaction): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, txn, { responseType: 'text' });
  }

  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${transactionId}`);
  }

  // Related entity fetches
  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.stockUrl}/fetchAll`);
  }

  getStockById(stockId: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.stockUrl}/get/${stockId}`);
  }
  getUserByName(userName: string): Observable<number> {
    return this.http.get<number>(`${this.userUrl}/getUserId/${userName}`);
  }


  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.zoneUrl}/fetchAll`);
  }

  getZoneById(zoneId: number): Observable<Zone> {
    return this.http.get<Zone>(`${this.zoneUrl}/get/${zoneId}`);
  }
}
