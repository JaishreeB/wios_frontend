import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {




  private baseUrl = 'http://localhost:9090/vendors';

  private zoneUrl = 'http://localhost:9090/zone';

  constructor(private client: HttpClient) { }

  public getAllVendors(): Observable<Vendor[]> {
    return this.client.get<Vendor[]>(`${this.baseUrl}/fetchAll`);
  }

  createVendor(vendor: CreateVendor): Observable<string> {
    console.log("Creating vendor...", vendor);
    return this.client.post(`${this.baseUrl}/save`, vendor, { responseType: 'text' });
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    return this.client.put<Vendor>(`${this.baseUrl}/update`, vendor);
  }


  deleteVendor(vendorId: number): Observable<string> {
    return this.client.delete(`${this.baseUrl}/deleteById/${vendorId}`, { responseType: 'text' });
  }

  getZoneNameById(zoneId: number): Observable<string> {
    return this.client.get<string>(`${this.zoneUrl}/fetchZoneNameById/${zoneId}`);
  }

}



// Vendor model
export class Vendor {
  vendorId!: number;
  vendorName!: string;
  contactInfo!: string;
  email!: string;
}

// CreateVendor model
export class CreateVendor {
  vendorName!: string;
  contactInfo!: string;
  email!: string;
}
