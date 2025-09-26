import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, input, model, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-contrast',
  imports: [FormsModule],
  templateUrl: './color-contrast.html',
  styleUrl: './color-contrast.scss'
})

export class ColorContrast {
  private _isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));
  public colorTokens = input<string[]>([]);
  public selectedBg = model<string>('primary');
  public selectedText = model<string>('on-primary');

  private lum(hex: string): number {
    const c = hex.replace('#', '');
    const rgb = [
      parseInt(c.substring(0, 2), 16) / 255,
      parseInt(c.substring(2, 4), 16) / 255,
      parseInt(c.substring(4, 6), 16) / 255
    ].map(v => v < 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  private getCssVarHex(token: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--novix-${token}`)
      .trim();
  }

  private getContrastRatioFromHex(bgHex: string, fgHex: string): number {
    const L1 = this.lum(bgHex);
    const L2 = this.lum(fgHex);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }

  public getContrastRatio(bgColor: string, textColor: string): number {
    if (!this._isBrowser) return 0;
    const bgHex = this.getCssVarHex(bgColor);
    const fgHex = this.getCssVarHex(textColor);
    const ratio = this.getContrastRatioFromHex(bgHex, fgHex);
    return Math.round(ratio * 100) / 100;
  }

  public getCompliance(ratio: number): string {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
}
