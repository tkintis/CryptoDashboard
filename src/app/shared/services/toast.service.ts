import { inject, Injectable } from '@angular/core';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private readonly duration = 10000;
    private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    private readonly verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    private _snackBar: MatSnackBar = inject(MatSnackBar);

    success(message: string): void {
        this._snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.duration,
            panelClass: ['success-snackbar']
        });
    }

    error(message: string): void {
        this._snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.duration,
            panelClass: ['error-snackbar']
        });
    }

    info(message: string): void {
        this._snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.duration,
            panelClass: ['info-snackbar']
        });
    }

    warn(message: string): void {
        this._snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.duration,
            panelClass: ['warn-snackbar']
        });
    }
}