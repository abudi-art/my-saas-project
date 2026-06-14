export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
): Response {
  return Response.json({ error: { code, message } } satisfies ApiErrorBody, {
    status,
  });
}

export function validationError(message: string): Response {
  return apiError("BAD_REQUEST", message, 400);
}

export function unauthorizedError(
  message = "Missing or invalid API key",
): Response {
  return apiError("UNAUTHORIZED", message, 401);
}

export function forbiddenError(message: string): Response {
  return apiError("FORBIDDEN", message, 403);
}

export function notFoundError(message: string): Response {
  return apiError("NOT_FOUND", message, 404);
}

export function conflictError(message: string): Response {
  return apiError("CONFLICT", message, 409);
}

export function internalError(message = "Internal server error"): Response {
  return apiError("INTERNAL_ERROR", message, 500);
}
