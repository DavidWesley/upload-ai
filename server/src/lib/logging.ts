// ENV.NODE_ENV === "production" ? "error" : "debug",

export const logger = {
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: {
    level: "error"
  },
  test: false,
}
