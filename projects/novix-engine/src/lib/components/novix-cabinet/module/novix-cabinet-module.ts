import { NgModule } from '@angular/core';
import { NovixCabinetTrayDirective } from '../directives/novix-cabinet-tray-directive';
import { NovixCabinetTrayHandleDirective } from '../directives/novix-cabinet-tray-handle-directive';
import { NovixCabinetTrayContentDirective } from '../directives/novix-cabinet-tray-content-directive';

@NgModule({
  declarations: [],
  imports: [
    NovixCabinetTrayDirective,
    NovixCabinetTrayHandleDirective,
    NovixCabinetTrayContentDirective
  ],
  exports: [
    NovixCabinetTrayDirective,
    NovixCabinetTrayHandleDirective,
    NovixCabinetTrayContentDirective
  ]
})
export class NovixCabinetModule { }
