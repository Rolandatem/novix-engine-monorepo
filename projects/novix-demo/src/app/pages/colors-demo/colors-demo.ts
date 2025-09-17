import { Component, ViewChild } from '@angular/core';
import { BaseColors } from './components/base-colors/base-colors';
import { ColorOpacity } from './components/color-opacity/color-opacity';
import { InteractiveStateColors } from './components/interactive-state-colors/interactive-state-colors';
import { ColorContrast } from './components/color-contrast/color-contrast';
import { NovixTrayDemo } from 'projects/novix-demo/src/components/novix-tray-demo/novix-tray-demo';

@Component({
  selector: 'app-colors-demo',
  imports: [
    BaseColors,
    ColorOpacity,
    InteractiveStateColors,
    ColorContrast,
    NovixTrayDemo
  ],
  templateUrl: './colors-demo.html',
  styleUrl: './colors-demo.scss'
})

export class ColorsDemo {
  @ViewChild('theTray')
  private theTray!: NovixTrayDemo;

  public toggleIt(): void {
    this.theTray.toggleTray();
  }

  public openIt(): void {
    this.theTray.openTray();
  }

  public closeIt(): void {
    this.theTray.closeTray();
  }

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
