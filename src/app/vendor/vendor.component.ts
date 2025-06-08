import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateVendor, Vendor, VendorService } from '../vendor.service';
import { TitleCasePipe } from '@angular/common';
import { Stock, StockService } from '../stock.service';

@Component({
  selector: 'app-vendor',
  imports: [FormsModule, CommonModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})

export class VendorComponent implements OnInit {

  selectedVendorStock: Vendor | null = null;
  vendorStocks: Stock[] = [];

  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;

  selectedVendor: Vendor = new Vendor();
  createVendor: CreateVendor = new CreateVendor();
  isEditMode = false;

  constructor(
    private vendorService: VendorService,
    private commonService: CommonServiceService,
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.vendorService.getAllVendors().subscribe(data => {
      console.log("load vendors called...........")
      this.vendors = data;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredVendors = this.vendors.filter(vendor =>
      vendor.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  // getZoneName(zoneId: number): void {
  //   this.vendorService.getZoneNameById(zoneId).subscribe({
  //     next: (zoneName) => {
  //       console.log("Zone Name:", zoneName);
  //       // You can use the zoneName as needed, e.g., display it in the UI
  //     },
  //     error: (err) => {
  //       console.error('Error fetching zone name:', err);
  //       alert('Error fetching zone name. Please try again later.');
  //     }
  //   });
  // }
  get paginatedVendors(): Vendor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredVendors.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredVendors.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  // Form field bindings
  get vendorName(): string {
    return this.isEditMode ? this.selectedVendor.vendorName : this.createVendor.vendorName;
  }
  set vendorName(value: string) {
    if (this.isEditMode) {
      this.selectedVendor.vendorName = value;
    } else {
      this.createVendor.vendorName = value;
    }
  }

  get contactInfo(): string {
    return this.isEditMode ? this.selectedVendor.contactInfo : this.createVendor.contactInfo;
  }
  set contactInfo(value: string) {
    if (this.isEditMode) {
      this.selectedVendor.contactInfo = value;
    } else {
      this.createVendor.contactInfo = value;
    }
  }

  get email(): string {
    return this.isEditMode ? this.selectedVendor.email : this.createVendor.email;
  }
  set email(value: string) {
    if (this.isEditMode) {
      this.selectedVendor.email = value;
    } else {
      this.createVendor.email = value;
    }
  }

  openCreateForm(): void {
    this.createVendor = new CreateVendor();
    this.isEditMode = false;
  }

  openEditForm(vendor: Vendor): void {
    this.selectedVendor = { ...vendor };
    this.isEditMode = true;
  }

  saveVendor(): void {
    if (this.isEditMode) {
      this.vendorService.updateVendor(this.selectedVendor).subscribe(() => {
        this.loadVendors();
        window.location.reload();
      });
    } else {
      this.vendorService.createVendor(this.createVendor).subscribe(() => {
        this.loadVendors();
        window.location.reload();
      });
    }
  }

  deleteVendor(vendorId: number): void {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.vendorService.deleteVendor(vendorId).subscribe(() => {
        this.loadVendors();
        window.location.reload();
        console.log("window reloaded from delete vendor vendor component.......")
      });
    }
  }

  openVendorStockModal(vendor: Vendor): void {
    this.stockService.getStocksByVendor(vendor.vendorId).subscribe({
      next: (response) => {
        this.selectedVendor = response.vendor;
        this.vendorStocks = response.stock;

        const modal = new (window as any).bootstrap.Modal(document.getElementById('vendorStockModal')!);
        modal.show();
      },
      error: (err) => {
        console.error('Error fetching vendor stocks:', err);
        alert('Error fetching vendor stocks. Please try again later.');
      }
    });
  }

  get isAdmin(): boolean {
    return this.commonService.getUserRole() === 'ADMIN';
  }
}

