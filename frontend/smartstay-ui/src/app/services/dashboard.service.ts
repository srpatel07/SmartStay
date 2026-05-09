import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'https://localhost:7094/api/Dashboard';

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get(`${this.baseUrl}/summary`);
  }

  getHotels() {
    return this.http.get(`${this.baseUrl}/hotels`);
  }

  getRecentBookings() {
    return this.http.get(`${this.baseUrl}/recent-bookings`);
  }
}