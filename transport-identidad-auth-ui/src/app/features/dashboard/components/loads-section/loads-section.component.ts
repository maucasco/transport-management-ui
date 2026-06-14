import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { LoadSummary } from '../../models/dashboard.model';

@Component({
  selector: 'app-loads-section',
  standalone: true,
  imports: [NgClass],
  templateUrl: './loads-section.component.html',
  styleUrl: './loads-section.component.scss',
})
export class LoadsSectionComponent {
  readonly title = input.required<string>();
  readonly loads = input.required<LoadSummary[]>();
}
