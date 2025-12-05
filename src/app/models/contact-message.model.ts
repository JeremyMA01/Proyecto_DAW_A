
export interface ContactMessage {
  id: number; 
  senderName: string; 
  recipientName: string; 
  subject: string; 
  priority: 'Baja' | 'Normal' | 'Urgente'; 
  isUrgent: boolean; 
  messageContent: string; 
  timestamp: Date; 
}