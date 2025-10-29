import { Component, computed, input, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.no-margin-top-two]': "noTopMargin()"
  }
})

export class CodeBlock {
  public language = input<string>('typescript');
  public code = input<string>('');
  public noTopMargin = input<boolean>(false);

  public highlightedCode = computed(() => {
    const grammar = Prism.languages[this.language()] ?? Prism.languages["markdown"];
    return Prism.highlight(this.code(), grammar, this.language());
  })
}
