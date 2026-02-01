import { createLogger, format, transports } from "winston";
import { join } from "path";

export const Logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => {
      const timestamp = info.timestamp;
      const level = info.level.toUpperCase();
      const message = info.message;
      const method = info.method;
      const url = info.url;
      const ip = info.ip;
      const userAgent = info.userAgent;
      return `${timestamp} [${level}] [${method}] [${url}] [${ip}] [${userAgent}] : ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: join(process.cwd(), "src", "logs", "logger.txt"),
      level: "info"
    })
  ]
});