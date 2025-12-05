import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
  private messagesUrl = 'json/contact-messages.json'; 
  private messages: ContactMessage[] = [];
  private nextId = 1;

  constructor(private http: HttpClient) {
    this.http.get<ContactMessage[]>(this.messagesUrl).subscribe(data => {
      this.messages = data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp) 
      }));
      if (this.messages.length > 0) {
        this.nextId = Math.max(...this.messages.map(m => m.id)) + 1;
      }
    });
  }

  createMessage(message: Omit<ContactMessage, 'id' | 'timestamp'>): Observable<ContactMessage> {
    const newMessage: ContactMessage = {
      ...message,
      id: this.nextId++,
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return of(newMessage);
  }

  getMessages(): Observable<ContactMessage[]> {
    return of([...this.messages]);
  }

  getMessageById(id: number): Observable<ContactMessage | undefined> {
    const message = this.messages.find(m => m.id === id);
    return of(message);
  }

  updateMessage(updatedMessage: ContactMessage): Observable<ContactMessage> {
    const index = this.messages.findIndex(m => m.id === updatedMessage.id);
    if (index > -1) {
      this.messages[index] = { ...updatedMessage, timestamp: this.messages[index].timestamp }; // Conserva el timestamp original
      return of(this.messages[index]);
    }
    return of(null as any); 
  }

  deleteMessage(id: number): Observable<boolean> {
    const initialLength = this.messages.length;
    this.messages = this.messages.filter(m => m.id !== id);
    return of(this.messages.length < initialLength);
  }
}