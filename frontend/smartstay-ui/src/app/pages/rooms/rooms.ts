import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms implements OnInit {

  rooms: any[] = [];
  loading = true;
  hotelId!: number;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loading = true;

    this.route.paramMap.subscribe(params => {

      const hotelId = Number(params.get('hotelId'));
      this.hotelId = Number(params.get('hotelId'));

      console.log('Hotel ID:', hotelId); // DEBUG

      if (!this.hotelId) {
        console.error('Invalid hotelId');
        this.loading = false;
        return;
      }

      this.roomService.getRoomsByHotel(this.hotelId).subscribe({
        next: (res: any) => {

          console.log('Rooms API response:', res);

          this.rooms = Array.isArray(res) ? res : [];

          console.log('Rooms array AFTER assign:', this.rooms); // correct place

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Room fetch error:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });

    });
  }
}