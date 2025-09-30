import { NgModule } from '@angular/core';
import { TrayHeaderDirective } from '../directives/tray-header-directive';
import { TrayContentDirective } from '../directives/tray-content-directive';
import { NovixTray } from '../novix-tray';

@NgModule({
  declarations: [],
  imports: [
    //NovixTray,
    TrayHeaderDirective,
    TrayContentDirective
  ],
  exports: [
    //NovixTray,
    TrayHeaderDirective,
    TrayContentDirective
  ]
})

export class NovixTrayModule { }
