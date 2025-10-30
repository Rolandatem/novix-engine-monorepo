import { ErrorHandler } from "@angular/core";
import { vi } from "vitest";

export class MockAngularErrorHandler implements ErrorHandler {
  handleError = vi.fn();
}
