import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, inject, input, OnDestroy, PLATFORM_ID, signal, TemplateRef } from '@angular/core';

@Directive({
  selector: '[novix-cabinet-tray]'
})

export class NovixCabinetTrayDirective implements OnDestroy {
  private _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _boundOutsideClickEvent = this.handleOutsideClick.bind(this);
  private _trayEl?: HTMLElement;
  private _handleEl?: HTMLElement;

  //==== PUBLIC PROPERTIES =====================================================
  public handleText = input<string>('');
  public trayId = input<string>('');
  public isOpen = signal<boolean>(false);
  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  public open(): void {
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }

  public toggle(id: string): void {
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
}
