import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, computed, Directive, inject, input, OnDestroy, PLATFORM_ID, signal, TemplateRef } from '@angular/core';
import { NovixCardinalDirection } from '../../../types/NovixCardinalDirections';
import { NovixCabinet } from '../novix-cabinet';

@Directive({
  selector: '[novix-cabinet-tray]'
})

export class NovixCabinetTrayDirective implements AfterViewInit, OnDestroy {
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _boundOutsideClickEvent = this.handleOutsideClick.bind(this);
  private _trayEl?: HTMLElement;
  private _handleEl?: HTMLElement;
  private _trayHandleSize = signal<string>('0px');
  private _parentCabinet = inject(NovixCabinet);

  //==== PUBLIC PROPERTIES =====================================================
  public handleText = input<string>('');
  public trayId = input<string>('');
  public isOpen = signal<boolean>(false);
  public traySize = input<string>('');
  public attachDirection = computed(() => this._parentCabinet.attachDirection());
  public trayContainerSize = signal<string>('');
  public isVertical = computed(() => ['top', 'bottom'].includes(this.attachDirection()));
  public openClass = computed(() => this.isOpen() ? `open${this.attachDirection().charAt(0).toUpperCase()}${this.attachDirection().slice(1)}` : '')
  public calculatedWidth = computed(() => {
    return this.isVertical() ? null : this.trayContainerSize();
  });
  public calculatedHeight = computed(() => {
    return this.isVertical() ? this.trayContainerSize() : null;
  });
  public calculatedLeftPosition = computed(() => this.commonPositionCalculation('left'));
  public calculatedRightPosition = computed(() => this.commonPositionCalculation('right'));
  public calculatedHandleLeftPosition = computed(() => this.commonHandlePositionCalculation('left'));
  public calculatedHandleRightPosition = computed(() => this.commonHandlePositionCalculation('right'));
  public trayClosedOffset = computed(() => `calc(-1 * (${this.trayContainerSize()} - ${this._trayHandleSize()}))`);
  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);

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

  public open(): void {
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }

  public toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  public initAutoClose(
    /** Tray element */
    trayEl: HTMLElement,
    /** Handle element */
    handleEl: HTMLElement): void {
    if (this._isBrowser) {
      this._trayEl = trayEl;
      this._handleEl = handleEl;
      document.addEventListener('click', this._boundOutsideClickEvent, true);
    }
  }

  public ngAfterViewInit(): void {
    //--Determine tray size by using specified value, otherwise default.
    this.trayContainerSize.set(this.traySize() !== ''
      ? this.traySize()
      : ['left','right'].includes(this.attachDirection()) ? '300px' : '500px');

    //--Measure tray handle size based on direction.
    this._trayHandleSize.set(this.isVertical()
      ? this.calculateHandleHeight()
      : this.calculateHandleWidth());
  }

  public ngOnDestroy(): void {
    if (this._isBrowser) {
      document.removeEventListener('click', this._boundOutsideClickEvent, true);
    }
  }

  public handleOutsideClick(event: MouseEvent): void {
    if (!this.isOpen()) { return; }

    const target = event.target as Node;

    //--Only close if the click target is NOT inside:
    //--1. The tray container itself
    //--2. The tray handle
    const clickedInsideTray = this._trayEl?.contains(target);
    const clickedOnHandle = this._handleEl?.contains(target);

    if (!clickedInsideTray && !clickedOnHandle) {
      //--So only if clicked outside both tray or handle, close it.
      this.close();
    }
  }

  public calculateHandleHeight() {
    const height = this._handleEl?.offsetHeight ?? 0;
    return `${height}px`;
  }

  public calculateHandleWidth() {
    const width = this._handleEl?.offsetWidth ?? 0;
    return `${width}px`;
  }
}
