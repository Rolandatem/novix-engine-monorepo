import { Component, computed, inject, input, model } from '@angular/core';
import { NOVIX_SWITCH_CONFIGURATION } from './internals/NovixSwitchConfigurationInjectionToken';
import { NovixSwitchUIMode } from './internals/NovixSwitchUIMode';
import { INovixSwitchConfiguration } from './internals/INovixSwitchConfiguration';
import { NovixConfigurationComponent } from '../../tools/helpers/NovixConfigurableComponent';

@Component({
  selector: 'novix-switch',
  imports: [],
  templateUrl: './novix-switch.html',
  styleUrl: './novix-switch.scss'
})

export class NovixSwitch extends NovixConfigurationComponent<INovixSwitchConfiguration> {
  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private injectedConfig = inject(NOVIX_SWITCH_CONFIGURATION, { optional: true });

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  public checked = model<boolean>(false);

  public config = input<INovixSwitchConfiguration | null>(null);
  public uiMode = input<NovixSwitchUIMode>('horizontal');
  public rounded = input<boolean>(true);
  public trueBackgroundColor = input<string | null>(null);
  public falseBackgroundColor = input<string | null>(null);
  public trackBorderColor = input<string | null>(null);
  public thumbColor = input<string | null>(null);

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public settingsComputed = computed<INovixSwitchConfiguration>(() => {
    //--Read all signals here so Angular tracks dependencies and updates reactively.
    const directInputs: Partial<INovixSwitchConfiguration> = {
      uiMode: this.uiMode(),
      rounded: this.rounded(),
      trueBackgroundColor: this.trueBackgroundColor(),
      falseBackgroundColor: this.falseBackgroundColor(),
      trackBorderColor: this.trackBorderColor(),
      thumbColor: this.thumbColor()
    };

    //--Defaults
    const defaults: INovixSwitchConfiguration = {
      uiMode: 'horizontal',
      rounded: true,
      trueBackgroundColor: null,
      falseBackgroundColor: null,
      trackBorderColor: null,
      thumbColor: null
    }

    return this.mergeConfigs(
      this.injectedConfig,
      this.config(),
      directInputs,
      defaults
    )
  })
}
