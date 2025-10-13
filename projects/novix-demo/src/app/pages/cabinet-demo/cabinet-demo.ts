import { Component } from '@angular/core';
import { NovixCabinetDemo } from '../../temp/novix-cabinet-demo/novix-cabinet-demo';
import { NovixCabinetModule } from 'novix-engine';

@Component({
  selector: 'app-cabinet-demo',
  imports: [
    NovixCabinetDemo,
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
