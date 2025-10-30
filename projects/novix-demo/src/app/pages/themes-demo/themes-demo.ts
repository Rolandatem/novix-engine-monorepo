import { Component, computed, effect, inject, signal } from '@angular/core';
import { NovixEngThemeService, NovixCabinetModule } from 'novix-engine';
import { CodeBlock } from '../shared/components/code-block/code-block';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-themes-demo',
  imports: [
    NovixCabinetModule,
    CodeBlock,
    RouterLink
],
  templateUrl: './themes-demo.html',
  styleUrl: './themes-demo.scss'
})

export class ThemesDemo {
  private _themeService = inject(NovixEngThemeService);

  public currentMode = computed(() => this._themeService.getCurrentMode());
  public currentTheme = computed(() => this._themeService.getCurrentThemeId());
  public registeredThemes = computed(() => this._themeService.getRegisteredThemes());
  public activeThemes = computed(() => this._themeService.getActiveThemeIds());
  public selectedThemeId = signal<string>('');

  constructor() {
    effect(() => {
      this.selectedThemeId.set(
        this._themeService.getCurrentThemeId()
      )
    });
  }

  public onThemeChange(event: Event): void {
    const el = event.target as HTMLSelectElement;
    this._themeService.setCurrentModeTheme(el.value);
    this.selectedThemeId.set(el.value);
  }

  public toggleMode(): void {
    this._themeService.toggleMode();
  }

  //===========================================================================================================================
  //--Code Snippets
  //===========================================================================================================================
  public themeMinimalSetupCode =
`import { provideNovixEngine } from 'novix-engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNovixEngine();
  ]
};`;

  public themeCustomSetupCode =
`import { provideNovixEngine } from 'novix-engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNovixEngine({
      registerThemes: [
        { id: 'my-light-theme' },
        { id: 'my-dark-theme' }
        //--Add any other themes you want available to the app.
      ],
      initialLightTheme: 'my-light-theme',
      initialDarkTheme: 'my-dark-theme,
      watchSystemTheme: true
    })
  ]
};`;

  public expressOrignalServerCode =
`app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
})`;

  public expressNovixServerCode =
`app.set('angularApp', angularApp);
app.use(
  injectNovixThemeClassForExpress({
    light: 'novix-default-light',
    dark: 'novix-default-dark'
  })
);`;

  public scssImportsCode =
`/* Required for both theming and scss utilities */
@use 'novix-engine/styles' as *;
/* Place any theme scss files that you want to use in your app below. */
/* -- Light and dark themes packaged with novix-engine. */
@use 'novix-engine/styles/themes/novix-default-light-theme';
@use 'novix-engine/styles/themes/novix-default-dark-theme';
/* -- Custom themes created for your apps. */
@use './app/themes/blue-theme.scss';
@use './app/themes/rose-theme.scss';
@use './app/themes/mint-theme.scss';`;

  public exampleGetRegisteredThemesOutput =
`[
  { id: 'novix-default-light-theme' },
  { id: 'novix-default-dark-theme' }
]`;

}
