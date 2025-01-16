import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoggingService } from './logging.service';

// NavigationService is usefull to handle all navigations in a common place. Now is not used but will be used in the future!
@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private router: Router = inject(Router);
    private loggingService: LoggingService = inject(LoggingService);

    navigate(url: string): void {
        this.loggingService.log('navigate: navigatedTo', url);
        this.router.navigateByUrl(url);
    }

    navigateWithParameters(url: string, parameters: unknown): void {
        this.loggingService.log('navigateWithParameters: navigatedTo', url, 'withParameters', parameters);

        const navigationExtras: NavigationExtras = {
            state: {
                data: parameters
            }
        };

        this.router.navigate([url], navigationExtras);
    }
}