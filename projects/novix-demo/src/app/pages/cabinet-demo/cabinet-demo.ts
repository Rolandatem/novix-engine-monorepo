import { Component, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { NovixCabinetModule } from 'novix-engine';
import { CabinetAnchoringDemo } from './components/cabinet-anchoring-demo/cabinet-anchoring-demo';

@Component({
  selector: 'app-cabinet-demo',
  imports: [
    CabinetAnchoringDemo
  ],
  templateUrl: './cabinet-demo.html',
  styleUrl: './cabinet-demo.scss'
})

export class CabinetDemo {
  //===========================================================================================================================
  // MEMBER VARIABLES
  @ViewChild('quickSettingsContent', { static: true })
  public quickSettingsContent!: TemplateRef<any>;

  @ViewChild('liveStatsContent', { static: true })
  public liveStatsContent!: TemplateRef<any>;
  //===========================================================================================================================

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public readonly demoVisibility = {
    anchoredLeft: signal<boolean>(false),
    anchoredRight: signal<boolean>(false),
    anchoredTop: signal<boolean>(false),
    anchoredBottom: signal<boolean>(false)
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  public hideAllCabinets(): void {
    Object.values(this.demoVisibility).forEach((cabinetVisibility) => {
      (cabinetVisibility as WritableSignal<boolean>).set(false);
    });
  }
}
