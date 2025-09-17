import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'novix-tray-demo',
  imports: [],
  templateUrl: './novix-tray-demo.html',
  styleUrl: './novix-tray-demo.scss'
})

export class NovixTrayDemo {
  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  public handleText = input<string>();
  public rounded = input<boolean>(false);

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isOpen = signal<boolean>(false);

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public isOpen = computed(() => this._isOpen());

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
    if (this.isOpen() === false) { return; }
    this._isOpen.set(false);
  }

  public handleLeft(): string {
    return this.isOpen() ? '285px' : '0px';
  }
}
