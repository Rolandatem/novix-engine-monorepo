import { Component, computed, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'novix-tray',
  imports: [],
  templateUrl: './novix-tray.html',
  styleUrl: './novix-tray.css'
})

export class NovixTray implements OnInit {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  private _isOpen = signal<boolean>(false);

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  public open = input<boolean>(false);
  public attach = input<'top' | 'bottom' | 'left' | 'right'>('left');
  public fixed = input<boolean>(true);
  public size = input<string>('300px');
  public showSeparator = input<boolean>(true);
  public handleText = input<string>('');

  //===========================================================================================================================
  //--PUBLIC PROPERTIES
  //===========================================================================================================================
  public isOpen = computed(() => this._isOpen());
  public hasHeader = signal<boolean>(false);

  //===========================================================================================================================
  // LIFECYCLE METHODS
  //===========================================================================================================================
  public ngOnInit(): void {
    this._isOpen.set(this.open());
  }

  //===========================================================================================================================
  // PUBLIC METHODS
  //===========================================================================================================================
  public toggle(): void {
    this._isOpen.set(!this._isOpen());
  }

  public isVertical(): boolean {
    return this.attach() === 'left' || this.attach() === 'right';
  }

  public trayWidth(): string {
    return this.isVertical()
      ? (this.isOpen() ? this.size() : this.handleText() ? 'auto' : '15px')
      : '100vw';
  }

  public trayHeight(): string {
    return this.isVertical()
      ? '100vh'
      : (this.isOpen() ? this.size() : this.handleText() ? 'auto' : '15px');
  }
}
