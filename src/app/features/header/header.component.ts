import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from "@angular/core";
import { Store } from "@ngrx/store";
import { environment } from "../../../environments/environment";
import { Currency } from "../../shared/enums/currency.enum";
import { setCurrency } from "../../shared/store/actions/crypto.actions";
import { selectCurrency } from "../../shared/store/selectors/crypto.selectors";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  title: InputSignal<string> = input.required<string>();

  currencies: Currency[] = [Currency.usd, Currency.eur];
  selectedCurrency: Currency = environment.defaultCurrency;

  private store: Store = inject(Store);

  constructor() {
    // Subscribe to the currency state to keep the dropdown synced
    this.store.select(selectCurrency).subscribe((currency) => {
      this.selectedCurrency = currency;
    });
  }

  onCurrencyChange(currency: Currency): void {
    this.store.dispatch(setCurrency({ currency }));
  }
}