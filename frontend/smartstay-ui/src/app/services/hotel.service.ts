import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private baseUrl = 'https://localhost:7094/api/Hotel'; // backend URL

  constructor(private http: HttpClient) { }

  getAllHotels(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createHotel(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getHotelById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateHotel(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}