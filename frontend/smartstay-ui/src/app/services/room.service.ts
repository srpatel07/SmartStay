import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private baseUrl = 'https://localhost:7094/api/Room';

  constructor(private http: HttpClient) {}

  getRoomsByHotel(hotelId: number) {
    return this.http.get<any>(`${this.baseUrl}/hotel/${hotelId}`);
  }

  getRoomById(roomId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${roomId}`);
  }
}