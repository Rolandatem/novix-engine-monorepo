import { AfterViewInit, Component, ContentChildren, ElementRef, inject, input, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { NovixCabinetModule, NovixCabinetTrayDirective } from 'novix-engine';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'novix-cabinet-demo',
  imports: [NovixCabinetModule, NgTemplateOutlet],
  templateUrl: './novix-cabinet-demo.html',
  styleUrl: './novix-cabinet-demo.scss'
})

export class NovixCabinetDemo implements AfterViewInit {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  @ContentChildren(NovixCabinetTrayDirective)
  public trays!: QueryList<NovixCabinetTrayDirective>;

  @ViewChildren('trayElement', { read: ElementRef })
  public trayElements!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('handleElement', { read: ElementRef })
  public handleElements!: QueryList<ElementRef<HTMLElement>>;

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  public autoCloseOnOutsideClick = input<boolean>(false);

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  //===========================================================================================================================
  // LIFECYCLE METHODS
  //===========================================================================================================================
  public ngAfterViewInit(): void {
    //--Add auto-close event listeners if flagged.
    if (this._isBrowser && this.autoCloseOnOutsideClick()) {
      this.trays.forEach((tray, index) => {
        const trayEl = this.trayElements.get(index)?.nativeElement;
        const handleEl = this.handleElements.get(index)?.nativeElement;
        if (trayEl && handleEl) {
          tray.initAutoClose(trayEl, handleEl);
        }
      });
    }
  }

  public toggleTray(id: string): void {
    this.trays.forEach(tray => {
      tray.trayId() === id ? tray.toggle(id) : tray.close();
    })
  }
}
