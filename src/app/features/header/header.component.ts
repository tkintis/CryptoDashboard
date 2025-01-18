import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Store } from "@ngrx/store";
import { Currency } from "../../shared/enums/currency.enum";
import { setCurrency } from "../../shared/store/actions/crypto.actions";
import { selectCurrency } from "../../shared/store/selectors/crypto.selectors";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  title = input.required();

  currencies = [Currency.usd, Currency.eur];
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