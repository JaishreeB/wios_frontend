import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from './register.service';

export class Transaction {
  transactionId!: number;
  stockId!: number;
  userId!: number;
  zoneId!: number;
  quantity!: number;
  type!: string;
  timestamp!: string;
  price!: number;
  stockName?: string;
zoneName?: string;
userName?: string;

}

export class CreateTransaction {
  stockId!: number;
  userId!: number;
  zoneId!: number;
  quantity!: number;
  type!: string;
  price!: number;
  stockName?: string;
zoneName?: string;
userName?: string;

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

  constructor(private http: HttpClient) { }

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

  getStockById(stockId: number): Observable<Stock|any> {
    return this.http.get<Stock>(`${this.stockUrl}/fetchById/${stockId}`).pipe(
      catchError(error => {
        if (error.status === 404 || error.status === 406) {
          return of(stockId); // Wrap stockId in an observable
        }
        throw error; // Rethrow other errors
      })
    );
  }
  getUserByName(userName: string): Observable<number> {
    return this.http.get<number>(`${this.userUrl}/getUserId/${userName}`);
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/fetchById/${userId}`);
  }

  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.zoneUrl}/fetchAll`);
  }

  getZoneById(zoneId: number): Observable<Zone | any> {
    return this.http.get<Zone>(`${this.zoneUrl}/fetchById/${zoneId}`).pipe(
      catchError(error => {
        if (error.status === 404 || error.status === 406) {
          return of(zoneId); // Return null if stock not found
        }
        throw error; // Rethrow other errors
      })
    );
  }
}
