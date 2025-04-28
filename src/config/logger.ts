import winston from "winston";

export const Logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      level: "info",
      dirname: "logs",
      filename: "info.log",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
    }),
  ],
});
