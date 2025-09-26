import { Component, inject, input } from '@angular/core';
import { NovixEngThemeService } from 'novix-engine';

@Component({
  selector: 'app-base-colors',
  imports: [],
  templateUrl: './base-colors.html',
  styleUrl: './base-colors.scss'
})

export class BaseColors {
  private _ThemeService = inject(NovixEngThemeService);

  public colorTokens = input<string[]>([]);

  public lightThemeColorsNeedingBorders: string[] = [
    'background',
    'surface',
    'surface-variant',
    'on-primary',
    'on-secondary',
    'on-tertiary',
    'on-warn',
    'on-error',
    'on-success',
    'on-info'
  ];
  public darkThemeColorsNeedingBorders: string[] = [
    'background',
    'surface',
    'surface-variant'
  ];
  public blueThemeColorsNeedingBorders: string[] = [
    'background',
    'surface',
    'on-primary',
    'on-secondary',
    'on-tertiary',
    'on-accent',
    'on-neutral',
    'on-error',
    'on-success',
    'on-info'
  ]

  public needsBorder(token: string): boolean {
    const refList =
      this._ThemeService.currentThemeId() === 'novix-default-light' ? this.lightThemeColorsNeedingBorders :
      this._ThemeService.currentThemeId() === 'novix-default-dark' ? this.darkThemeColorsNeedingBorders :
      this._ThemeService.currentThemeId() === 'novix-blue-theme' ? this.blueThemeColorsNeedingBorders :
      ['background'];

    return refList.includes(token);
  }
}
