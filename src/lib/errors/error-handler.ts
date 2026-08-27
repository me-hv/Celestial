import { AppError } from "./app-error";

export interface SerializedError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

export function formatError(error: unknown): SerializedError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: (error as { errors?: unknown }).errors,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };
  }

  return {
    message: "An unexpected error occurred.",
    code: "UNHANDLED_EXCEPTION",
    statusCode: 500,
  };
}
