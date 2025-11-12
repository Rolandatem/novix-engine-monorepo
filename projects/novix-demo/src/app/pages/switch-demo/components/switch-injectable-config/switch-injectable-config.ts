import { Component, computed } from '@angular/core';
import { NOVIX_SWITCH_CONFIGURATION, NovixSwitchModule } from 'novix-engine';
import { CodeBlock } from '../../../shared/components/code-block/code-block';

@Component({
  selector: 'app-switch-injectable-config',
  imports: [
    NovixSwitchModule,
    CodeBlock
  ],
  templateUrl: './switch-injectable-config.html',
  styleUrl: './switch-injectable-config.scss',
  providers: [
    {
      provide: NOVIX_SWITCH_CONFIGURATION,
      useValue: {
        rounded: false,
        falseBackgroundColor: 'purple',
        thumbColor: 'cyan'
      }
    }
  ]
})

export class SwitchInjectableConfig {
  public dependencyInjectionExample = computed(() =>
  '@Component({\n' +
  '   selector: \'app-switch-injectable-config\',\n' +
  '   imports: [NovixSwitchModule],\n' +
  '   templateUrl: \'.switch-injectable-config.html\',\n' +
  '   styleUrl: \'./switch-injectable-config.scss\',\n' +
  '   providers: [\n' +
  '     {\n' +
  '       provide: NOVIX_SWITCH_CONFIGURATION,\n' +
  '       useValue: {\n' +
  '         rounded: false,\n' +
  '         falseBackgroundColor: \'purple\',\n' +
  '         thumbColor: \'cyan\'\n' +
  '     }\n' +
  '   ]\n' +
  '}');

  public usageExample = computed(() =>
  '<novix-switch /> \n<novix-switch /> \n<novix-switch /> \n<novix-switch /> \n<novix-switch />');
}
