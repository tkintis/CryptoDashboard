import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    
}