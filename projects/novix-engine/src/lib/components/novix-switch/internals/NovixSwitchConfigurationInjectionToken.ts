import { InjectionToken } from "@angular/core";
import { INovixSwitchConfiguration } from "./INovixSwitchConfiguration";

export const NOVIX_SWITCH_CONFIGURATION =
  new InjectionToken<INovixSwitchConfiguration>('NovixSwitchConfiguration');
