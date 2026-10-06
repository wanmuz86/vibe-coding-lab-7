export type DomainErrorCode = "FORBIDDEN" | "NOT_FOUND" | "INVALID";

export class DomainError extends Error {
  readonly code: DomainErrorCode;

  constructor(message: string, code: DomainErrorCode) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
