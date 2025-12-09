import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../models/contact-message.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
  private apiUrl = 'http://localhost:3000/ContactMessages';

  
  constructor(private http: HttpClient) {
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl).pipe(
      map(messages => {
        return messages.sort((a, b) => {
          const dateA = new Date(a.timestamp as unknown as string).getTime();
          const dateB = new Date(b.timestamp as unknown as string).getTime();
          return dateB - dateA;
        });
      })
    );
  }

  createMessage(message: Omit<ContactMessage, 'id' | 'timestamp'>): Observable<ContactMessage> {
    const newMessage = {
      ...message,
      timestamp: new Date().toISOString()
    };
    return this.http.post<ContactMessage>(this.apiUrl, newMessage);
  }

  updateMessage(updatedMessage: ContactMessage): Observable<ContactMessage> {
    const url = `${this.apiUrl}/${updatedMessage.id}`;
    const messageToSend = {
      ...updatedMessage,
      timestamp: new Date().toISOString()
    };
    return this.http.put<ContactMessage>(url, messageToSend);
  }

  deleteMessage(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      map(() => true)
    );
  }
  
  getMessageById(id: number): Observable<ContactMessage | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ContactMessage>(url); 
  }
}