import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION = 3000;

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) { }

  success(msg: string, duration?: number) {
    this.snackBar.open(msg, 'SUCCESS', {duration: duration || DURATION});
  }

  error(msg: string, duration?: number) {
    this.snackBar.open(msg, 'ERROR', {duration: duration || DURATION});
  }
}
