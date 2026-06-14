import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss',
})
export class SummaryCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
}
