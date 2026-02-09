
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donacion } from '../../models/Donacion';

@Injectable({
  providedIn: 'root'
})
export class ServDonaciones {
  private apiUrl = 'http://localhost:5005/api/Donations';

  constructor(private http: HttpClient) { }


  getDonaciones(): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(this.apiUrl);
  }

  getDonacion(id: number): Observable<Donacion> {
    return this.http.get<Donacion>(`${this.apiUrl}/${id}`);
  }

  addDonacion(donacion: Donacion): Observable<Donacion> {
    const donationDate = donacion.donationDate 
      ? new Date(donacion.donationDate).toISOString()
      : new Date().toISOString();
    
    const donacionToSend = {
      title: donacion.title || '',
      author: donacion.author || '',
      year: Number(donacion.year),
      estado: donacion.estado || 'Nuevo',
      donationDate: this.formatDateForApi(donacion.donationDate), // Formato ISO
      donatedBy: donacion.donatedBy || '',
      convertedToInventory: false,
      categoryId: Number(donacion.categoryId),
      active: true 
    };

    console.log('Enviando donación:', donacionToSend);
    return this.http.post<Donacion>(this.apiUrl, donacionToSend);
  }

  private formatDateForApi(dateString: string): string {
    if (!dateString) return new Date().toISOString();
    
    const date = new Date(dateString);

    const today = new Date();
    if (date > today) {
      return today.toISOString();
    }
    
    return date.toISOString();
  }

  updateDonacion(donacion: Donacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${donacion.id}`, donacion);
  }

  deleteDonacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateDonacion(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activate/${id}`, {});
  }


  getDonacionesActivas(): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(`${this.apiUrl}/active`);
  }


  searchDonaciones(search: string): Observable<Donacion[]> {
    const params = new HttpParams().set('search', search);
    return this.http.get<Donacion[]>(`${this.apiUrl}/search`, { params });
  }

  convertToInventory(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/convert-to-inventory/${id}`, {});
  }

  getDonacionesNoConvertidas(): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(`${this.apiUrl}/not-converted`);
  }
}