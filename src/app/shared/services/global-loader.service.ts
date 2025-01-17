import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
// in case we want a global loader this service could be used.
export class GlobalLoaderService {
    private loaderVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isGlobalLoaderVisible$ = this.loaderVisibleSubject.asObservable();

    show(): void {
        this.loaderVisibleSubject.next(true);
    }

    hide() {
        this.loaderVisibleSubject.next(false);
    }

    ngOnDestroy(): void {
        this.loaderVisibleSubject.complete(); // Clean up the BehaviorSubject
      }
}