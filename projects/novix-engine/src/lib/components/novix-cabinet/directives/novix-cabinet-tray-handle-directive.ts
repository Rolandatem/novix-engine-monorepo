import { Directive, input } from '@angular/core';

@Directive({
  selector: 'novix-cabinet-tray-handle'
})

export class NovixCabinetTrayHandleDirective {
  public handleText = input<string>('');
}
