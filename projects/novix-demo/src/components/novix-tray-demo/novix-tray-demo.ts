import { AfterViewInit, Component, computed, ContentChild, ElementRef, input, signal, ViewChild } from '@angular/core';
import { TrayContentDirective, TrayHeaderDirective } from 'novix-engine';

@Component({
  selector: 'novix-tray-demo',
  imports: [],
  templateUrl: './novix-tray-demo.html',
  styleUrl: './novix-tray-demo.scss'
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
  public traySize = input<string>('300px');
  public showHandle = input<boolean>(true);
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
  public contentWidth = computed(() => {
    return this.showHandle()
      ? `calc(${this.traySize()} - ${this._trayHandleWidth()})`
      : this.traySize()
  });
  public handleLeft = computed(() => {
    return this.isOpen() ? this.contentWidth() : '0px';
  });

  //===========================================================================================================================
  // LIFECYCLE HOOKS
  //===========================================================================================================================
  ngAfterViewInit(): void {
    const width = this._trayHandleRef?.nativeElement?.offsetWidth ?? 0;
    this._trayHandleWidth.set(`${width}px`);
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
