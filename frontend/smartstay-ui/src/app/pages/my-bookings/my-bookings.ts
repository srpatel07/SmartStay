import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { RoomService } from '../../services/room.service';
import { Modal } from '../../shared/modal/modal';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})


export class MyBookings implements OnInit {

  guestEmail: string = '';
  guestPhone: string = ''; 

  errorMessage: string = '';

  bookings: any[] = [];
  loading = false;

  showModal = false;
  selectedBookingId: number | null = null;
  
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' | 'confirm' = 'confirm';

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  fetchBookings() {

  this.errorMessage = '';
  this.bookings = [];

  if (!this.guestEmail || !this.guestPhone) {
    this.errorMessage = "Enter email and phone";
    return;
  }
  
  this.loading = true;

  this.bookingService.getMyBookings(this.guestEmail, this.guestPhone).subscribe({
    next: (res: any) => {
      this.bookings = res.data || [];
      this.loading = false;
      this.cdr.detectChanges(); // force UI refresh
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = err.error?.message || "Failed to fetch bookings";
      this.cdr.detectChanges(); // force UI refresh
    }
  });
  }

  openCancelModal(bookingId: number) {
    this.selectedBookingId = bookingId;

    this.modalTitle = 'Cancel Booking';
    this.modalMessage = 'Are you sure you want to cancel this booking?';
    this.modalType = 'confirm';

    this.showModal = true;
  }

  confirmCancel() {
  if (!this.selectedBookingId) return;

  this.bookingService.cancelBooking(this.selectedBookingId)
    .subscribe({
      next: () => {
        this.modalTitle = 'Success';
        this.modalMessage = 'Booking cancelled successfully';
        this.modalType = 'success';

        this.loadUserBookings();
      },
      error: () => {
        this.modalTitle = 'Error';
        this.modalMessage = 'Failed to cancel booking';
        this.modalType = 'error';
      }
    });
  }

  loadUserBookings() {

    this.loading = true;
    this.errorMessage = '';

    this.bookingService.getUserBookings().subscribe({
      next: (res: any) => {
        this.bookings = res.data || [];

        // attach room detail        
        this.bookings.forEach((b: any) => {
          this.roomService.getRoomById(b.RoomId).subscribe({
            next: (room: any) => {
              b.roomDetails = room;
              this.cdr.detectChanges();
            }
          });
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || "Failed to load bookings";
        this.cdr.detectChanges();
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }
  
  ngOnInit(): void {
    this.loadUserBookings();
  }
}

