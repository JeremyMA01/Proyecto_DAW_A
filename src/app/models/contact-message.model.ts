
export interface ContactMessage {
  id: number;
  senderName: string;
  recipientName: string;
  subject: string;
  priority: 'Baja' | 'Normal' | 'Urgente';
  isUrgent: boolean;
  content: string;     // ← Cambiado de messageContent
  sentAt: Date;        // ← Cambiado de timestamp
  isRead?: boolean;    // Opcional, si quieres usarlo
}