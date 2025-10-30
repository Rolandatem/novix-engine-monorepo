import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NovixCabinetModule } from 'novix-engine';

@Component({
  selector: 'app-utilities-demo',
  imports: [
    NovixCabinetModule,
    RouterLink
  ],
  templateUrl: './utilities-demo.html',
  styleUrl: './utilities-demo.scss'
})

export class UtilitiesDemo {

}
