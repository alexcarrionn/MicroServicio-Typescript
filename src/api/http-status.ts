import { STATUS_CODES } from "node:http";

/** Devuelve la frase estándar asociada a un código HTTP conocido. */
export function httpStatusName(statusCode: number): string {
  return STATUS_CODES[statusCode] ?? "Error";
}
