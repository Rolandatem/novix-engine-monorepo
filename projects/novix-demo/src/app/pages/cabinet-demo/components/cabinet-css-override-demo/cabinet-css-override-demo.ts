import { Component, inject } from '@angular/core';
import { CabinetDemo } from '../../cabinet-demo';
import { NovixCabinetModule } from 'novix-engine';
import { CodeBlock } from '../../../shared/components/code-block/code-block';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-cabinet-css-override-demo',
  imports: [
    NovixCabinetModule,
    CodeBlock,
    NgTemplateOutlet
],
  templateUrl: './cabinet-css-override-demo.html',
  styleUrl: './cabinet-css-override-demo.scss'
})

export class CabinetCssOverrideDemo {
  public cabinetDemoPage = inject(CabinetDemo);

  public allCabinetsCSS =
`novix-cabinet {
  --novix-cabinet-tray-handle-background-color: var(--novix-accent);
  --novix-cabinet-tray-handle-color: var(--novix-primary);
  --novix-cabinet-tray-handle-font-family: Arial;
  --novix-cabinet-tray-handle-font-size: 20px;
  --novix-cabinet-tray-content-background-color: var(--novix-neutral-variant);
  --novix-cabinet-tray-content-border-color: var(--novix-success);
}`;

  public idSpecifiedCabinetCSS =
`novix-cabinet#specific-cabinet {
  --novix-cabinet-tray-handle-background-color: var(--novix-accent);
  --novix-cabinet-tray-handle-color: var(--novix-primary);
  --novix-cabinet-tray-handle-font-family: Arial;
  --novix-cabinet-tray-handle-font-size: 20px;
  --novix-cabinet-tray-content-background-color: var(--novix-neutral-variant);
  --novix-cabinet-tray-content-border-color: var(--novix-success);
}`;
}
