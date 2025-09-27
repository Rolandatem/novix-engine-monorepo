import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NovixTrayModule } from 'novix-engine';

@Component({
  selector: 'app-utilities-demo',
  imports: [
    NovixTrayModule,
    RouterLink
  ],
  templateUrl: './utilities-demo.html',
  styleUrl: './utilities-demo.scss'
})

export class UtilitiesDemo {

}
