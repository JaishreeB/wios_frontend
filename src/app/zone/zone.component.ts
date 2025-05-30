import { Component, OnInit } from '@angular/core';
import { CreateZone, Zone, ZoneService } from '../zone.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  pageSize = 5;

  selectedZone: Zone = new Zone();
  createZone:CreateZone=new CreateZone();
  isEditMode = false;

  constructor(private zoneService: ZoneService) {}

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
    } else {
      console.log("from saveZone....",this.createZone)
      this.zoneService.createZone(this.createZone).subscribe(() => this.loadZones());
    }
  }

  deleteZone(zoneId: number): void {
    if (confirm('Are you sure you want to delete this zone?')) {
      this.zoneService.deleteZone(zoneId).subscribe(() => this.loadZones());
    }
  }
}
