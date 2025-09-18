import { AfterViewInit, Component, computed, ContentChild, ElementRef, input, signal, ViewChild } from '@angular/core';
import { TrayContentDirective, TrayHeaderDirective } from 'novix-engine';

@Component({
  selector: 'novix-tray-demo',
  imports: [],
  templateUrl: './novix-tray-demo.html',
  styleUrl: './novix-tray-demo.scss',
  host: {
    '[class.attach-left]': 'attachDirection() === "left"',
    '[class.attach-right]': 'attachDirection() === "right"',
    '[class.attach-top]': 'attachDirection() === "top"',
    '[class.attach-bottom]': 'attachDirection() === "bottom"'
  }
})

export class NovixTrayDemo implements AfterViewInit {
  //===========================================================================================================================
  // MEMBER VARIABLES
  //===========================================================================================================================
  @ViewChild('trayHandleRef')
  private _trayHandleRef!: ElementRef<HTMLElement>;
  private _trayHandleSize = signal<string>('0px');

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
  public attachDirection = input<'left' | 'right' | 'top' | 'bottom'>('left');
  public startOpen = input<boolean>(false);
  public rounded = input<boolean>(false);
  public traySize = input<string>(['left','right'].includes(this.attachDirection()) ? '300px' : '500px');

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
  public isVertical = computed(() => ['top', 'bottom'].includes(this.attachDirection()));
  public trayDimension = computed(() => {
    const size = this.traySize();
    const handle = this._trayHandleSize();
    return this.showHandle()
      ? `calc(${size} - ${handle})`
      : size
  });
  public handleOffset = computed(() => {
    const size = this.trayDimension();
    return this.isOpen() ? size : '0px';
  });

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngAfterViewInit(): void {
    this._trayHandleSize.set(this.isVertical()
      ? this.calculateHandleHeight()
      : this.calculateHandleWidth());

    this._isOpen.set(this.startOpen());

    this.templateIsRendered.set(true);
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
