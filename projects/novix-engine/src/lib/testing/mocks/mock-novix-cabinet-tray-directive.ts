import { signal } from "@angular/core";
import { vi } from "vitest";

export const createMockNovixCabinetTrayDirective = () => {

  return {
    handleText: vi.fn(),
    traySize: vi.fn(),
    handleBackgroundColor: vi.fn(),
    handleColor: vi.fn(),
    handleFontFamily: vi.fn(),
    handleFontSize: vi.fn(),
    contentBackgroundColor: vi.fn(),
    contentBorderColor: vi.fn(),
    isOpen: signal<boolean>(false),
    attachDirection: vi.fn(),
    trayContainerSize: vi.fn(),
    openClass: vi.fn(),
    calculatedWidth: vi.fn(),
    calculatedHeight: vi.fn(),
    calculatedLeftPosition: vi.fn(),
    calculatedRightPosition: vi.fn(),
    calculatedTopPosition: vi.fn(),
    calculatedBottomPosition: vi.fn(),
    calculatedHandleLeftPosition: vi.fn(),
    calculatedHandleRightPosition: vi.fn(),
    calculatedHandleTopPosition: vi.fn(),
    calculatedHandleBottomPosition: vi.fn(),
    calculatedHandleHeight: vi.fn(),
    calculatedHandleWidth: vi.fn(),
    trayClosedOffset: vi.fn(),

    setElementReferences: vi.fn(),
    toggle: function() { this.isOpen.set(!this.isOpen()); },
    open: function() {
      if (this.isOpen()) { return; }
      this.isOpen.set(true);
    },
    close: function() {
      if (!this.isOpen()) { return; }
      this.isOpen.set(false);
    }
  }
}
