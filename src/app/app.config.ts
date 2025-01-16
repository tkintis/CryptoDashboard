import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { cryptoReducer } from './shared/store/reducers/crypto.reducer';
import { CryptoEffects } from './shared/store/effects/crypto.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts';
import { globalErrorHandlerInterceptor } from './core/interceptors/global-error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([globalErrorHandlerInterceptor])),
    provideStore({ crypto: cryptoReducer }), 
    provideEffects(CryptoEffects),
    provideStoreDevtools({
      maxAge: 75, // Retains last 75 states
      logOnly: isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }, // Configure ECharts globally
    },
  ]
  
};
