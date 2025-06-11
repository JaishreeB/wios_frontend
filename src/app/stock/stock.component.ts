import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../common-service.service';
import { StockService, Stock, CreateStock, Vendor, Zone } from '../stock.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {

  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  vendorMap: Map<number, Vendor> = new Map();
  zoneMap: Map<number, Zone> = new Map();

  searchTerm = '';
  currentPage = 1;
  pageSize = 6;

  selectedStock: Stock = new Stock();
  createStock: CreateStock = new CreateStock();
  isEditMode = false;


  constructor(
    private stockService: StockService,
    private commonService: CommonServiceService,

    private cdRef: ChangeDetectorRef

  ) { this.loadAllStocks();}

  ngOnInit(): void {
    
    this.stockService.getAllZones().subscribe(zones => {
      zones.forEach(zone => this.zoneMap.set(zone.zoneId, zone));
      this.cdRef.detectChanges(); // Trigger change detection after async update
    });

    this.stockService.getAllVendors().subscribe(vendors => {
      vendors.forEach(vendor => this.vendorMap.set(vendor.vendorId, vendor));
      this.cdRef.detectChanges(); // Trigger change detection after async update
    });
  }

  loadAllStocks(): void {
    this.stockService.getAllStocks().subscribe(data => {
      this.stocks = data;
      this.fetchRelatedEntities(data);
      this.applyFilter();
    });
  }

  fetchRelatedEntities(stocks: Stock[]): void {
    stocks.forEach(stock => {
      if (!this.vendorMap.has(stock.vendorId)) {
        this.stockService.getVendorById(stock.vendorId).subscribe(vendor => {
          this.vendorMap.set(stock.vendorId, vendor);
        });
      }
      if (!this.zoneMap.has(stock.zoneId)) {
        this.stockService.getZoneById(stock.zoneId).subscribe(zone => {
          this.zoneMap.set(stock.zoneId, zone);
        });
      }
    });
  }


  applyFilter(): void {
    this.filteredStocks = this.stocks.filter(stock =>
      stock.stockName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedStocks(): Stock[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStocks.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredStocks.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get stockName(): string {
    return this.isEditMode ? this.selectedStock.stockName : this.createStock.stockName;
  }
  set stockName(value: string) {
    this.isEditMode ? this.selectedStock.stockName = value : this.createStock.stockName = value;
  }

  get stockCategory(): string {
    return this.isEditMode ? this.selectedStock.stockCategory : this.createStock.stockCategory;
  }
  set stockCategory(value: string) {
    this.isEditMode ? this.selectedStock.stockCategory = value : this.createStock.stockCategory = value;
  }

  get stockQuantity(): number {
    return this.isEditMode ? this.selectedStock.stockQuantity : this.createStock.stockQuantity;
  }
  set stockQuantity(value: number) {
    this.isEditMode ? this.selectedStock.stockQuantity = value : this.createStock.stockQuantity = value;
  }

  get zoneId(): number {
    return this.isEditMode ? this.selectedStock.zoneId : this.createStock.zoneId;
  }
  set zoneId(value: number) {
    this.isEditMode ? this.selectedStock.zoneId = value : this.createStock.zoneId = value;
  }

  get vendorId(): number {
    return this.isEditMode ? this.selectedStock.vendorId : this.createStock.vendorId;
  }
  set vendorId(value: number) {
    this.isEditMode ? this.selectedStock.vendorId = value : this.createStock.vendorId = value;
  }
  
  get vendorList(): Vendor[] {
     return Array.from(this.vendorMap.values());
  }
  
  get zoneList(): Zone[] {
     return Array.from(this.zoneMap.values());
  }
  
  openCreateForm(): void {
    this.createStock = new CreateStock();
    this.isEditMode = false;
  }

  openEditForm(stock: Stock): void {
    this.selectedStock = { ...stock };
    this.isEditMode = true;
  }

  saveStock(): void {
    if (this.isEditMode) {
      this.stockService.updateStock(this.selectedStock).subscribe(() => this.loadAllStocks());
    } else {
      this.stockService.createStock(this.createStock).subscribe(() => this.loadAllStocks());
    }
    // window.location.reload();
  }

  deleteStock(stockId: number): void {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.stockService.deleteStock(stockId).subscribe(() => this.loadAllStocks());
      // window.location.reload();
    }
  }

  get isAdmin(): boolean {
    return this.commonService.getUserRole() === 'ADMIN';
  }

  getZoneName(zoneId: number): string {
    return this.zoneMap.get(zoneId)?.zoneName ?? 'Unknown';
  }

  getVendorName(vendorId: number): string {
    return this.vendorMap.get(vendorId)?.vendorName ?? 'Unknown';
  }
}
