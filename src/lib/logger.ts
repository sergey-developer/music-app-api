import config from 'config'
import isEmpty from 'lodash/isEmpty'
import { createLogger, format, transports } from 'winston'

const fileMsgFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp}: [${level}]: ${message}.`

    if (!isEmpty(metadata)) {
      msg += ` . Metadata: ${JSON.stringify(metadata)}`
    }

    return msg
  },
)

const file = new transports.File({
  level: 'warn',
  filename: config.get<string>('app.logs.errorsOutput'),
  format: format.combine(
    format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),
    format.align(),
    fileMsgFormat,
  ),
  handleExceptions: true,
  // "handleRejections" does not exist in TS definitions, update lib later
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
