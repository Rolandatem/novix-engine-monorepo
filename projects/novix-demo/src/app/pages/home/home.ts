import { Component, ViewChild } from '@angular/core';
import { NovixTray, NovixTrayModule } from 'novix-engine';

@Component({
  selector: 'app-home',
  imports: [
    NovixTrayModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {
  @ViewChild('leftTray')
  public leftTray!: NovixTray;

  @ViewChild('rightTray')
  public rightTray!: NovixTray;

  public toggleTray(tray: NovixTray): void {
    tray.toggleTray();
  }
}
