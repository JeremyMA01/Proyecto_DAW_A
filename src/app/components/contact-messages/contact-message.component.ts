import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ContactMessage } from '../../models/contact-message.model';
import { ContactMessageService } from '../../services/contact-message.service';
import { ReusableDialog } from '../reusable_component/reusable-dialog/reusable-dialog';

@Component({
  selector: 'app-contact-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DatePipe, ReusableDialog],
  templateUrl: './contact-message.component.html',
  styleUrls: ['./contact-message.component.css']
})
export class ContactMessageComponent implements OnInit {
  messages: ContactMessage[] = [];
  messageForm!: FormGroup;
  isEditing = false;
  messageToEditId: number | null = null;
  searchTerm = '';
  filteredMessages: ContactMessage[] = [];

  selectedMessage: ContactMessage | null = null;

  recipientOptions = ['Pedro Lopez', 'Ana Garcia', 'Carlos Ruiz', 'Elena Soto', 'Usuario Invitado'];

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' = 'success';

  isConfirmationModalVisible: boolean = false;
  messageToDeleteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: ContactMessageService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
    this.initForm();
  }

  initForm(): void {
    this.messageForm = this.fb.group({
      senderName: ['', Validators.required],
      recipientName: ['', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      priority: ['Normal', Validators.required],
      isUrgent: [false],
      content: ['', Validators.required],  // ← Cambiado de messageContent a content
    });
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe({
      next: data => {
        this.messages = data;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error al cargar los mensajes:', error);
        this.showAlert('Error al cargar los mensajes.', 'danger');
      }
    });
  }

  viewMessage(message: ContactMessage): void {
    this.selectedMessage = message;
  }

  saveMessage(): void {
    if (this.messageForm.invalid) {
      this.showAlert('Por favor, completa todos los campos obligatorios.', 'warning');
      return;
    }

    const formValue = this.messageForm.value;

    if (this.isEditing && this.messageToEditId !== null) {
      const updatedMessage: ContactMessage = {
        ...formValue,
        id: this.messageToEditId,
        sentAt: new Date()  // ← Cambiado de timestamp a sentAt
      };

      this.messageService.updateMessage(updatedMessage).subscribe({
        next: () => {
          this.showAlert('Mensaje actualizado con éxito.', 'success');
          this.loadMessages();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al actualizar el mensaje:', error);
          this.showAlert('Error al actualizar el mensaje.', 'danger');
        }
      });
    } else {
      this.messageService.createMessage(formValue).subscribe({
        next: () => {
          this.showAlert('Mensaje enviado con éxito.', 'success');
          this.loadMessages();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al enviar el mensaje:', error);
          this.showAlert('Error al enviar el mensaje.', 'danger');
        }
      });
    }
  }

  editMessage(message: ContactMessage): void {
    this.isEditing = true;
    this.messageToEditId = message.id ?? null;
    this.messageForm.patchValue({
      senderName: message.senderName,
      recipientName: message.recipientName,
      subject: message.subject,
      priority: message.priority,
      isUrgent: message.isUrgent,
      content: message.content, 
    });
    document.getElementById('messageFormContainer')?.scrollIntoView({ behavior: 'smooth' });
  }

  prepareDelete(id: number | undefined): void {
    if (id === undefined) return;

    this.messageToDeleteId = id;
    this.isConfirmationModalVisible = true;
  }

  confirmDelete(): void {
    const id = this.messageToDeleteId;
    this.isConfirmationModalVisible = false;
    if (id === null || id === undefined) {
      this.showAlert('Error: ID de mensaje no válido para eliminar.', 'danger');
      return;
    }

    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.showAlert('Mensaje eliminado con éxito.', 'success');
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error al eliminar el mensaje:', error);
        this.showAlert('Error al eliminar el mensaje.', 'danger');
      }
    });
  }

  cancelDelete(): void {
    this.isConfirmationModalVisible = false;
    this.messageToDeleteId = null;
  }

  resetForm(): void {
    this.isEditing = false;
    this.messageToEditId = null;
    this.messageForm.reset({
      priority: 'Normal',
      isUrgent: false
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMessages = this.messages.filter(msg =>
      msg.subject.toLowerCase().includes(term) ||
      msg.senderName.toLowerCase().includes(term) ||
      msg.recipientName.toLowerCase().includes(term)
    );
  }

  showAlert(message: string, type: 'success' | 'danger' | 'warning'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }
}