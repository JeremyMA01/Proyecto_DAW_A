import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
  private apiUrl = '/api/messages'; 

  constructor(private http: HttpClient) {}

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl).pipe(
      map(messages => {
        return messages.sort((a, b) => {
          const dateA = new Date(a.sentAt).getTime();
          const dateB = new Date(b.sentAt).getTime();
          return dateB - dateA;
        });
      })
    );
  }

  createMessage(message: Omit<ContactMessage, 'id' | 'sentAt'>): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.apiUrl, message);
  }

  updateMessage(updatedMessage: ContactMessage): Observable<ContactMessage> {
    const url = `${this.apiUrl}/${updatedMessage.id}`;
    return this.http.put<ContactMessage>(url, updatedMessage);
  }

  deleteMessage(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // Opcional: si quieres marcar como leído (agrega el endpoint en el backend si lo necesitas)
  markAsRead(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}/read`;
    return this.http.put<void>(url, {});
  }
}