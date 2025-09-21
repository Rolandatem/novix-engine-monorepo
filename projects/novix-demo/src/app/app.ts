import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NovixEngThemeService } from 'novix-engine';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  private router = inject(Router);
  private _novixEngineThemeService = inject(NovixEngThemeService);

  public readonly isDarkMode = computed(() => this._novixEngineThemeService.mode() === 'dark');

  public toggleLightDarkMode(): void {
    this._novixEngineThemeService.toggleMode();
  }

  public goTo(path: string): void {
    this.router.navigate([path]);
  }

  public registeredThemes = computed(() => {
    return this._novixEngineThemeService.getRegisteredThemes();
  });

  public onThemeChange(event: Event): void {
    const el = event.target as HTMLSelectElement;
    const selectedId = el.value;
    if (selectedId === '') { return; }
    this._novixEngineThemeService.setCurrentModeTheme(selectedId);
  }
}
