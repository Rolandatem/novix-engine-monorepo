import { computed, signal } from "@angular/core";
import { NovixCardinalDirection } from "../../types/NovixCardinalDirections";

/**
 * Mock for the NovixCabinet.
 * Uses 'signal' in place of 'input' properties so we can change
 * values per test and since they are both signals based, should
 * be appropriate.
 */
export class MockNovixCabinet {
  /** Mocks the attachDirection input signal. */
  public attachDirection = signal<NovixCardinalDirection>('left');

  /**
   * Mocks the autoCloseOnOutsideClick input signal.
   */
  public autoCloseOnOutsideClick = signal<boolean>(false);

  /** Mocks the isVertical computed property, but uses same calculation. */
  public isVertical = computed(() => ['top','bottom'].includes(this.attachDirection()));
}
