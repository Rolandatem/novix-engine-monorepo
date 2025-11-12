import { Component, computed } from '@angular/core';
import { CodeBlock } from '../../../shared/components/code-block/code-block';

@Component({
  selector: 'app-switch-css-overrides',
  imports: [
    CodeBlock
  ],
  templateUrl: './switch-css-overrides.html',
  styleUrl: './switch-css-overrides.scss'
})

export class SwitchCssOverrides {
  private cssVariables: string[] = [
    '--novix-switch-true-background-color: var(--novix-primary);',
    '--novix-switch-false-background-color: red;',
    '--novix-switch-track-border-color: var(--novix-tertiary);',
    '--novix-switch-thumb-color: purple;'
  ];

  public computedCodeExample = (id: string = '') => {
    const props = this.cssVariables.join(`\n   `);
    return `novix-switch${id} {\n   ${props}\n}`;
  }
}
