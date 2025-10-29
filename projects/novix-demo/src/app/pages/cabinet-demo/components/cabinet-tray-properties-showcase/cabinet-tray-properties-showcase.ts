import { Component, computed, inject, signal } from '@angular/core';
import { CabinetDemo } from '../../cabinet-demo';
import { NovixCabinetModule } from 'novix-engine';
import { CodeBlock } from '../../../shared/components/code-block/code-block';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-cabinet-tray-properties-showcase',
  imports: [
    NovixCabinetModule,
    CodeBlock,
    NgTemplateOutlet
  ],
  templateUrl: './cabinet-tray-properties-showcase.html',
  styleUrl: './cabinet-tray-properties-showcase.scss'
})

export class CabinetTrayPropertiesShowcase {
  public cabinetDemoPage = inject(CabinetDemo);

  public handleText = signal<string>('Handle Text');
  public traySize = signal<string>('');
  public handleBackgroundColor = signal<string>('default');
  public handleColor = signal<string>('default');
  public handleFontFamily = signal<string>('default');
  public handleFontSize = signal<string>('default');
  public contentBackgroundColor = signal<string>('default');
  public contentBorderColor = signal<string>('default');

  public colorOptions: string[] = [
    'default',
    'var(--novix-primary)',
    'var(--novix-on-primary)',
    'var(--novix-secondary)',
    'var(--novix-on-secondary)',
    'var(--novix-tertiary)',
    'var(--novix-on-tertiary)',
    'var(--novix-surface-variant)',
    'red',
    'green',
    'blue'
  ];

  public fontFamilyOptions: string[] = [
    'default',
    'var(--novix-font-family)',
    'Arial',
    'Courier New'
  ];

  public fontSizeOptions: string[] = [
    'default',
    'var(--novix-font-size-xs)',
    'var(--novix-font-size-sm)',
    'var(--novix-font-size-md)',
    'var(--novix-font-size-lg)',
    '12px',
    '14px'
  ]

  public cabinetTrayCode = computed(() => {
    const properties: string[] = [];

    if (this.handleText().trim() !== '') { properties.push(`[handleText]="'${this.handleText()}'"`); }
    if (this.traySize().trim() !== '') { properties.push(`[traySize]="'${this.traySize()}px'"`); }
    if (this.handleBackgroundColor() !== 'default') { properties.push(`[handleBackgroundColor]="'${this.handleBackgroundColor()}'"`); }
    if (this.handleColor() !== 'default') { properties.push(`[handleColor]="'${this.handleColor()}'"`); }
    if (this.handleFontFamily() !== 'default') { properties.push(`[handleFontFamily]="'${this.handleFontFamily()}'"`); }
    if (this.handleFontSize() !== 'default') { properties.push(`[handleFontSize]="'${this.handleFontSize()}'"`); }
    if (this.contentBackgroundColor() !== 'default') { properties.push(`[contentBackgroundColor]="'${this.contentBackgroundColor()}'"`); }
    if (this.contentBorderColor() !== 'default') { properties.push(`[contentBorderColor]="'${this.contentBorderColor()}'"`); }

    if (properties.length === 0) {
      return `<novix-cabinet>\n   <ng-template novix-cabinet-tray>\n     [...your content]\n   </ng-template>\n</novix-cabinet>`;
    } else {
      const propertiesString = properties.map(prop => `     ${prop}`).join('\n');
      return `<novix-cabinet>\n   <ng-template novix-cabinet-tray\n${propertiesString.trimEnd()}>\n     [...your content]\n   </ng-template>\n</novix-cabinet>`;
    }
  });
}
