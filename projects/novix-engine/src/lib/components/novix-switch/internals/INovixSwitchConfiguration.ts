import { NovixSwitchUIMode } from "./NovixSwitchUIMode"

export interface INovixSwitchConfiguration {
  uiMode?: NovixSwitchUIMode,
  rounded?: boolean | null,
  trueBackgroundColor?: string | null,
  falseBackgroundColor?: string | null,
  trackBorderColor?: string | null,
  thumbColor?: string | null
}
