import { Component, OnInit } from '@angular/core';
import { AdminNotification, NotificationService } from '../notification.service';
import { CommonServiceService } from '../common-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  isAdmin: boolean = false;
  notifications: AdminNotification[] = [];
  showPanel: boolean = false;
  constructor(private notificationService: NotificationService, private commonService: CommonServiceService) {

  }


  ngOnInit(): void {
    this.isAdmin = this.commonService.getUserRole() === 'ADMIN';
    if (this.isAdmin) {
      this.loadNotifications();
    }
  }


  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      // this.notificationService.notificationCount = data.length;

      // localStorage.setItem('lastSeenNotificationCount', data.length.toString());

    });
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.notificationId !== id);
      this.notificationService.notificationCount = this.notifications.length;
    });
  }




}
