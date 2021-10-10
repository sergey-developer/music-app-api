import { createLogger, format, transports } from 'winston'

import { appConfig } from 'configs/app'

const errorLogPath: string = `${appConfig.logsPath}/error.log`

const fileMsgFormat = format.printf(
  ({ level, message, timestamp }) => `${level}: ${message}. ${timestamp}`,
)

const file = new transports.File({
  level: 'warn',
  filename: errorLogPath,
  format: format.combine(
    format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss' }),
    format.align(),
    fileMsgFormat,
  ),
  handleExceptions: true,
  // TODO: "handleRejections" does not exist in TS definitions, update lib later
  // @ts-ignore
  handleRejections: true,
})

const console = new transports.Console({
  level: 'info',
  format: format.combine(format.colorize(), format.align(), format.simple()),
  handleExceptions: true,
  // @ts-ignore
  handleRejections: true,
})

const logger = createLogger({
  transports: [console, file],
  exitOnError: false,
})

export default logger
