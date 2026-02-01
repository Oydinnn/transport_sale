import { createLogger, format, transports } from "winston"
import { join } from "path"

export const Logger = createLogger({
  level:"info",
  format:format.combine(
    format.timestamp(),
    format.printf(({timestamp,level,message,method, url}) =>{
      return `${timestamp} [${level}] [${method}] : [${url}] : ${message}`
    })
  ),

  // transports : [
  //   new transports.File({filename: "logger.txt"}),
  //   new transports.Console()
  // ]
  transports: [
    new transports.File({
      filename: join(process.cwd(), "src", "logs", "logger.txt"),
      level: "error",
    }),
    new transports.Console(),
  ],
})