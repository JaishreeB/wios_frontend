import { Component, OnInit } from '@angular/core';
import { CreateZone, Zone, ZoneService } from '../zone.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CommonServiceService } from '../common-service.service';
import { Stock, StockService } from '../stock.service';


@Component({
  selector: 'zone',
  imports: [FormsModule,CommonModule],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.css'
})

export class ZoneComponent implements OnInit {
  zones: Zone[] = [];
  filteredZones: Zone[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  selectedUsage = '';
  selectedStockZone: any;
  stocks: any[] = [];


  selectedZone: Zone = new Zone();
  createZone:CreateZone=new CreateZone();
  isEditMode = false;

  constructor(private zoneService: ZoneService,private commonService:CommonServiceService,private stockService:StockService) {}

  ngOnInit(): void {
    this.loadZones();
  }

  loadZones(): void {
    this.zoneService.getAllZones().subscribe(data => {
      this.zones = data;
      this.applyFilter();
    });
  }


  applyFilter(): void {
    this.filteredZones = this.zones.filter(zone =>
      zone.zoneName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedZones(): Zone[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredZones.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredZones.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get zoneName(): string {
    return this.isEditMode ? this.selectedZone.zoneName : this.createZone.zoneName;
  }
  set zoneName(value: string) {
    if (this.isEditMode) {
      this.selectedZone.zoneName = value;
    } else {
      this.createZone.zoneName = value;
    }
  }
  
  get zoneCapacity(): number {
    return this.isEditMode ? this.selectedZone.zoneCapacity : this.createZone.zoneCapacity;
  }
  set zoneCapacity(value: number) {
    if (this.isEditMode) {
      this.selectedZone.zoneCapacity = value;
    } else {
      this.createZone.zoneCapacity = value;
    }
  }
  
  get availableSpace(): number {
    return this.isEditMode ? this.selectedZone.availableSpace : this.createZone.availableSpace;
  }
  set availableSpace(value: number) {
    if (this.isEditMode) {
      this.selectedZone.availableSpace = value;
    } else {
      this.createZone.availableSpace = value;
    }
  }
  

  openCreateForm(): void {
    console.log("from function open create form......")
    this.createZone = new CreateZone();
    this.isEditMode = false;
  }

  openEditForm(zone: Zone): void {
    this.selectedZone = { ...zone };
    this.isEditMode = true;
  }

  saveZone(): void {
    if (this.isEditMode) {
      this.zoneService.updateZone(this.selectedZone).subscribe(() =>response=>{console.log(response);this.loadZones()});
      window.location.reload();
    } else {
      console.log("from saveZone....",this.createZone)
      this.zoneService.createZone(this.createZone).subscribe(() => this.loadZones());
      window.location.reload();
    }
  }


openStockModal(zone: any): void {
  this.stockService.getStocksByZone(zone.zoneId).subscribe({
    next: (response) => {
      this.selectedStockZone = response.zone;
      this.stocks = Array.isArray(response) ? response : response.stock|| [];

      // Show Bootstrap modal
      const modalElement = document.getElementById('stockModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    },
    error: (err) => {
      console.error('Error fetching stocks:', err);
      alert('Error fetching stocks. Please try again later.');
    }
  });
}

  


  deleteZone(zoneId: number): void {
    if (confirm('Are you sure you want to delete this zone?')) {
      this.zoneService.deleteZone(zoneId).subscribe(() => this.loadZones());
      window.location.reload();
    }
  }
  get isAdmin():boolean{
    if(this.commonService.getUserRole()=="ADMIN"){
      return true;
    }
  }
}
