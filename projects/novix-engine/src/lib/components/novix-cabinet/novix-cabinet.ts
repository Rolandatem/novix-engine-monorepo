import { Component, computed, ContentChildren, ElementRef, HostBinding, inject, input, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
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
    '[class.attach-bottom]': "attachDirection() === 'bottom'",
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

  @HostBinding('style')
  get marginStyles() {
    if (this.edgeMargin() == null) { return {}; }

    return this.isVertical()
      ? {
        'inset-inline-start': `${this.edgeMargin()} !important`,
        'inset-inline-end': `${this.edgeMargin()} !important`
      }
      : {
        'inset-block-start': `${this.edgeMargin()} !important`,
        'inset-block-end': `${this.edgeMargin()} !important`
      }
  }

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  /** The direction in which the cabinet is attached. */
  public attachDirection = input<NovixCardinalDirection>('left');
  /** Whether to auto-close trays when clicking outside of the cabinet. */
  public autoCloseOnOutsideClick = input<boolean>(false);
  /** Whether to apply rounded corners to the tray handles. */
  public rounded = input<boolean>(false);
  /** Margin to place on edges of the cabinet. */
  public edgeMargin = input<string | null>(null);
  /** How to justify the handles against the cabinet. */
  public justifyHandles = input<'start' | 'center' | 'end'>('start');

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public isVertical = computed(() => ['top', 'bottom'].includes(this.attachDirection()));

  //===========================================================================================================================
  // LIFECYCLE METHODS
  //===========================================================================================================================
  public ngAfterViewInit(): void {
    //--Iterate trays.
    this.trays.forEach((tray, index) => {
      //--Create reference to tray and handle elements.
      tray.setElementReferences(
        this.trayElements.get(index)?.nativeElement,
        this.handleElements.get(index)?.nativeElement
      )
    })
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  /** Toggle the specified tray, closing all others. */
  public toggleTray(idx: number): void {
    this.trays.forEach((tray, i) => {
      i === idx ? tray.toggle() : tray.close();
    })
  }
}
