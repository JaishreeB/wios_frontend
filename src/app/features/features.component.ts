import { Component } from '@angular/core';

@Component({
  selector: 'features',
  imports: [],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {

  features = [
    {
      title: 'Vendor Service',
      description: 'Manage and store vendor contact information securely.',
      icon: 'fas fa-address-book'
    },
    {
      title: 'Stock Service',
      description: 'Track inventory levels, stock movements, and availability.',
      icon: 'fas fa-boxes'
    },
    {
      title: 'Zone Service',
      description: 'Organize warehouse zones for efficient storage and retrieval.',
      icon: 'fas fa-th-large'
    },
    {
      title: 'Transaction Service',
      description: 'Monitor inbound and outbound transactions in real-time.',
      icon: 'fas fa-exchange-alt'
    },
    {
      title: 'Metrics Feature',
      description: 'Calculate turnover rates and space utilization metrics.',
      icon: 'fas fa-chart-line'
    }
  ];


}
