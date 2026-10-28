import Fastify, {
  type FastifyInstance,
  type FastifyServerOptions,
} from "fastify";
import { errorHandler } from "./errors.js";
import { routes } from "./routes.js";

/** Construye la aplicación sin ponerla a escuchar, para poder usarla en tests. */
export function buildApp(options: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify(options);
  app.setErrorHandler(errorHandler);
  app.register(routes);
  return app;
}
