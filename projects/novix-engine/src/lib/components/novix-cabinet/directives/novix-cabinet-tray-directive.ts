import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, computed, Directive, effect, inject, input, OnDestroy, PLATFORM_ID, signal, TemplateRef } from '@angular/core';
import { NovixCardinalDirection } from '../../../types/NovixCardinalDirections';
import { NovixCabinet } from '../novix-cabinet';

@Directive({
  selector: '[novix-cabinet-tray]'
})

export class NovixCabinetTrayDirective implements AfterViewInit, OnDestroy {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  /** The text to display on the tray handle. */
  public handleText = input<string>('');
  /** Desired width/height (depending on attach direction) otherwise default. */
  public traySize = input<string>('');
  /** Optional handle background color override. */
  public handleBackgroundColor = input<string | null>(null);
  /** Optional handle text color override. */
  public handleColor = input<string | null>(null);
  /** Optional handle font family override. */
  public handleFontFamily = input<string | null>(null);
  /** Optional handle font size override. */
  public handleFontSize = input<string | null>(null);
  /** Optional tray background color override. */
  public contentBackgroundColor = input<string | null>(null);
  /** Optional tray border color override. */
  public contentBorderColor = input<string | null>(null);

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _boundOutsideClickEvent = this.handleOutsideClick.bind(this);
  private _trayEl = signal<HTMLElement | undefined>(undefined);
  private _handleEl = signal<HTMLElement | undefined>(undefined);
  private _trayHandleSize = signal<string>('0px');
  private _parentCabinet = inject(NovixCabinet);

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  /** Whether the tray is currently open. */
  public isOpen = signal<boolean>(false);
  /** The direction in which the parent cabinet is attached. */
  public attachDirection = computed(() => this._parentCabinet.attachDirection());
  /** Size of the tray. */
  public trayContainerSize = signal<string>('');
  /** Computed class name based on the cabinet attached directions, i.e. .openLeft, .openTop, etc. */
  public openClass = computed(() => this.isOpen() ? `open${this.attachDirection().charAt(0).toUpperCase()}${this.attachDirection().slice(1)}` : '')
  /** Reactively calculated width for the tray. */
  public calculatedWidth = computed(() => this._parentCabinet.isVertical() ? null : this.trayContainerSize());
  /** Reactively calculated height for the tray. */
  public calculatedHeight = computed(() => this._parentCabinet.isVertical() ? this.trayContainerSize() : null);
  /** Reactively calculated left position for the tray. */
  public calculatedLeftPosition = computed(() => this.commonPositionCalculation('left'));
  /** Reactively calculated right position for the tray. */
  public calculatedRightPosition = computed(() => this.commonPositionCalculation('right'));
  /** Reactively calculated top position for the tray. */
  public calculatedTopPosition = computed(() => this.commonPositionCalculation('top'));
  /** Reactively calculated bottom position for the tray. */
  public calculatedBottomPosition = computed(() => this.commonPositionCalculation('bottom'));
  /** Reactively calculated left position for the tray handle. */
  public calculatedHandleLeftPosition = computed(() => this.commonHandlePositionCalculation('left'));
  /** Reactively calculated right position for the tray handle. */
  public calculatedHandleRightPosition = computed(() => this.commonHandlePositionCalculation('right'));
  /** Reactively calculated top position for the tray handle. */
  public calculatedHandleTopPosition = computed(() => this.commonHandlePositionCalculation('top'));
  /** Reactively calculated bottom position for the tray handle. */
  public calculatedHandleBottomPosition = computed(() => this.commonHandlePositionCalculation('bottom'));
  /** Reactively calculated handle height. */
  public calculatedHandleHeight = computed(() => {
    const height = this._handleEl()?.offsetHeight ?? 0;
    return `${height}px`;
  })
  /** Reactively calculated handle width. */
  public calculatedHandleWidth = computed(() => {
    const width = this._handleEl()?.offsetWidth ?? 0;
    return `${width}px`;
  })
  /** Offset value to use in open/close transitions. */
  public trayClosedOffset = computed(() => `calc(-1 * (${this.trayContainerSize()} - ${this._trayHandleSize()}))`);

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  constructor() {
    if (!this._isBrowser) { return; }

    effect(() => {
      const enabled = this._parentCabinet.autoCloseOnOutsideClick();

      //--Remove first to avoid possible duplicates.
      document.removeEventListener('click', this._boundOutsideClickEvent, true);
      if (enabled) {
        document.addEventListener('click', this._boundOutsideClickEvent, true);
      }
    })

    effect(() => {
      //--Determine tray size by using specified value, otherwise default.
      this.trayContainerSize.set(this.traySize() !== ''
        ? this.traySize()
        : this._parentCabinet.isVertical() ? '500px' : '300px');
    })
  }

