import { Component, ContentChildren, ElementRef, forwardRef, inject, input, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { NovixCabinetTrayDirective } from './directives/novix-cabinet-tray-directive';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { NovixCardinalDirection } from '../../types/NovixCardinalDirections';

@Component({
  selector: 'novix-cabinet',
  imports: [NgTemplateOutlet],
  templateUrl: './novix-cabinet.html',
  styleUrl: './novix-cabinet.scss',
  host: {
    '[class.attach-left]': "attachDirection() === 'left'",
    '[class.attach-right]': "attachDirection() === 'right'",
    '[class.attach-top]': "attachDirection() === 'top'",
    '[class.attach-bottom]': "attachDirection() === 'bottom'"
  }
})

export class NovixCabinet {
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
  public attachDirection = input<NovixCardinalDirection>('left');

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  //===========================================================================================================================
  // LIFECYCLE METHODS
  //===========================================================================================================================
  public ngAfterViewInit(): void {
    //--Iterate trays.
    this.trays.forEach((tray, index) => {
      //--Create reference to tray and handle elements.
      const trayEl = this.trayElements.get(index)?.nativeElement;
      const handleEl = this.handleElements.get(index)?.nativeElement;

      //--Browser only actions
      if (this._isBrowser) {
        //--Add auto-close event listener if flagged.
        if (trayEl && handleEl && this.autoCloseOnOutsideClick()) {
          tray.initAutoClose(trayEl, handleEl);
        }
      }
    })
  }

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public toggleTray(idx: number): void {
    this.trays.forEach((tray, i) => {
      i === idx ? tray.toggle() : tray.close();
    })
  }
}
