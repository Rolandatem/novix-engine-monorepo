import { NgModule } from "@angular/core";
import { NovixCabinetTrayDirective } from "../directives/novix-cabinet-tray-directive";
import { NovixCabinet } from "../novix-cabinet";

@NgModule({
  declarations: [],
  imports: [
    NovixCabinet,
    NovixCabinetTrayDirective
  ],
  exports: [
    NovixCabinet,
    NovixCabinetTrayDirective
  ]
})

export class NovixCabinetModule { }
