import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { httpStatusName } from "./http-status.js";

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
    const statusName = httpStatusName(400);
    return reply.status(400).send({
      error: statusName,
      message: statusName,
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    } satisfies ErrorResponse);
  }

  const statusCode = error.statusCode ?? 500;
  if (statusCode >= 500) {
    request.log.error(error);
    const statusName = httpStatusName(500);
    return reply.status(500).send({
      error: statusName,
      message: statusName,
    } satisfies ErrorResponse);
  }

  const statusName = httpStatusName(statusCode);
  return reply.status(statusCode).send({
    error: statusName,
    message: statusName,
  } satisfies ErrorResponse);
}
