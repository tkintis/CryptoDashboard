import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { finalize, Observable } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoinData } from '../../models/coins.model';
import { selectCoinsCount, selectCoinsData } from '../../../../shared/store/selectors/crypto.selectors';
import { loadCoinsCount, loadCoinsData } from '../../../../shared/store/actions/crypto.actions';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { formatLargeNumber } from '../../../../shared/helpers/format-large-number.helper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Actions, ofType } from '@ngrx/effects';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [MatPaginatorModule, MatTableModule, AsyncPipe, DecimalPipe, HeaderComponent, NgxEchartsModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    coinsCount$: Observable<number>;
    coinsData$: Observable<CoinData[]>;
    coinsData: MatTableDataSource<CoinData> = new MatTableDataSource<CoinData>([]);

    displayedColumns: string[] = [
        'id',
        'name',
        'symbol',
        'current_price',
        'market_cap',
        'total_volume',
        'high_24h',
        'low_24h',
        'price_change_percentage_24h',
        'circulating_supply',
    ];
    pageSize: number = 10;
    pageNumber: number = 1;
    chartInitialized: boolean = false;
    chartOptions: any;
    isLoading: boolean = false;

  //#region Refs
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  //#endregion
  private actions$: Actions = inject(Actions);

    constructor(private store: Store) {
        this.coinsCount$ = this.store.select(selectCoinsCount);
        this.coinsData$ = this.store.select(selectCoinsData);
    }

    ngOnInit(): void {
        this.store.dispatch(loadCoinsCount());
        this.nextPage();

        this.coinsData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            this.coinsData.data = data;
            this.isLoading = false;

             // Only initialize chart the first time
             if (!this.chartInitialized && data.length > 0) {
                const topCryptos = data.slice(0, 10); // Ensure only top 10 are considered
                this.prepareChart(topCryptos);
                this.chartInitialized = true;
                this.cd.markForCheck();
            }
        });
    }


    nextPage(): void {
        this.isLoading = true;
        this.store.dispatch(
            loadCoinsData({ pageSize: this.pageSize, pageNumber: this.pageNumber })
        );
    }

    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.pageNumber = event.pageIndex + 1;
        this.nextPage();
    }

    prepareChart(data: CoinData[]): void {
        this.chartOptions = {
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const coin = data[params.dataIndex];
                    return `
                    <strong>${coin.name} (${coin.symbol.toUpperCase()})</strong><br>
                    <hr>
                    <strong>Market Cap:</strong> $${coin.market_cap.toLocaleString()}<br>
                    <strong>Current Price:</strong> $${coin.current_price.toLocaleString()}<br>
                    <strong>24h High:</strong> $${coin.high_24h.toLocaleString()}<br>
                    <strong>24h Low:</strong> $${coin.low_24h.toLocaleString()}<br>
                    <strong>Price Change (24h):</strong> ${coin.price_change_percentage_24h.toFixed(2)}%<br>
                    <strong>Total Volume:</strong> $${coin.total_volume.toLocaleString()}
                  `;
                },
            },
            xAxis: {
                type: 'category',
                data: data.map((coin) => coin.name),
            },
            yAxis: {
                type: 'value',
                name: 'Market Cap ($)',
                axisLabel: {
                    formatter: formatLargeNumber
                },
    
            },
            series: [
                {
                    data: data.map((coin) => coin.market_cap),
                    type: 'bar',
                    itemStyle: {
                        color: 'rgb(2,17,71)',
                      },
                },
            ],
        };
    }

}
