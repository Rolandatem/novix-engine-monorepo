import { AfterViewInit, Component, computed, ContentChild, ElementRef, inject, input, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TrayHeaderDirective } from './directives/tray-header-directive';
import { TrayContentDirective } from './directives/tray-content-directive';

@Component({
  selector: 'novix-tray',
  imports: [],
  templateUrl: './novix-tray.html',
  styleUrl: './novix-tray.scss',
  host: {
    '[style.z-index]': "'1000'",
    '[class.attach-left]': "attachDirection() === 'left'",
    '[class.attach-right]': "attachDirection() === 'right'",
    '[class.attach-top]': "attachDirection() === 'top'",
    '[class.attach-bottom]': "attachDirection() === 'bottom'",
    '[class.open]': "isOpen()",
    '[style.left]': "calculatedLeftPosition()",
    '[style.right]': "calculatedRightPosition()",
    '[style.top]': "calculatedTopPosition()",
    '[style.bottom]': "calculatedBottomPosition()",
    '[style.width]': "calculatedWidth()",
    '[style.height]': "calculatedHeight()"
  }
})

export class NovixTray implements AfterViewInit, OnInit, OnDestroy {
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
  /** Direction to attach the tray. */
  public attachDirection = input<'left' | 'right' | 'top' | 'bottom'>('left');
  /** Whether the tray should start open on initial render. */
  public startOpen = input<boolean>(false);
  /**
   * Desired tray size (width or height depending on direction).
   * If not provided defaults to 300px for horizontal and 500px for vertical trays.
   */
  public traySize = input<string>('');
  /** Whether to apply rounded corners to the tray handle or content. */
  public rounded = input<boolean>(false);
  /** Whether they tray should auto-close when clicking outside of the tray. */
  public autoCloseOnOutsideClick = input<boolean>(false);

  //--Tray Handle-------------------
  /** Whether to show the tray handle. Default(true). */
  public showHandle = input<boolean>(true);
  /** Optional text to display inside the tray handle. */
  public handleText = input<string>();
  /** Background color for the tray handle. */
  public handleBackgroundColor = input<string | null>(null);
  /** Text color for the tray handle. */
  public handleColor = input<string | null>(null);
  /** Font family for the tray handle text. */
  public handleFontFamily = input<string | null>(null);
  /** Font size for the tray handle text. */
  public handleFontSize = input<string | null>(null);

  //--Tray Contents-----------------
  /** Background color for the tray content area. */
  public contentBackgroundColor = input<string | null>(null);
  /** Border color for the tray content area. */
  public contentBorderColor = input<string | null>(null);

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isOpen = signal<boolean>(false);
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  /** Whether the tray is currently open. */
  public isOpen = computed(() => this._isOpen());
  /** Whether the tray is attached vertically (top or bottom). */
  public isVertical = computed(() => ['top','bottom'].includes(this.attachDirection()));
  /** Size of the entire novix-tray container (content + handle) */
  public trayContainerSize = signal<string>('');
  /** Offset value to use in open/close transitions, basically the content area size. */
  public trayClosedOffset = computed(() => `calc(-1 * (${this.trayContainerSize()} - ${this._trayHandleSize()}))`);
  /** Reactively calculated left position for tray. */
  public calculatedLeftPosition = computed(() => this.commonPositionCalculation('left'));
  /** Reactively calculated right position for tray. */
  public calculatedRightPosition = computed(() => this.commonPositionCalculation('right'));
  /** Reactively calcualted top position for tray. */
  public calculatedTopPosition = computed(() => this.commonPositionCalculation('top'));
  /** Reactively calculated bottom position for tray. */
  public calculatedBottomPosition = computed(() => this.commonPositionCalculation('bottom'));
  /** Reactively calculated width for the tray. */
  public calculatedWidth = computed(() => {
    return this.isVertical() ? null : this.trayContainerSize();
  });
  /** Reactively calculated height for the tray. */
  public calculatedHeight = computed(() => {
    return this.isVertical() ? this.trayContainerSize() : null;
  });

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngOnInit(): void {
    //--Determine tray size by using specified value, otherwise default.
    this.trayContainerSize.set(this.traySize() !== ''
      ? this.traySize()
      : ['left','right'].includes(this.attachDirection()) ? '300px' : '500px');
  }

  ngAfterViewInit(): void {
    //--Apply initial open state after layout is stable.
    this._isOpen.set(this.startOpen());

    //--Measure tray handle size based on direction.
    this._trayHandleSize.set(this.isVertical()
      ? this.calculateHandleHeight()
      : this.calculateHandleWidth());

    //--Add auto-close event listener if flaged.
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
  private commonPositionCalculation(direction: 'left' | 'right' | 'top' | 'bottom'): string | null {
    const attached = this.attachDirection();

    const isSameDirection = attached === direction;
    const isOpposite = (attached === 'left' && direction === 'right') ||
                       (attached === 'right' && direction === 'left') ||
                       (attached === 'top' && direction === 'bottom') ||
                       (attached === 'bottom' && direction === 'top');

    if (isSameDirection && !this._isOpen())
    { return this.trayClosedOffset(); }
    else if (isSameDirection && this._isOpen())
    { return null; }

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

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  /** Toggles the tray open/closed. */
  public toggleTray(): void {
    this._isOpen.set(!this._isOpen());
  }

  /** Opens the tray if not already open. */
  public openTray(): void {
    if (this._isOpen()) { return; }
    this._isOpen.set(true);
  }

  /** Closes the tray if not already closed. */
  public closeTray(): void {
    if (this.isOpen() === false) { return; }
    this._isOpen.set(false);
  }
}
