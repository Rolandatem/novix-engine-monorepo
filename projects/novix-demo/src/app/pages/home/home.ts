import { Component, computed, ViewChild } from '@angular/core';
import { NovixTrayModule } from 'novix-engine';
import { NovixTrayDemo } from '../../temp/novix-tray-demo/novix-tray-demo';

@Component({
  selector: 'app-home',
  imports: [
    NovixTrayModule,
    NovixTrayDemo
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {
  @ViewChild('leftTray')
  public leftTray!: NovixTrayDemo;

  @ViewChild('rightTray')
  public rightTray!: NovixTrayDemo;


  public toggleLeftTray(): void {
    this.leftTray.toggleTray();
  }

  public toggleRightTray(): void {
    this.rightTray.toggleTray();
  }
}
