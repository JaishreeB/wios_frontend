import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  
  private baseUrl = 'http://localhost:9090/zone';

  constructor(private client: HttpClient) {}
  
  public getAllZones(): Observable<Zone[]> {
  // const token = localStorage.getItem("token");
  // const headers = new HttpHeaders({
  // 'Authorization': `Bearer ${token}`,
  // 'Content-Type': 'application/json'
  // });
  // return this.client.get<Zone[]>(this.path, { headers });
  return this.client.get<Zone[]>(`${this.baseUrl}/fetchAll`);
  }  
  
  createZone(zone: CreateZone) {
    console.log("create zone.....",zone)
    return this.client.post(`${this.baseUrl}/save`, zone,{responseType:'text'}); 
  }
  
   updateZone(zone: Zone): Observable<Zone> {
   return this.client.put<Zone>(`${this.baseUrl}/update`, zone);
   }
  
  deleteZone(zoneId: number): Observable<void> {
   return this.client.delete<void>(`${this.baseUrl}/delete/${zoneId}`);
   }
  
}
export class Zone{
    zoneId:number;
    zoneName:string;
    zoneCapacity:number;
    availableSpace:number;
}
export class CreateZone{
  // zoneId:number;
  zoneName:string;
  zoneCapacity:number;
  availableSpace:number;
}
