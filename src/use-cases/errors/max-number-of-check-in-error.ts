export class MaxNumberOfCheckInError extends Error {
  constructor() {
    super("Max number check-in reached.");
  }
}
