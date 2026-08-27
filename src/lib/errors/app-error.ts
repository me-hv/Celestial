/**
 * Application Error Hierarchy for CELESTIAL
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, identifier?: string) {
    const message = identifier
      ? `${entity} with identifier '${identifier}' was not found.`
      : `${entity} not found.`;
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  public readonly errors?: unknown;

  constructor(message: string, errors?: unknown) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class DatabaseError extends AppError {
  constructor(message = "A database operation failed.", originalError?: unknown) {
    super(message, 500, "DATABASE_ERROR");
    if (originalError) {
      this.cause = originalError;
    }
  }
}

export class ExternalApiError extends AppError {
  public readonly source: string;

  constructor(source: string, message: string) {
    super(`External scientific service '${source}' error: ${message}`, 502, "EXTERNAL_API_ERROR");
    this.source = source;
  }
}
