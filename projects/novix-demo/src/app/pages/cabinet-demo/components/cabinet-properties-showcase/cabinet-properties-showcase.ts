import { Component, computed, inject, signal } from '@angular/core';
import { CabinetDemo } from '../../cabinet-demo';
import { CodeBlock } from '../../../shared/components/code-block/code-block';
import { NovixCabinetModule, NovixCardinalDirection } from 'novix-engine';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-cabinet-properties-showcase',
  imports: [
    NovixCabinetModule,
    CodeBlock,
    NgTemplateOutlet
],
  templateUrl: './cabinet-properties-showcase.html',
  styleUrl: './cabinet-properties-showcase.scss'
})

export class CabinetPropertiesShowcase {
  public cabinetDemoPage = inject(CabinetDemo);

  public attachDirection = signal<NovixCardinalDirection>('left');
  public attachDirectionOptions: NovixCardinalDirection[] = ['left', 'right', 'top', 'bottom'];
  public onAttachDirectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as NovixCardinalDirection;
    this.attachDirection.set(value);
  }

  public rounded = signal<boolean>(false);
  public autoCloseOnOutsideClick = signal<boolean>(false);
  public edgeMargin = signal<string>('');
  public justifyHandles = signal<'start'|'center'|'end'>('start');
  public justifyHandlesOptions = ['start', 'center', 'end'];
  public onJustifyHandlesChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'start'|'center'|'end';
    this.justifyHandles.set(value);
  }

  public cabinetCode = computed(() => {
    const properties: string[] = [];

    if (this.attachDirection() !== 'left') { properties.push(`[attachDirection]="'${this.attachDirection()}'"`); }
    if (this.rounded()) { properties.push(`[rounded]="true"`); }
    if (this.autoCloseOnOutsideClick()) { properties.push(`[autoCloseOnOutsideClick]="true"`); }
    if (this.edgeMargin().trim() !== '') { properties.push(`[edgeMargin]="'${this.edgeMargin()}px'"`); }
    if (this.justifyHandles() !== 'start') { properties.push(`[justifyHandles]="'${this.justifyHandles()}'"`); }

    if (properties.length === 0) {
      return `<novix-cabinet>\n</novix-cabinet>`;
    } else {
      const propertiesString = properties.map(prop => `  ${prop}`).join('\n');
      return `<novix-cabinet\n${propertiesString}>\n</novix-cabinet>`;
    }
  });
}
