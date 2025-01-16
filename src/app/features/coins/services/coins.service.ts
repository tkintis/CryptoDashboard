import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Coin, CoinData } from '../models/coins.model';

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

  getCoinsMarkets(pageSize: number, pageNumber: number): Observable<CoinData[]> {
    return this.http.get<any[]>(`${this.coinsMarketsUrl}?vs_currency=usd&order=market_%20cap_desc&per_page=${pageSize}&page=${pageNumber}&sparkline=false`);
  }
}