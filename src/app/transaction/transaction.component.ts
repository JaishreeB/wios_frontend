import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../common-service.service';
import { TransactionService, Transaction, CreateTransaction, Stock, Zone } from '../transaction.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  stockMap: Map<number, Stock> = new Map();
  zoneMap: Map<number, Zone> = new Map();
  userNameMap: Map<number, string> = new Map();

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  createTransaction: CreateTransaction = new CreateTransaction();
  stockQuantity: any;
  zoneQuantity: any;

  constructor(
    private transactionService: TransactionService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.loadAllTransactions();

    this.transactionService.getAllStocks().subscribe(stocks => {
      this.stockMap.clear();
      stocks
        .filter(stock => stock && stock.stockId)
        .forEach(stock => this.stockMap.set(stock.stockId, stock));
    });

    this.transactionService.getAllZones().subscribe(zones => {
      this.zoneMap.clear();
      zones
        .filter(zone => zone && zone.zoneId)
        .forEach(zone => this.zoneMap.set(zone.zoneId, zone));
    });
  }

  loadAllTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(data => {
      this.transactions = data;
      this.fetchRelatedEntities(data);
      this.applyFilter();
    });
  }

  fetchRelatedEntities(transactions: Transaction[]): void {
    transactions.forEach(txn => {
      if (!this.stockMap.has(txn.stockId)) {
        this.transactionService.getStockById(txn.stockId).subscribe(stock => {
          this.stockMap.set(txn.stockId, stock);
        });
      }

      if (!this.zoneMap.has(txn.zoneId)) {
        this.transactionService.getZoneById(txn.zoneId).subscribe(zone => {
          this.zoneMap.set(txn.zoneId, zone);
        });
      }

      if (!this.userNameMap.has(txn.userId)) {
        this.transactionService.getUserById(txn.userId).subscribe(user => {
          if (user && user.name) {
            this.userNameMap.set(txn.userId, user.name);
          } else {
            this.userNameMap.set(txn.userId, 'User Removed');
          }
        });
      }
    });
  }

  applyFilter(): void {
    this.filteredTransactions = this.transactions.filter(txn =>
      this.getStockName(txn.stockId).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get stockId(): number {
    return this.createTransaction.stockId;
  }
  set stockId(value: number) {
    this.createTransaction.stockId = value;
    const selectedStock = this.stockMap.get(Number(value));
    if (selectedStock) {
      this.zoneId = selectedStock.zoneId;
      this.stockQuantity = selectedStock.stockQuantity;
      this.zoneQuantity = this.zoneMap.get(this.zoneId)?.availableSpace;
    }
  }

  get zoneId(): number {
    return this.createTransaction.zoneId;
  }
  set zoneId(value: number) {
    this.createTransaction.zoneId = value;
  }

  get quantity(): number {
    return this.createTransaction.quantity;
  }
  set quantity(value: number) {
    this.createTransaction.quantity = value;
  }

  get type(): string {
    return this.createTransaction.type;
  }
  set type(value: string) {
    this.createTransaction.type = value;
  }

  get price(): number {
    return this.createTransaction.price;
  }
  set price(value: number) {
    this.createTransaction.price = value;
  }

  openCreateForm(): void {
    this.createTransaction = new CreateTransaction();
    const username = sessionStorage.getItem("username");
    if (username) {
      this.transactionService.getUserByName(username).subscribe(id => {
        this.createTransaction.userId = id;
      });
    }
  }

  saveTransaction(): void {
    const selectedStock = this.stockMap.get(this.stockId);
    const selectedZone = this.zoneMap.get(this.zoneId);
  
    if (selectedStock) {
      this.createTransaction.stockName = selectedStock.stockName;
    }
  
    if (selectedZone) {
      this.createTransaction.zoneName = selectedZone.zoneName;
    }
  
    const username = sessionStorage.getItem("username");
    if (username) {
      this.transactionService.getUserByName(username).subscribe(userId => {
        this.createTransaction.userId = userId;
        this.createTransaction.userName = username;
        this.transactionService.createTransaction(this.createTransaction).subscribe(() => {
          this.loadAllTransactions();
        });
      });
    }
  }
  

  deleteTransaction(transactionId: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(transactionId).subscribe(() => this.loadAllTransactions());
      window.location.reload();
    }
  }

  get isAdmin(): boolean {
    return this.commonService.getUserRole() === 'ADMIN';
  }

  getStockName(stockId: number): string {
    return this.stockMap.get(stockId)?.stockName ?? 'Unknown Stock';
  }

  getUserName(userId: number): string {
    return this.userNameMap.get(userId) ?? 'Unknown User';
  }

  getZoneName(zoneId: number): string {
    return this.zoneMap.get(zoneId)?.zoneName ?? 'Unknown Zone';
  }

  get stockList(): Stock[] {
    return Array.from(this.stockMap.values()).filter(stock => stock && stock.stockId && stock.stockName);
  }

  get zoneList(): Zone[] {
    return Array.from(this.zoneMap.values()).filter(zone => zone && zone.zoneId && zone.zoneName);
  }
}
