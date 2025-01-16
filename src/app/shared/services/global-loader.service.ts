import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
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