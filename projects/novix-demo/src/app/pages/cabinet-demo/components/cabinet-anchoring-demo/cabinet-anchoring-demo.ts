import { Component, inject } from '@angular/core';
import { CabinetDemo } from '../../cabinet-demo';
import { NovixCabinetModule } from 'novix-engine';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-cabinet-anchoring-demo',
  imports: [
    NovixCabinetModule,
    NgTemplateOutlet
  ],
  templateUrl: './cabinet-anchoring-demo.html',
  styleUrl: './cabinet-anchoring-demo.scss'
})

export class CabinetAnchoringDemo {
  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  public cabinetDemoPage = inject(CabinetDemo);
}
