import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface AdminNotification {
  notificationId: number;

  stockName: string;
  stockQuantity: number;
  vendorName: string;
  vendorEmail: string;
  zoneName: string;
  adminEmails: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit {
  notificationId: number = 0;
  private baseUrl = 'http://localhost:1119/notifications/low-stock'; // Adjust to your backend URL
  notificationCount: number;

  constructor(private http: HttpClient) {
    this.triggerNotification();
   }
  ngOnInit(): void {
    
  }

  getNotifications(): Observable<AdminNotification[]> {
    return this.http.get<AdminNotification[]>(`${this.baseUrl}/fetchAll`);
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }




  triggerNotification() {
    this.getNotifications().subscribe(data => {
      this.notificationCount = data.length;
    });
  }


}
