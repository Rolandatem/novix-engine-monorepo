import { Component, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { CabinetBasicUsage } from "./components/cabinet-basic-usage/cabinet-basic-usage";
import { CabinetProperties } from "./components/cabinet-properties/cabinet-properties";
import { CabinetCssOverrideDemo } from "./components/cabinet-css-override-demo/cabinet-css-override-demo";
import { CabinetPropertiesShowcase } from './components/cabinet-properties-showcase/cabinet-properties-showcase';
import { CabinetTrayPropertiesShowcase } from './components/cabinet-tray-properties-showcase/cabinet-tray-properties-showcase';

@Component({
  selector: 'app-cabinet-demo',
  imports: [
    CabinetBasicUsage,
    CabinetProperties,
    CabinetCssOverrideDemo,
    CabinetPropertiesShowcase,
    CabinetTrayPropertiesShowcase
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
    basicDemo: signal<boolean>(false),
    cssOverrideDemo: signal<boolean>(false),
    cabinetPropertiesShowcase: signal<boolean>(false),
    cabinetTrayPropertiesShowcase: signal<boolean>(false)
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  public toggleCabinet(id: keyof typeof this.demoVisibility): void {
    const sig = this.demoVisibility[id];
    const wasOpen = sig();

    this.hideAllCabinets();

    if (wasOpen === false) {
      sig.set(true);
    }
  }
  public hideAllCabinets(): void {
    Object.values(this.demoVisibility).forEach((cabinetVisibility) => {
      (cabinetVisibility as WritableSignal<boolean>).set(false);
    });
  }
}
