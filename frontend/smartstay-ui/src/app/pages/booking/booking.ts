import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { Modal } from '../../shared/modal/modal';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {

  roomId!: number;
  hotelId!: number;
  room: any;
  loading = true;

  guestName: string = '';
  guestEmail: string = '';
  guestPhone: string = '';

  adults: number = 1;
  children: number = 0;
  roomsBooked: number = 1;
  specialRequest: string = '';

  checkInDate: string = '';
  checkOutDate: string = '';

  today!: string;

  errorMessage: string = '';
  successMessage: string = '';

  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' | 'confirm' = 'success';

  isBooking = false;
  isLoggedIn = false;

  bookNow() {

    this.errorMessage = '';
    this.isBooking = true;
    this.successMessage = '';

    if (!this.guestName || !this.guestEmail || !this.guestPhone) {
      this.errorMessage = "Please fill all guest details";
      this.isBooking = false;
      return;
    }

    if (!this.checkInDate || !this.checkOutDate) {
      this.errorMessage = "Please select dates";
      this.isBooking = false;
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (this.checkInDate < this.today) {
      this.errorMessage = "Check-in cannot be in past";
      this.isBooking = false;
      return;
    }

    if (this.checkOutDate <= this.checkInDate) {
      this.errorMessage = "Check-out must be after check-in";
      this.isBooking = false;
      return;
    }

    if (this.calculateNights() === 0) {
      this.errorMessage = "Minimum 1 night booking required";
      this.isBooking = false;
      return;
    }

    if (!this.room) {
      this.errorMessage = "Room not loaded yet";
      this.isBooking = false;
      return;
    }

    const bookingData = {
      userId: 0,
      guestName: this.guestName,
      guestEmail: this.guestEmail,
      guestPhone: this.guestPhone,

      hotelId: this.hotelId,
      roomId: this.roomId,

      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,

      adults: this.adults || 1,
      children: this.children || 0,
      roomsBooked: this.roomsBooked || 1,
      specialRequest: this.specialRequest || null
    };

    if (this.roomsBooked > this.room.availableRooms) {
      this.modalTitle = 'Not Available';
      this.modalMessage = `Only ${this.room.availableRooms} rooms left`;
      this.modalType = 'error';
      this.showModal = true;
      this.isBooking = false;
      return;
    }

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        this.isBooking = false;

        this.modalTitle = 'Success';
        this.modalMessage = 'Booking successful! You can view it in My Bookings.';
        this.modalType = 'success';
        this.showModal = true;

        this.cdr.detectChanges(); // forces UI refresh
      },
      error: (err) => {
        this.isBooking = false;
        this.modalTitle = 'Error';
        this.modalMessage =
          err.error?.data?.message || err.error?.message || "Booking failed";
        this.modalType = 'error';
        this.showModal = true;
      }
    });
  }

  goToMyBookings() {
    this.router.navigate(['/my-bookings']);
  }

  isPastDate(date: string): boolean {
    const selected = new Date(date);
    const today = new Date(this.today);

    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selected < today;
  }

  onDateChange() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.checkInDate) return;

    const today = new Date(this.today);
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    today.setHours(0, 0, 0, 0);
    checkIn.setHours(0, 0, 0, 0);
    if (this.checkOutDate) checkOut.setHours(0, 0, 0, 0);

    // past date block
    if (checkIn < today) {
      this.errorMessage = "Check-in cannot be in past";
      this.checkInDate = '';
      this.cdr.detectChanges(); // force UI
      return;
    }

    // checkout validation
    if (this.checkOutDate && checkOut <= checkIn) {
      this.errorMessage = "Check-out must be after check-in";
      this.checkOutDate = '';
      this.cdr.detectChanges(); // force UI
      return;
    }

    this.cdr.detectChanges();
  }

  calculateTotal(): number {
    if (!this.checkInDate || !this.checkOutDate || !this.room) return 0;

    const inDate = new Date(this.checkInDate);
    const outDate = new Date(this.checkOutDate);

    const nights = Math.ceil(
      (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return nights > 0 ? nights * this.room.pricePerNight : 0;
  }

  calculateNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;

    const inDate = new Date(this.checkInDate);
    const outDate = new Date(this.checkOutDate);

    const nights = Math.ceil(
      (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return nights > 0 ? nights : 0;
  }

  handleSuccessConfirm() {
    this.showModal = false;
    this.router.navigate(['/my-bookings']);
  }

  closeSuccess() {
    this.successMessage = '';
  }

  closeModal() {
    this.showModal = false;
  }

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private bookingService: BookingService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  loadUserFromToken() {

    const token = this.authService.getToken();

    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log('JWT Payload:', payload); // IMPORTANT

      this.guestName =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';

      this.guestEmail =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';

      // phone not in token → keep empty
      this.guestPhone = '';

    } catch (e) {
      console.error('Invalid token');
    }
  }

  ngOnInit(): void {

    this.isLoggedIn = !!this.authService.getToken();

    this.loadUserFromToken();

    this.today = new Date().toISOString().split('T')[0];

    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    this.hotelId = Number(this.route.snapshot.queryParamMap.get('hotelId'));

    this.roomService.getRoomById(this.roomId).subscribe({
      next: (res: any) => {
        this.room = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}