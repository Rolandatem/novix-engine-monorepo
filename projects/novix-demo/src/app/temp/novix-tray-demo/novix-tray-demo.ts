import { AfterViewInit, Component, computed, ContentChild, ElementRef, inject, input, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
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
    '[style.width]': "trayContainerSize()",
    '[style.left]': "calculatedLeftPosition()",
    '[style.right]': "calculatedRightPosition()",

    '[style.height]': "trayHeight() !== '100%' ? trayHeight() : null",
    '[class.v-align-top]': "trayHeight() !== '100%' && trayVerticalAlign() === 'top'",
    '[class.v-align-center]': "trayHeight() !== '100%' && trayVerticalAlign() === 'center'",
    '[class.v-align-bottom]': "trayHeight() !== '100%' && trayVerticalAlign() === 'bottom'"
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
  public handleBackground = input<string>('var(--novix-primary)');
  public handleColor = input<string>('var(--novix-on-primary)');
  public handleFontFamily = input<string>('var(--novix-font-family)');
  public handleFontSize = input<string>('var(--novix-font-size-xs)');
  public contentsBackground = input<string>('var(--novix-surface)');
  public contentsColor = input<string>('var(--novix-on-surface)');
  public contentsBorderColor = input<string>('var(--novix-primary)');

  public trayHeight = input<string>('100%');
  public trayVerticalAlign = input<'top' | 'center' | 'bottom'>('top');

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

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngOnInit(): void {
    this.trayContainerSize.set(this.traySize() !== ''
      ? this.traySize()
      : ['left','right'].includes(this.attachDirection()) ? '300px' : '500px');
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
  private commonPositionCalculation(direction: 'left' | 'right' | 'top' | 'bottom'): string {
    if (this.attachDirection() !== direction) { return 'auto'; }
    return this.isOpen() ? '0px' : this.trayClosedOffset();
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
    if (this.trayHeight() === '100%') { return null; }

    switch (this.trayVerticalAlign()) {
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
