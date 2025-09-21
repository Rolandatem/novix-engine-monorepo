import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNovixEngine } from 'novix-engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideClientHydration(withEventReplay()),

    //--Zero-Config setup. No light vs dark mode, assumes light theme/light mode.
    //--should only include novix-light-theme.scss in styles.scss
    //provideNovixEngine()

    //--Minimal duality setup. Allows light vs dark mode, but no registered themes, so assumes
    //-- novix-light-theme and novix-dark-theme. So, both of those need to be included in the styles.scss.
    // provideNovixEngine({
    //   watchSystemMode: true
    // })

    //--Single mode setup. Multiple themes registered, but should ignore light vs dark.
    //--Requires all of the themes below to be included in the styles.scss
    provideNovixEngine({
      registerThemes: [
        { id: 'novix-default-light' },
        { id: 'novix-default-dark' },
        { id: 'novix-blue-theme' },
        { id: 'novix-rose-theme' },
        { id: 'novix-mint-theme' }
      ],
      initialLightTheme: 'novix-default-light',
      initialDarkTheme: 'novix-default-dark',
      watchSystemMode: true
    })
  ]
};
