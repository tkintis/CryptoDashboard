import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { NgxEchartsModule } from 'ngx-echarts';
import { distinctUntilChanged, Observable } from 'rxjs';
import { formatLargeNumber } from '../../../../shared/helpers/format-large-number.helper';
import { loadCoinsCount, loadCoinsData } from '../../../../shared/store/actions/crypto.actions';
import { selectCoinsCount, selectCoinsData, selectCurrency } from '../../../../shared/store/selectors/crypto.selectors';
import { HeaderComponent } from '../../../header/header.component';
import { CoinData } from '../../models/coins.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { createFilterPredicate } from '../../../../shared/helpers/filter-predicate.helper';
import { env, type EChartsOption } from 'echarts';
import { Currency } from '../../../../shared/enums/currency.enum';
import { CURRENCY_CONFIG } from '../../../../shared/config/currency.config';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [MatPaginatorModule, MatTableModule, AsyncPipe, DecimalPipe, HeaderComponent, NgxEchartsModule, MatProgressSpinnerModule, MatSortModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule, MatMenuModule, MatButtonModule, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    coinsCount$: Observable<number>;
    coinsData$: Observable<CoinData[]>;
    coinsData: WritableSignal<MatTableDataSource<CoinData, MatPaginator>> = signal<MatTableDataSource<CoinData>>(new MatTableDataSource<CoinData>([]));

    pageSizeOptions: WritableSignal<number[]> = signal(environment.pageSizeOptions);
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
    chartOptions: WritableSignal<EChartsOption> = signal<EChartsOption>({});
    isLoading: WritableSignal<boolean> = signal(false);
    filterValues: { [key: string]: string } = {};
    globalFilter: string = '';
    topCryptos: CoinData[] = [];
    sortOrder!: string;
    selectedCurrency: Currency = environment.defaultCurrency;
    selectedCurrencySymbol: string = CURRENCY_CONFIG[environment.defaultCurrency].symbol;
    selectedCurrencyLocale: string = CURRENCY_CONFIG[environment.defaultCurrency].locale;
    selectedCurrencyChanged: boolean = false;

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
        this.store.select(selectCurrency).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((currency) => {
            this.selectedCurrency = currency;
            this.selectedCurrencySymbol = CURRENCY_CONFIG[currency].symbol;
            this.selectedCurrencyLocale = CURRENCY_CONFIG[currency].locale;
            this.resetToFirstPage();
            this.selectedCurrencyChanged = true;
            this.cd.markForCheck();
        });

        this.store.dispatch(loadCoinsCount());
        this.nextPage();

        this.coinsData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            this.coinsData().data = data;
            this.isLoading.set(false);
            this.coinsData().filterPredicate = createFilterPredicate<CoinData>();

            this.cd.markForCheck();

            if (this.selectedCurrencyChanged || this.topCryptos.length === 0) {
                this.topCryptos = data;
                this.populateTopCryptos();
                this.selectedCurrencyChanged = false;
            }
        });
    }

    ngAfterViewInit(): void {
        this.coinsData().sort = this.sort;
        this.sort.sortChange.pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged((prev, curr) => prev.active === curr.active && prev.direction === curr.direction)).subscribe((sort: Sort) => {
            this.onSortChange(sort);
        });
        this.cd.markForCheck();
    }

    populateTopCryptos() {
        if (this.topCryptos.length === 0) {
            this.chartOptions.set({
                graphic: {
                    type: 'text',
                    left: 'center',
                    top: 'middle',
                    style: {
                        text: 'No data available',
                        fontSize: 18,
                        fontWeight: 'bold',
                        fill: 'gray',
                    },
                },
            });
            return;
        }

        if (this.topCryptos.length > 0) {
            const topCryptos = this.topCryptos.slice(0, 10); // Ensure only top 10 are considered
            this.prepareChart(topCryptos);
            this.cd.markForCheck();
        }
    }

    nextPage(): void {
        this.isLoading.set(true);
        this.store.dispatch(
            loadCoinsData({ pageSize: this.pageSize(), pageNumber: this.pageNumber, order: this.sortOrder, currency: this.selectedCurrency })
        );
    }

    onSortChange(sort: Sort): void {
        const column = sort.active;
        const direction = sort.direction || 'desc';
        this.sortOrder = `${column}_${direction}`;
        this.resetToFirstPage();
        this.cd.markForCheck();
    }

    resetToFirstPage() {
        this.pageNumber = 1;
        if (this.paginator) {
            this.paginator.pageIndex = 0;
            this.paginator._changePageSize(this.paginator.pageSize);
        }
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
        this.cd.markForCheck();
    }

    clearGlobalFilter(): void {
        this.globalFilter = '';
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
                    <strong>Market Cap:</strong> ${this.selectedCurrencySymbol}${coin.market_cap.toLocaleString(this.selectedCurrencyLocale)}<br>
                    <strong>Current Price:</strong> ${this.selectedCurrencySymbol}${coin.current_price.toLocaleString(this.selectedCurrencyLocale)}<br>
                    <strong>24h High:</strong> ${this.selectedCurrencySymbol}${coin.high_24h.toLocaleString(this.selectedCurrencyLocale)}<br>
                    <strong>24h Low:</strong> ${this.selectedCurrencySymbol}${coin.low_24h.toLocaleString(this.selectedCurrencyLocale)}<br>
                    <strong>Price Change (24h):</strong> ${coin.price_change_percentage_24h.toFixed(2)}%<br>
                    <strong>Total Volume:</strong> ${this.selectedCurrencySymbol}${coin.total_volume.toLocaleString(this.selectedCurrencyLocale)}
                  `;
                },
            },
            xAxis: {
                type: 'category',
                data: data.map((coin) => coin.symbol.toUpperCase()),
            },
            yAxis: {
                type: 'value',
                name: `Market Cap (${this.selectedCurrencySymbol})`,
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
