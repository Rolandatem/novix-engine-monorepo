import { AfterViewInit, Component, computed, ContentChild, ElementRef, inject, input, model, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { TrayContentDirective, TrayHeaderDirective } from 'novix-engine';
import { FormsModule } from "@angular/forms";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'novix-tray-demo',
  imports: [FormsModule],
  templateUrl: './novix-tray-demo.html',
  styleUrl: './novix-tray-demo.scss',
  host: {
    '[class.attach-left]': "attachDirection() === 'left'",
    '[class.attach-right]': "attachDirection() === 'right'",
    '[class.attach-top]': "attachDirection() === 'top'",
    '[class.attach-bottom]': "attachDirection() === 'bottom'",
    '[style.left]': "calculatedLeftPosition()",
    '[style.right]': "calculatedRightPosition()",
    '[style.top]': "calculatedTopPosition()",
    '[style.bottom]': "calculatedBottomPosition()",
    '[style.width]': "calculatedWidth()",
    '[style.height]': "calculatedHeight()",
    '[class.v-align-top]': "!isVertical() && trayCrossSize() !== '100%' && trayCrossAlign() === 'top'",
    '[class.v-align-center]': "!isVertical() && trayCrossSize() !== '100%' && trayCrossAlign() === 'center'",
    '[class.v-align-bottom]': "!isVertical() && trayCrossSize() !== '100%' && trayCrossAlign() === 'bottom'",
    '[class.h-align-start]': "isVertical() && trayCrossSize() !== '100%' && trayCrossAlign() === 'start'",
    '[class.h-align-center]': "isVertical() && trayCrossSize() !== '100%' && trayCrossAlign() == 'center'",
    '[class.h-align-end]': "isVertical() && trayCrossSize() !== '100%' && trayCrossAlign() == 'end'"
  }
})

export class NovixTrayDemo implements AfterViewInit, OnInit, OnDestroy {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  private _hostRef = inject(ElementRef);

  @ContentChild(TrayHeaderDirective)
  public trayHeader?: TrayHeaderDirective;

  @ContentChild(TrayContentDirective)
  public trayContent!: TrayContentDirective;

  @ViewChild('trayHandleRef')
  private _trayHandleRef!: ElementRef<HTMLElement>;
  private _trayHandleSize = signal<string>('0px');

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  public attachDirection = input<'left' | 'right' | 'top' | 'bottom'>('left');
  public startOpen = input<boolean>(false);
  public traySize = input<string>('');
  public rounded = input<boolean>(false);
  public autoCloseOnOutsideClick = input<boolean>(false);
  public showHandle = input<boolean>(true);
  public handleText = input<string>();

  public trayCrossSize = input<string>('100%');
  public trayCrossAlign = model<'top' | 'center' | 'bottom' | 'start' | 'end'>();

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _isOpen = signal<boolean>(false);

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public isOpen = computed(() => this._isOpen());
  public isVertical = computed(() => ['top','bottom'].includes(this.attachDirection()));
  public trayContainerSize = signal<string>('');
  public trayClosedOffset = computed(() => `calc(-1 * (${this.trayContainerSize()} - ${this._trayHandleSize()}))`);
  public calculatedLeftPosition = computed(() => this.commonPositionCalculation('left'));
  public calculatedRightPosition = computed(() => this.commonPositionCalculation('right'));
  public calculatedTopPosition = computed(() => this.commonPositionCalculation('top'));
  public calculatedBottomPosition = computed(() => this.commonPositionCalculation('bottom'));
  public calculatedWidth = computed(() => {
    if (this.isVertical()) {
      return this.trayCrossSize() !== '100%' ? this.trayCrossSize() : null;
    }

    return this.trayContainerSize();
  });
  public calculatedHeight = computed(() => {
    if (this.isVertical()) {
      return this.trayContainerSize();
    }

    return this.trayCrossSize() !== '100%' ? this.trayCrossSize() : null;
  });

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngOnInit(): void {
    this.trayContainerSize.set(this.traySize() !== ''
      ? this.traySize()
      : ['left','right'].includes(this.attachDirection()) ? '300px' : '500px');

    //if (this.trayCrossSize() !== '100%' && )
  }

  ngAfterViewInit(): void {
    this._isOpen.set(this.startOpen());

    this._trayHandleSize.set(this.isVertical()
      ? this.calculateHandleHeight()
      : this.calculateHandleWidth());

    if (this._isBrowser && this.autoCloseOnOutsideClick()) {
      document.addEventListener('click', this.handleOutsideClick.bind(this), true);
    }
  }

  ngOnDestroy(): void {
    if (this._isBrowser) {
      document.removeEventListener('click', this.handleOutsideClick.bind(this), true);
    }
  }

  //===========================================================================================================================
  // PRIVATE METHODS
  //===========================================================================================================================
  // private commonPositionCalculation(direction: 'left' | 'right' | 'top' | 'bottom'): string {
  //   if (this.attachDirection() !== direction) { return 'auto'; }
  //   return this.isOpen() ? '0px' : this.trayClosedOffset();
  // }
  private commonPositionCalculation(direction: 'left' | 'right' | 'top' | 'bottom'): string {
    const attached = this.attachDirection();
    const isSameDirection = attached === direction;
    const isOpposite = (attached === 'left' && direction === 'right') ||
                       (attached === 'right' && direction === 'left') ||
                       (attached === 'top' && direction === 'bottom') ||
                       (attached === 'bottom' && direction === 'top');

    if (isSameDirection) { return this._isOpen() ? '0px' : this.trayClosedOffset(); }
    if (isOpposite) { return 'auto'; }

    return '0px';
  }

  private calculateHandleHeight() {
    const height = this._trayHandleRef?.nativeElement?.offsetHeight ?? 0;
    return `${height}px`;
  }

  private calculateHandleWidth() {
    const width = this._trayHandleRef?.nativeElement?.offsetWidth ?? 0;
    return `${width}px`;
  }

  private handleOutsideClick(event: MouseEvent) {
    const trayEl = this._hostRef.nativeElement;
    if (!trayEl || !this._isOpen()) { return; }

    if (!trayEl.contains(event.target as Node)) {
      this.closeTray();
    }
  }

  public verticalOffset(side: 'top' | 'bottom'): string | null {
    if (this.trayCrossSize() === '100%') { return null; }

    switch (this.trayCrossAlign()) {
      case 'top' : return side === 'top' ? '0' : null;
      case 'bottom' : return side === 'bottom' ? '0' : null;
      case 'center' : return side === 'top' ? '50%' : null;
      default: return null;
    }
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  public toggleTray(): void {
    this._isOpen.set(!this._isOpen());
  }

  public openTray(): void {
    if (this._isOpen()) { return; }
    this._isOpen.set(true);
  }

  public closeTray(): void {
    if (this._isOpen() === false) { return; }
    this._isOpen.set(false);
  }
}
