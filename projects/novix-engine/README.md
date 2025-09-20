# NovixEngine

**NovixEngine** is a lightweight, modular front-end toolkit for Angular applications.  
It provides a growing set of components, theming utilities, and layout tools designed for clarity, extensibility, and developer autonomy.

Inspired by Bootstrap-style conventions and Angular's modern signal-based architecture, NovixEngine simplifies onboarding and encourages clean, maintainable code.

> ⚠️ NovixEngine is currently in active development.  

---

## 📚 Table of Contents

_(To be filled in as sections are added)_

- [Installation](#installation)
- [Theming Setup](#theming-setup)
- [Component Usage: novix-tray](#component-usage-novix-tray)
- [SCSS Utility Classes](#scss-utility-classes)
- [Demo App](#demo-app)
- [License](#license)

---

## 📦 Installation

NovixEngine is currently in active development and **not yet published to npm**.  
To use it in your own Angular project, you can install it directly from the monorepo using a relative or file-based path.

### ✅ Temporary Local Installation

If you're working within the same monorepo:

```bash
npm install ../novix-engine
```

Or, if you've cloned NovixEngine separately and want to link it:

```bash
npm install --save file:/path/to/novix-engine
```

> ⚠️ Make sure the `novix-engine` project has been built (`ng build novix-engine`) before installing it into another project.

Once installed, you can import modules like:

```ts
import { NovixTrayModule } from 'novix-engine';
```

When NovixEngine is published to npm, this section will be updated with official installation instructions.

### Required Peer Dependencies

NovixEngine relies on the [`cookie`](https://www.npmjs.com/package/cookie) package for SSR-safe theme persistence. This package is declared as a peer dependency, which means you must install it manually in your project.

```bash
npm install cookie
```

This enables NovixEngine to persist theme preferences using cookies, which are accessible during server-side rendering. Without this package, SSR setups may experience theme flickering or hydration mismatches.

> ⚠️ If you're using SSR and want to prevent theme flicker, make sure to include the `cookie` package and follow our [SSR mitigation guide](#ssr-theme-flicker-mitigation) for best results.


---

## 🎨 Theming Setup

NovixEngine supports flicker-safe theming with light/dark mode, system preference detection, and SCSS token maps.  
Themes are applied before the first render using Angular's `provideAppInitializer`, ensuring visual stability across SSR and hydration.

---

### ✅ Minimal Setup

For most apps, you can initialize NovixEngine with no parameters:

```ts
import { provideNovixEngine } from 'novix-engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNovixEngine()
  ]
};
```

This setup assumes you're using the default themes included in the engine:
- `novix-default-light`
- `novix-default-dark`

> ⚠️ Even with default themes, you **must** import the theme SCSS files into your global `styles.scss`.

---

### 🛠️ Custom Setup

You can register your own themes and control initial behavior:

```ts
import { provideNovixEngine } from 'novix-engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNovixEngine({
      registerThemes: [
        { id: 'my-light-theme', map: myLightTheme },
        { id: 'my-dark-theme', map: myDarkTheme }
      ],
      initialLightTheme: 'my-light-theme',
      initialDarkTheme: 'my-dark-theme',
      watchSystemTheme: true
    })
  ]
};
```

#### Option Reference

| Option             | Type       | Description |
|--------------------|------------|-------------|
| `registerThemes`   | `Array<{ id: string; map: Record<string, any> }>` | Registers one or more theme maps with unique IDs |
| `initialLightTheme`| `string`   | Theme ID to use when mode is `'light'` |
| `initialDarkTheme` | `string`   | Theme ID to use when mode is `'dark'` |
| `watchSystemTheme` | `boolean`  | If `true`, listens for system theme changes and switches automatically |

---

### 🎨 SCSS Imports

To enable theming, import the required SCSS files into your global `styles.scss`:

```scss
/* You can add global styles to this file, and also import other style files */
@use 'novix-engine/styles' as *;
@use 'novix-engine/styles/themes/novix-default-light-theme';
@use 'novix-engine/styles/themes/novix-default-dark-theme';
```

- The first line (`@use 'novix-engine/styles' as *`) is **required** for utility mixins and shared tokens.
- The theme imports activate the default light/dark themes.
- You can replace these with custom themes like `novix-blue-theme` or `novix-rose-theme` as needed.

> ⚠️ If a theme is activated but its SCSS is not imported, CSS variables will be missing and the app may render incorrectly.


---

## 🧭 Component Usage: `novix-tray`

The `novix-tray` component provides a collapsible tray that can attach to any screen edge (`left`, `right`, `top`, or `bottom`). It supports dynamic content, optional headers, and customizable styling.

### ✅ Import the module

```ts
import { NovixTrayModule } from 'novix-engine';

@Component({
  standalone: true,
  imports: [NovixTrayModule],
  ...
})
```

### ✅ Basic usage

```html
<novix-tray
  [attachDirection]="'right'"
  [handleText]="'Menu'"
  [rounded]="true"
  [traySize]="'300px'">

  <tray-header>
    <h2>Navigation</h2>
  </tray-header>

  <tray-content>
    <ul>
      <li><a routerLink="/home">Home</a></li>
      <li><a routerLink="/about">About</a></li>
    </ul>
  </tray-content>
</novix-tray>
```

### 🛠️ Inputs

| Input                  | Type      | Description |
|-----------------------|-----------|-------------|
| `attachDirection`     | `'left', 'right', 'top', 'bottom'` | Tray attachment side (Default: 'left') |
| `traySize`            | `string`  | Width or height of tray (Default: 300px horizontal, 500px vertical) |
| `startOpen`           | `boolean` | Whether tray starts open (Default: false) |
| `rounded`             | `boolean` | Apply rounded corners (Default: false) |
| `showHandle`          | `boolean` | Show clickable tray handle (Default: true) |
| `handleText`          | `string`  | Text inside tray handle (Default: '...') |
| `handleBackground`    | `string`  | Background color of handle (Default: --primary) |
| `handleColor`         | `string`  | Text color of handle (Default: --on-primary) |
| `handleFontFamily`    | `string`  | Font family of handle text (Default: --font-family) |
| `handleFontSize`      | `string`  | Font size of handle text (Default: --font-size-sm) |
| `contentsBackground`  | `string`  | Background color of tray content (Default: --surface) |
| `contentsColor`       | `string`  | Text color of tray content (Default: --on-surface) |
| `contentsBorderColor` | `string`  | Border color of tray content (Default: --primary) |

> For full styling control, use SCSS variables or override styles via `[style]` bindings.

---

## 🛠️ SCSS Utility Classes

_(Section placeholder — will be expanded as utilities are finalized)_

NovixEngine includes a set of SCSS utility classes for layout, spacing, typography, and color.  
These follow Bootstrap-style naming and are designed to be additive and predictable.

> This section will be expanded as the demo and portfolio apps reveal missing utilities or refinements.

---

## 📄 License

This version of NovixEngine is licensed for personal, educational, and non-commercial use only.  
See the [LICENSE](../../LICENSE) file for full terms.  
The copyright holder reserves the right to offer future versions under different terms, including commercial licenses.
