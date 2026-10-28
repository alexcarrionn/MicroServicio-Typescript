import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

/** Cuerpo de todas las respuestas de error de la API. */
export interface ErrorResponse {
  error: string;
  message: string;
  details?: { path: string; message: string }[];
}

/**
 * Manejador centralizado: cualquier error sale como JSON, y los errores
 * internos no exponen el mensaje ni la traza.
 */
export function errorHandler(
  error: FastifyError | ZodError,
  request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "La petición no es válida",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    } satisfies ErrorResponse);
  }

  const statusCode = error.statusCode ?? 500;
  if (statusCode >= 500) {
    request.log.error(error);
    return reply.status(500).send({
      error: "Internal Server Error",
      message: "Error interno del servidor",
    } satisfies ErrorResponse);
  }

  return reply.status(statusCode).send({
    error: error.code ?? "Error",
    message: error.message,
  } satisfies ErrorResponse);
}
