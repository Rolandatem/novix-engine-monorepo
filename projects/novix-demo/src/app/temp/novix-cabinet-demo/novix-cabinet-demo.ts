import { AfterViewInit, Component, ContentChildren, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NovixCabinetModule, NovixCabinetTrayDirective } from 'novix-engine';

@Component({
  selector: 'novix-cabinet-demo',
  imports: [NovixCabinetModule],
  templateUrl: './novix-cabinet-demo.html',
  styleUrl: './novix-cabinet-demo.scss'
})

export class NovixCabinetDemo implements AfterViewInit {
  @ContentChildren(NovixCabinetTrayDirective)
  public trays!: QueryList<NovixCabinetTrayDirective>;

  @ViewChildren('container', { read: ElementRef})
  public containers!: QueryList<ElementRef<HTMLElement>>;

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.trays.forEach((tray, index) => {
        const contentEl = tray.trayContentRef?.nativeElement;
        const containerEl = this.containers.get(index)?.nativeElement;

        if (contentEl && containerEl && !containerEl.contains(contentEl)) {
          containerEl.appendChild(contentEl);
        }
      })
    })
  }

  public toggleTray(id: string): void {
    this.trays.forEach(tray => {
      tray.trayId() === id ? tray.toggle() : tray.close();
    })
  }
}
