import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoinsService } from '../../../features/coins/services/coins.service';
import { loadCoinsCount, loadCoinsData, setCoinsCount, setCoinsData } from '../actions/crypto.actions';
import { map, mergeMap, catchError, of } from 'rxjs';

@Injectable()
export class CryptoEffects {
  private actions$: Actions = inject(Actions);
  private coinsService: CoinsService = inject(CoinsService);

  loadCoinsCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCoinsCount),
      mergeMap(() =>
        this.coinsService.getCoinsList().pipe(
          map((coins) => setCoinsCount({ count: coins.length })), 
          catchError(() => {
            return of(setCoinsCount({ count: 0 })); 
          })
        )
      )
    )
  );

  loadCoinsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCoinsData),
      mergeMap(({ pageSize, pageNumber, order, currency }) =>
        this.coinsService.getCoinsMarkets(pageSize, pageNumber, order, currency).pipe(
          map((data) => setCoinsData({ data })),
          catchError(() => {
            return of(setCoinsData({ data: [] })); 
          })
        )
      )
    )
  );

}
