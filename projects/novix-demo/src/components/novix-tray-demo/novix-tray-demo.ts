import { AfterViewInit, Component, computed, ContentChild, ElementRef, input, signal, ViewChild } from '@angular/core';
import { TrayContentDirective, TrayHeaderDirective } from 'novix-engine';

@Component({
  selector: 'novix-tray-demo',
  imports: [],
  templateUrl: './novix-tray-demo.html',
  styleUrl: './novix-tray-demo.scss',
  host: {
    '[class.attach-left]': 'attachDirection() === "left"',
    '[class.attach-right]': 'attachDirection() === "right"'
  }
})

export class NovixTrayDemo implements AfterViewInit {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  @ViewChild('trayHandleRef')
  private _trayHandleRef!: ElementRef<HTMLElement>;
  private _trayHandleWidth = signal<string>('0px');

  //===========================================================================================================================
  // CHILD TAGS
  //===========================================================================================================================
  @ContentChild(TrayHeaderDirective)
  public trayHeader?: TrayHeaderDirective;
  @ContentChild(TrayContentDirective)
  public trayContent!: TrayContentDirective;

  //===========================================================================================================================
  // INPUT PROPERTIES
  //===========================================================================================================================
  //--Non-specific
  public attachDirection = input<'left' | 'right'>('left');
  public startOpen = input<boolean>(false);
  public rounded = input<boolean>(false);
  public traySize = input<string>('300px');

  //--Tray handle
  public showHandle = input<boolean>(true);
  public handleText = input<string>();
  public handleBackground = input<string>('var(--primary)');
  public handleColor = input<string>('var(--on-primary)');
  public handleFontFamily = input<string>('var(--font-family)');
  public handleFontSize = input<string>('var(--font-size-xs)');

  //--Tray contents
  public contentsBackground = input<string>('var(--surface)');
  public contentsColor = input<string>('var(--on-surface)');
  public contentsBorderColor = input<string>('var(--primary)');

  //===========================================================================================================================
  // PRIVATE PROPERTIES
  //===========================================================================================================================
  private _isOpen = signal<boolean>(false);

  //===========================================================================================================================
  // PUBLIC PROPERTIES
  //===========================================================================================================================
  public isOpen = computed(() => this._isOpen());
  public templateIsRendered = signal<boolean>(false);
  public trayDimension = computed(() => {
    return this.showHandle()
      ? `calc(${this.traySize()} - ${this._trayHandleWidth()})`
      : this.traySize()
  });
  public handleOffset = computed(() => {
    const size = this.trayDimension();
    return this.isOpen() ? size : '0px';
  });

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngAfterViewInit(): void {
    const width = this._trayHandleRef?.nativeElement?.offsetWidth ?? 0;
    this._trayHandleWidth.set(`${width}px`);

    this._isOpen.set(this.startOpen());

    this.templateIsRendered.set(true);
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
    if (this.isOpen() === false) { return; }
    this._isOpen.set(false);
  }
}
