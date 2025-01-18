import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Coin, CoinData } from '../models/coins.model';
import { Currency } from '../../../shared/enums/currency.enum';

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  private coinsListUrl = `${environment.apiUrl}/v3/coins/list`;
  private coinsMarketsUrl = `${environment.apiUrl}/v3/coins/markets`;

  constructor(private http: HttpClient) { }

  getCoinsList(): Observable<Coin[]> {
    return this.http.get<Coin[]>(this.coinsListUrl);
  }

  getCoinsMarkets(pageSize: number, pageNumber: number, order: string = 'market_cap_desc', currency: Currency = environment.defaultCurrency): Observable<CoinData[]> {
    return this.http.get<any[]>(`${this.coinsMarketsUrl}?vs_currency=${currency}&order=${order}&per_page=${pageSize}&page=${pageNumber}&sparkline=false`);
  }
}