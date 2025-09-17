import { Component, input } from '@angular/core';

@Component({
  selector: 'app-base-colors',
  imports: [],
  templateUrl: './base-colors.html',
  styleUrl: './base-colors.scss'
})

export class BaseColors {
  public colorTokens = input<string[]>([]);

  public colorsNeedingBorders: string[] = [
    'background',
    'surface',
    'surface-variant',
    'on-primary',
    'on-secondary',
    'on-tertiary'
  ]

  public needsBorder(token: string): boolean {
    return this.colorsNeedingBorders.includes(token);
  }
}
