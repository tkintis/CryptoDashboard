import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ToastService } from "../../shared/services/toast.service";
import { inject } from "@angular/core";
import { LoggingService } from "../../shared/services/logging.service";

export function globalErrorHandlerInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const toastService: ToastService = inject(ToastService);
    const loggingService: LoggingService = inject(LoggingService);

    return next(req).pipe(
        catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse instanceof HttpErrorResponse) {
                const title: string = `Error: ${errorResponse.status}`;
                const message: string = errorResponse.message;

                loggingService.error(title, message);
                toastService.error('Error fetching data. Please try again later');
            } else {
                // Handle non-HTTP errors
                toastService.error('An error occurred');
                loggingService.error('An error occurred', errorResponse);
            }

            // Return the error using throwError
            return throwError(() => errorResponse) as Observable<HttpEvent<unknown>>;
        })
    );
}