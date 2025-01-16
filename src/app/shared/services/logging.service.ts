import { Injectable, isDevMode } from '@angular/core';

// LoggingService is usefull to log events based on architecture: eg log files or firebase or whatever
@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    log(message?: any, ...optionalParams: any[]): void {
        if (isDevMode()) {
            console.log(message, optionalParams);
        }
    }

    error(message?: any, ...optionalParams: any[]): void {
        if (isDevMode()) {
            console.error(message, optionalParams);
        }
    }

    warn(message?: any, ...optionalParams: any[]): void {
        if (isDevMode()) {
            console.warn(message, optionalParams);
        }
    }
}