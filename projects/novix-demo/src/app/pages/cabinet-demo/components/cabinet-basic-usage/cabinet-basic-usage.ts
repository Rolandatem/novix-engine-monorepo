import { Component, inject } from '@angular/core';
import { CodeBlock } from "../../../shared/components/code-block/code-block";
import { CabinetDemo } from '../../cabinet-demo';
import { NovixCabinetModule } from 'novix-engine';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-cabinet-basic-usage',
  imports: [
    NovixCabinetModule,
    CodeBlock,
    NgTemplateOutlet
],
  templateUrl: './cabinet-basic-usage.html',
  styleUrl: './cabinet-basic-usage.scss'
})

export class CabinetBasicUsage {
  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  public cabinetDemoPage = inject(CabinetDemo);

  //===========================================================================================================================
  //--Code Snippets
  //===========================================================================================================================
  public basicCabinetUsage =
`<novix-cabinet>
  <ng-template novix-cabinet-tray
    [handleText]="'First Tray'">

    [...tray contents here...]
  </ng-template>

  <ng-template novix-cabinet-tray
    [handleText]="'Second Tray'">

    [...tray contents here...]
  </ng-template>
</novix-cabinet>`;
}
