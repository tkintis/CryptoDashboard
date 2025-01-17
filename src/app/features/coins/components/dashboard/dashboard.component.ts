import { AsyncPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { NgxEchartsModule } from 'ngx-echarts';
import { Observable } from 'rxjs';
import { formatLargeNumber } from '../../../../shared/helpers/format-large-number.helper';
import { loadCoinsCount, loadCoinsData } from '../../../../shared/store/actions/crypto.actions';
import { selectCoinsCount, selectCoinsData } from '../../../../shared/store/selectors/crypto.selectors';
import { HeaderComponent } from '../../../header/header.component';
import { CoinData } from '../../models/coins.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { createFilterPredicate } from '../../../../shared/helpers/filter-predicate.helper';
import type { EChartsOption } from 'echarts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [MatPaginatorModule, MatTableModule, AsyncPipe, DecimalPipe, HeaderComponent, NgxEchartsModule, MatProgressSpinnerModule, MatSortModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule, MatMenuModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    coinsCount$: Observable<number>;
    coinsData$: Observable<CoinData[]>;
    coinsData: WritableSignal<MatTableDataSource<CoinData, MatPaginator>> = signal<MatTableDataSource<CoinData>>(new MatTableDataSource<CoinData>([]));

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
    pageSize: WritableSignal<number> = signal(10);
    pageNumber: number = 1;
    chartInitialized: boolean = false;
    chartOptions: WritableSignal<EChartsOption> = signal<EChartsOption>({});
    isLoading: WritableSignal<boolean> = signal(false);
    filterValues: { [key: string]: string } = {};
    globalFilter: string = '';

    //#region Refs
    private destroyRef: DestroyRef = inject(DestroyRef);
    private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
    //#endregion

    private store: Store = inject(Store);

    constructor() {
        this.coinsCount$ = this.store.select(selectCoinsCount);
        this.coinsData$ = this.store.select(selectCoinsData);
    }

    ngOnInit(): void {
        this.store.dispatch(loadCoinsCount());
        this.nextPage();

        this.coinsData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            this.coinsData().data = data;
            this.isLoading.set(false);
            this.cd.markForCheck();

            this.coinsData().filterPredicate = createFilterPredicate<CoinData>();

            this.populateTopCryptos(data);
        });
    }

    ngAfterViewInit(): void {
        this.coinsData().sort = this.sort;
        this.cd.markForCheck();
    }

    populateTopCryptos(data: CoinData[]) {
        if (!this.chartInitialized && data.length > 0) {
            const topCryptos = data.slice(0, 10); // Ensure only top 10 are considered
            this.prepareChart(topCryptos);
            this.chartInitialized = true;
            this.cd.markForCheck();
        }
    }

    nextPage(): void {
        this.isLoading.set(true);
        this.store.dispatch(
            loadCoinsData({ pageSize: this.pageSize(), pageNumber: this.pageNumber })
        );
    }

    onPageChange(event: PageEvent): void {
        this.pageSize.set(event.pageSize);
        this.pageNumber = event.pageIndex + 1;
        this.nextPage();
    }

    applyColumnFilter(event: Event, column: string): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterValues[column] = filterValue;
        this.applyCombinedFilters();
    }

    applyGlobalFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.globalFilter = filterValue;
        this.applyCombinedFilters();
    }

    applyCombinedFilters(): void {
        this.coinsData().filter = JSON.stringify({
            columnFilters: this.filterValues,
            globalFilter: this.globalFilter,
        });
    }

    prepareChart(data: CoinData[]): void {
        this.chartOptions.set({
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
                data: data.map((coin) => coin.symbol.toUpperCase()),
            },
            yAxis: {
                type: 'value',
                name: 'Market Cap ($)',
                axisLabel: {
                    formatter: formatLargeNumber
                },

            },
            grid: {
                left: '0%',
                right: '0%',
                top: '20%',
                bottom: '5%',
                containLabel: true,
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
        })
    }

}
