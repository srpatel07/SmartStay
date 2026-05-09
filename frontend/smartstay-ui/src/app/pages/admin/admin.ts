import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {

  totalHotels = 0;
  totalRooms = 0;
  totalBookings = 0;
  totalRevenue = 0;

  bookings: any[] = [];
  updatingId: number | null = null;

  constructor(
    private dashboardService: DashboardService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {

    // Summary API
    this.dashboardService.getSummary().subscribe({
      next: (res: any) => {
        const data = res?.data;

        this.totalHotels = data?.totalHotels || 0;
        this.totalRooms = data?.totalRooms || 0;
        this.totalBookings = data?.totalBookings || 0;
        this.totalRevenue = data?.totalRevenue || 0;
      }
    });

    // Recent bookings
    this.dashboardService.getRecentBookings().subscribe({
      next: (res: any) => {
        this.bookings = res?.data || [];
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.updatingId = id;

    this.bookingService.updateBookingStatus(id, status).subscribe({
      next: () => {
        const booking = this.bookings.find(b => b.bookingId === id);

        if (booking) {
          booking.bookingStatus = status;
        }

        this.updatingId = null;
      },
      error: (err) => {
        console.error('Status update failed', err);
        this.updatingId = null;
      }
    });
  }

  updatePayment(id: number, status: string) {
    this.updatingId = id;

    this.bookingService.updatePaymentStatus(id, status).subscribe({
      next: () => {
        const booking = this.bookings.find(b => b.bookingId === id);

        if (booking) {
          booking.paymentStatus = status;
        }

        this.updatingId = null;
      },
      error: (err) => {
        console.error('Payment update failed', err);
        this.updatingId = null;
      }
    });
  }
}