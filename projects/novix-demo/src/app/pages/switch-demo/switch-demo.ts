import { Component, signal } from '@angular/core';
import { NovixCabinetModule, NovixSwitchModule } from 'novix-engine';
import { SwitchBasicUsage } from './components/switch-basic-usage/switch-basic-usage';
import { SwitchProperties } from './components/switch-properties/switch-properties';
import { SwitchCssOverrides } from './components/switch-css-overrides/switch-css-overrides';
import { SwitchLiveShowcase } from './components/switch-live-showcase/switch-live-showcase';
import { SwitchReusableConfig } from './components/switch-reusable-config/switch-reusable-config';
import { SwitchInjectableConfig } from './components/switch-injectable-config/switch-injectable-config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-switch-demo',
  imports: [
    NovixSwitchModule,
    NovixCabinetModule,
    RouterLink,
    SwitchBasicUsage,
    SwitchProperties,
    SwitchCssOverrides,
    SwitchLiveShowcase,
    SwitchReusableConfig,
    SwitchInjectableConfig
  ],
  templateUrl: './switch-demo.html',
  styleUrl: './switch-demo.scss'
})

export class SwitchDemo {
  public checkedTracker = signal<boolean>(false);
  public isOn: boolean = false;
  public otherTracker = signal<boolean>(false);
}
