import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data:ConfirmDialogData){}
  
}

export interface ConfirmDialogData {
  title: string,
  question: string
}