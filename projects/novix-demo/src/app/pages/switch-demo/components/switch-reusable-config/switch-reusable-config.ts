import { Component, computed } from '@angular/core';
import { INovixSwitchConfiguration, NovixSwitchModule } from 'novix-engine';
import { CodeBlock } from '../../../shared/components/code-block/code-block';

@Component({
  selector: 'app-switch-reusable-config',
  imports: [
    NovixSwitchModule,
    CodeBlock
  ],
  templateUrl: './switch-reusable-config.html',
  styleUrl: './switch-reusable-config.scss'
})

export class SwitchReusableConfig {
  public switchConfig: INovixSwitchConfiguration = {
    uiMode: 'vertical',
    trueBackgroundColor: 'purple',
    thumbColor: 'cyan'
  };

  public interfaceCode = computed(() =>
    'interface INovixSwitchConfiguration {\n' +
    '   uiMode?: NovixSwitchUIMode,\n' +
    '   rounded?: boolean | null,\n' +
    '   trueBackgroundColor?: string | null,\n' +
    '   falseBackgroundColor?: string | null,\n' +
    '   trackBorderColor?: string | null,\n' +
    '   thumbColor?: string | null\n' +
    '}');

  public exampleSwitchConfig = computed(() =>
    'public switchConfig: INovixSwitchConfiguration = {\n' +
    '   uiMode: \'vertical\',\n' +
    '   trueBackgroundColor: \'purple\',\n' +
    '   thumbColor: \'cyan\'\n' +
    '};');

  public exampleSwitchCode = computed(() =>
    '<novix-switch\n' +
    '   [(checked)]="myBoolOne"\n' +
    '   [config]="switchConfig" /> \n\n' +
    '<novix-switch\n' +
    '   [(checked)]="myBoolTwo"\n' +
    '   [config]="switchConfig" />');
}
