import { Component, computed, signal } from '@angular/core';
import { NovixSwitchModule, NovixSwitchUIMode } from 'novix-engine';
import { CodeBlock } from '../../../shared/components/code-block/code-block';

@Component({
  selector: 'app-switch-live-showcase',
  imports: [
    NovixSwitchModule,
    CodeBlock
  ],
  templateUrl: './switch-live-showcase.html',
  styleUrl: './switch-live-showcase.scss'
})

export class SwitchLiveShowcase {
  public checkedState = signal<boolean>(false);
  public uiMode = signal<string>('horizontal');
  public rounded = signal<boolean>(true);
  public trueBackgroundColor = signal<string>('default');
  public falseBackgroundColor = signal<string>('default');
  public trackBorderColor = signal<string>('default');
  public thumbColor = signal<string>('default');

  public uiModeOptions: string[] = ['horizontal', 'vertical'];
  public colorOptions: string[] = [
    'default',
    'var(--novix-primary)',
    'var(--novix-secondary)',
    'var(--novix-tertiary)',
    'red',
    'blue',
    'green',
    'purple'
  ];

  public uiModeCasted = computed<NovixSwitchUIMode>(() => this.uiMode() as NovixSwitchUIMode);

  public codeComputed = computed(() => {
    const params: string[] = [];

    params.push(`[(checked)]="myBooleanProperty"`);
    if (this.uiMode() !== 'horizontal') { params.push(`[uiMode]="'vertical'"`); }
    if (this.rounded() === false) { params.push(`[rounded]="false"`); }
    if (this.trueBackgroundColor() !== 'default') { params.push(`[trueBackgroundColor]="'${this.trueBackgroundColor()}'"`); }
    if (this.falseBackgroundColor() !== 'default') { params.push(`[falseBackgroundColor]="'${this.falseBackgroundColor()}'"`); }
    if (this.trackBorderColor() !== 'default') { params.push(`[trackBorderColor]="'${this.trackBorderColor()}'"`); }
    if (this.thumbColor() !== 'default') { params.push(`[thumbColor]="'${this.thumbColor()}'"`); }

    const paramString = params.join('\n   ');
    return `<novix-switch\n   ${paramString} />`;
  });
}
