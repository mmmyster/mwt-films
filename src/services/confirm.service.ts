import { Injectable, inject } from '@angular/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '../app/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data});

    return dialogRef.afterClosed();
  }
}
