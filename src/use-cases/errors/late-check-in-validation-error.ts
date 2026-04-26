export class LateCheckInValidationError extends Error {
  constructor() {
    super("Check-in cannot be validated if created long time ago.");
  }
}
