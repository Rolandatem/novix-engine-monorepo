import { Component } from '@angular/core';
import { BaseColors } from './components/base-colors/base-colors';
import { ColorOpacity } from './components/color-opacity/color-opacity';
import { InteractiveStateColors } from './components/interactive-state-colors/interactive-state-colors';
import { ColorContrast } from './components/color-contrast/color-contrast';
import { RouterLink } from '@angular/router';
import { NovixTrayModule } from 'novix-engine';

@Component({
  selector: 'app-colors-demo',
  imports: [
    BaseColors,
    ColorOpacity,
    InteractiveStateColors,
    ColorContrast,
    RouterLink,
    NovixTrayModule
  ],
  templateUrl: './colors-demo.html',
  styleUrl: './colors-demo.scss'
})

export class ColorsDemo {
  public colorTokens: string[] = [
    'primary',
    'secondary',
    'tertiary',
    'accent',
    'neutral',
    'neutral-variant',
    'warn',
    'error',
    'success',
    'info',
    'background',
    'surface',
    'surface-variant',
    'on-primary',
    'on-secondary',
    'on-tertiary',
    'on-accent',
    'on-neutral',
    'on-neutral-variant',
    'on-warn',
    'on-error',
    'on-success',
    'on-info',
    'on-background',
    'on-surface'
  ];
}
