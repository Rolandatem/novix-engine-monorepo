import { Component } from '@angular/core';
import { NovixCabinetModule } from 'novix-engine';

@Component({
  selector: 'app-cabinet-demo',
  imports: [
    NovixCabinetModule
  ],
  templateUrl: './cabinet-demo.html',
  styleUrl: './cabinet-demo.scss'
})

export class CabinetDemo {
  public doSomething(): void {
    alert('test');
  }
}
