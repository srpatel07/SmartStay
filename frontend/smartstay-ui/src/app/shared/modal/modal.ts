import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal {

  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'confirm' = 'success';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
    this.close();
  }

  close() {
    this.onClose.emit();
  }
}