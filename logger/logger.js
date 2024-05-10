import { createLogger, format, transports } from 'winston';

const {
  combine, printf, timestamp, colorize,
} = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [new transports.Console()],
});

export default logger;
