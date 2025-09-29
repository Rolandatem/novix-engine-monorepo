import { AfterViewInit, Component, computed, ContentChild, ElementRef, inject, input, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { TrayHeaderDirective } from './directives/tray-header-directive';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'novix-tray',
  imports: [],
  templateUrl: './novix-tray.html',
  styleUrl: './novix-tray.scss',
  host: {
    '[style.z-index]': "'1000'",
    '[class.attach-left]': 'attachDirection() === "left"',
    '[class.attach-right]': 'attachDirection() === "right"',
    '[class.attach-top]': 'attachDirection() === "top"',
    '[class.attach-bottom]': 'attachDirection() === "bottom"'
  }
})

export class NovixTray implements AfterViewInit, OnInit, OnDestroy {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  @ViewChild('trayContainerRef')
  private _trayContainerRef!: ElementRef<HTMLElement>;

  @ViewChild('trayHandleRef')
  private _trayHandleRef!: ElementRef<HTMLElement>;
  private _trayHandleSize = signal<string>('0px');

  @ContentChild(TrayHeaderDirective)
  public trayHeader?: TrayHeaderDirective;

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  //--Non-specific-------------------------------------------------------------------------------------------------------------
  /**
   * Direction to attach the tray: 'left', 'right', 'tpp', or 'bottom'.
   * Determines layout, transform axis, and handle positioning.
   */
  public attachDirection = input<'left' | 'right' | 'top' | 'bottom'>('left');
  /**
   * Whether the tray should start open on initial render. Applied after view init
   * to avoid transition flicker.
   */
  public startOpen = input<boolean>(false);
  /** Whether to apply rounded corners to the tray handle or content. */
  public rounded = input<boolean>(false);
  /**
   * Desired tray size (width or height depending on direction).
   * If not provided, defaults to 300px for horizontal and 500px for vertical trays.
   * However this default setting does not kick in until onInit because setting a value
   * based the conditional value of attachDirection is not testable here.
   */
  public traySize = input<string>('');

  /** Whether the tray should auto-close when clicking outside of the tray. */
  public autoCloseOnOutsideClick = input<boolean>(false);

  //--Tray handle--------------------------------------------------------------------------------------------------------------
  /** Whether to show the tray handle. */
  public showHandle = input<boolean>(true);
  /** Optional text to display inside the tray handle. */
  public handleText = input<string>();
  /** Background color for the tray handle. */
  public handleBackground = input<string>('var(--novix-primary)');
  /** Text color for the tray handle. */
  public handleColor = input<string>('var(--novix-on-primary)');
  /** Font family for the tray handle text. */
  public handleFontFamily = input<string>('var(--novix-font-family)');
  /** Font size for the tray handle text. */
  public handleFontSize = input<string>('var(--novix-font-size-xs)');

  //--Tray contents------------------------------------------------------------------------------------------------------------
  /** Background color for the tray content area. */
  public contentsBackground = input<string>('var(--novix-surface)');
  /** Text color for the tray content area. */
  public contentsColor = input<string>('var(--novix-on-surface)');
  /** Border color for the tray content area. */
  public contentsBorderColor = input<string>('var(--novix-primary)');

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isOpen = signal<boolean>(false);
  private _traySizeInternal = signal<string>('');
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  /** Whether the tray is currently open. */
  public isOpen = computed(() => this._isOpen());
  /** Set to true after view initialization, confirming that dynamic layout classes and bindings are active. */
  public templateIsRendered = signal<boolean>(false);
  /** Whether the tray is attached vertically (top or bottom). Used to determine transform axis and layout logic. */
  public isVertical = computed(() => ['top', 'bottom'].includes(this.attachDirection()));
  /** Computed tray dimension (width or height depending on direction). Subtracts handle size if handle is visible. */
  public trayDimension = computed(() => {
    const size = this._traySizeInternal();
    const handle = this._trayHandleSize();
    return this.showHandle()
      ? `calc(${size} - ${handle})`
      : size
  });
  /** Offset for tray handle positioning. Returns tray dimension if open, otherwise 0px. */
  public handleOffset = computed(() => {
    const size = this.trayDimension();
    return this.isOpen() ? size : '0px';
  });

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngOnInit(): void {
    this._traySizeInternal.set(this.traySize() !== ''
      ? this.traySize()
      : ['left','right'].includes(this.attachDirection()) ? '300px' : '500px');
  }

  ngAfterViewInit(): void {
    //--Measure tray handle size based on direction.
    this._trayHandleSize.set(this.isVertical()
      ? this.calculateHandleHeight()
      : this.calculateHandleWidth());

    //--Apply initial open state after layout is stable.
    this._isOpen.set(this.startOpen());

    //--Signal that template is safe to render.
    this.templateIsRendered.set(true);

    //--Add auto-close event listener if flagged.
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
  private calculateHandleWidth(): string {
    const width = this._trayHandleRef?.nativeElement?.offsetWidth ?? 0;
    return `${width}px`;
  }

  private calculateHandleHeight(): string {
    const height = this._trayHandleRef?.nativeElement?.offsetHeight ?? 0;
    return `${height}px`;
  }

  private handleOutsideClick(event: MouseEvent) {
    const trayEl = this._trayContainerRef.nativeElement;
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