  public ngAfterViewInit(): void {
    //--Measure tray handle size based on direction.
    this._trayHandleSize.set(this._parentCabinet.isVertical()
      ? this.calculatedHandleHeight()
      : this.calculatedHandleWidth());
  }

  public ngOnDestroy(): void {
    if (this._isBrowser) {
      document.removeEventListener('click', this._boundOutsideClickEvent, true);
    }
  }

  //===========================================================================================================================
  // PRIVATE METHODS
  //===========================================================================================================================
  private commonPositionCalculation(direction: NovixCardinalDirection): string | null {
    const attached = this.attachDirection();

    const isSameDirection = attached === direction;
    const isOpposite = (attached === 'left' && direction === 'right') ||
                       (attached === 'right' && direction === 'left') ||
                       (attached === 'top' && direction === 'bottom') ||
                       (attached === 'bottom' && direction === 'top');

    if (isSameDirection && !this.isOpen())
    { return this.trayClosedOffset(); }
    else if (isSameDirection && this.isOpen())
    { return '0px'; }

    if (isOpposite) { return 'auto'; }

    return '0px';
  }

  private commonHandlePositionCalculation(direction: NovixCardinalDirection): string | null {
    const attached = this.attachDirection();
    const isSameDirection = attached === direction;
    const isOpposite = (attached === 'left' && direction === 'right') ||
                       (attached === 'right' && direction === 'left') ||
                       (attached === 'top' && direction === 'bottom') ||
                       (attached === 'bottom' && direction === 'top');

    if (isSameDirection && !this.isOpen())
    { return '0px'; }
    else if (isSameDirection && this.isOpen())
    { return this.trayContainerSize(); }

    if (isOpposite) { return 'auto'; }

    return '0px';
  }

  private handleOutsideClick(event: MouseEvent): void {
    //--No need to run if already closed.
    if (!this.isOpen()) { return; }

    const trayElValue = this._trayEl();
    const handleElValue = this._handleEl();

    //--If handle or tray elements were not set, then this tray is
    //--misconfigured (technically should not happen, but for code
    //--coverage and unit testing)
    if (!trayElValue || !handleElValue) { return; }

    const target = event.target as Node;

    //--Only close if the click target is NOT inside:
    //--1. The tray container itself
    //--2. The tray handle
    const clickedInsideTray = trayElValue.contains(target);
    const clickedOnHandle = handleElValue.contains(target);

    if (!clickedInsideTray && !clickedOnHandle) {
      //--So only if clicked outside both tray or handle, close it.
      this.close();
    }
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  /** Opens the tray if not already open. */
  public open(): void {
    if (this.isOpen()) { return; }
    this.isOpen.set(true);
  }

  /** Closes the tray if not already closed. */
  public close(): void {
    if (this.isOpen() === false) { return; }
    this.isOpen.set(false);
  }

  /** Toggles the tray open/closed. */
  public toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  /** Initialized the tray to have the auto-close feature. */
  // public initAutoClose(): void {
  //   if (this._isBrowser) {
  //     document.addEventListener('click', this._boundOutsideClickEvent, true);
  //   }
  // }

  /**
   * Sets the specific handle and tray elements to the directive for use.
   * @param trayEl Tray element.
   * @param handleEl Handle element.
   */
  public setElementReferences(
    trayEl: HTMLElement | undefined,
    handleEl: HTMLElement | undefined): void {
    this._trayEl.set(trayEl);
    this._handleEl.set(handleEl);
  }
}
