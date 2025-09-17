import { Component, input } from '@angular/core';

@Component({
  selector: 'app-color-opacity',
  imports: [],
  templateUrl: './color-opacity.html',
  styleUrl: './color-opacity.scss'
})
export class ColorOpacity {
  public colorTokens = input<string[]>([]);
  public opacitySteps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
}
