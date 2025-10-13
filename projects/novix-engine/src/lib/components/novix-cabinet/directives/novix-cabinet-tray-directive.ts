import { ContentChild, Directive, ElementRef, input, signal } from '@angular/core';
import { NovixCabinetTrayHandleDirective } from './novix-cabinet-tray-handle-directive';
import { NovixCabinetTrayContentDirective } from './novix-cabinet-tray-content-directive';

@Directive({
  selector: 'novix-cabinet-tray'
})

export class NovixCabinetTrayDirective {
  public trayId = input<string>('');
  public isOpen = signal<boolean>(false);

  public open(): void {
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }

  public toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  @ContentChild(NovixCabinetTrayHandleDirective)
  public trayHandle!: NovixCabinetTrayHandleDirective;

  @ContentChild(NovixCabinetTrayContentDirective, { read: ElementRef })
  public trayContentRef!: ElementRef<HTMLElement>;

  public trayHandleText(): string {
    return this.trayHandle?.handleText() ?? '';
  }
}
