import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    
  message = signal<string | null>(null);
  type = signal<NotificationType>('success');
  show = signal<boolean>(false);

  showNotification(msg: string, type: NotificationType = 'success') {
    this.message.set(msg);
    this.type.set(type);
    this.show.set(true);

    setTimeout(() => {
      this.show.set(false);
    }, 3000);
  }
}