import { NgModule } from '@angular/core';
import { TrayHeaderDirective } from '../directives/tray-header-directive';
import { TrayContentDirective } from '../directives/tray-content-directive';

@NgModule({
  declarations: [],
  imports: [
    TrayHeaderDirective,
    TrayContentDirective
  ],
  exports: [
    TrayHeaderDirective,
    TrayContentDirective
  ]
})

export class NovixTrayModule { }
