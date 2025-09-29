import { AfterViewInit, Component, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';
import * as Prism from 'prismjs';

import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';

@Component({
  selector: 'app-code-block',
  imports: [],
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',

  //--Use ViewEncapsulation.None to allow PrismJS styling to apply
  //--to the inner content.
  encapsulation: ViewEncapsulation.None
})

export class CodeBlock implements AfterViewInit {
  public language = input<string>('typescript');
  public code = input<string>('');

  private _elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    Prism.highlightAllUnder(this._elementRef.nativeElement);
  }
}
