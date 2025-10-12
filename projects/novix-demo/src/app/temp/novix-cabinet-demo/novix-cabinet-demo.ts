import { Component } from '@angular/core';

@Component({
  selector: 'novix-cabinet-demo',
  imports: [],
  templateUrl: './novix-cabinet-demo.html',
  styleUrl: './novix-cabinet-demo.scss'
})

export class NovixCabinetDemo {
  public trays = [
    { id: 'tray1', handleText: 'Settings', isOpen: false },
    { id: 'tray2', handleText: 'Profile', isOpen: false },
    { id: 'tray3', handleText: 'Notifications', isOpen: false }
  ];

  openTray(id: string) {
    this.trays.forEach(tray => tray.isOpen = tray.id === id);
  }

  closeTray(id: string) {
    this.trays.find(tray => tray.id === id)!.isOpen = false;
  }

  toggleTray(id: string) {
    this.trays.forEach(tray => { if (tray.id !== id) { tray!.isOpen = false }});
    const tray = this.trays.find(tray => tray.id === id);
    tray!.isOpen = !tray?.isOpen;
  }
}
