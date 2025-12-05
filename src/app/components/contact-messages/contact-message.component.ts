import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Agregamos DatePipe aquí
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ¡Importación necesaria!
import { ContactMessage } from '../../models/contact-message.model';
import { ContactMessageService } from '../../services/contact-message.service';

@Component({
  selector: 'app-contact-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, DatePipe],
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
      messageContent: ['', Validators.required],
    });
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe(data => {
      this.messages = data;
      this.applyFilter();
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
        timestamp: new Date() 
      };
      this.messageService.updateMessage(updatedMessage).subscribe(
        () => {
          this.showAlert('Mensaje actualizado con éxito.', 'success');
          this.loadMessages();
          this.resetForm();
        },
        () => this.showAlert('Error al actualizar el mensaje.', 'danger')
      );
    } else {
      this.messageService.createMessage(formValue).subscribe(
        () => {
          this.showAlert('Mensaje enviado con éxito.', 'success');
          this.loadMessages();
          this.resetForm();
        },
        () => this.showAlert('Error al enviar el mensaje.', 'danger')
      );
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
      messageContent: message.messageContent,
    });
    document.getElementById('messageFormContainer')?.scrollIntoView({ behavior: 'smooth' });
  }

  deleteMessage(id: number | undefined): void {
    if (id === undefined) return;


    console.warn(`[INFO] Eliminación del mensaje ID ${id} iniciada. Se requiere un modal de confirmación UI.`);
    
    this.messageService.deleteMessage(id).subscribe(
      success => {
        if (success) {
          this.showAlert('Mensaje eliminado con éxito.', 'success');
          this.loadMessages();
        } else {
          this.showAlert('Error: No se encontró el mensaje a eliminar.', 'danger');
        }
      },
      () => this.showAlert('Error en la operación de eliminación.', 'danger')
    );
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