import config from 'config'
import isEmpty from 'lodash/isEmpty'
import winston from 'winston'

const env = config.util.getEnv('NODE_ENV')
const logToFile: boolean = env === 'production'
const disableLogs: boolean = env === 'test'

const console = new winston.transports.Console({
  level: 'warn',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.align(),
    winston.format.simple(),
  ),
  handleExceptions: true,
  // @ts-ignore
  handleRejections: true,
})

const logger = winston.createLogger({
  transports: [console],
  exitOnError: false,
})

if (logToFile) {
  const fileMsgFormat = winston.format.printf(
    ({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp}: [${level}]: ${message}.`

      if (!isEmpty(metadata)) {
        msg += ` . Metadata: ${JSON.stringify(metadata)}`
      }

      return msg
    },
  )

  const file = new winston.transports.File({
    level: 'warn',
    filename: config.get<string>('app.logs.errorsOutput'),
    format: winston.format.combine(
      winston.format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),
      winston.format.align(),
      fileMsgFormat,
    ),
    handleExceptions: true,
    // "handleRejections" does not exist in TS definitions, update lib later
    // @ts-ignore
    handleRejections: true,
  })

  logger.add(file)
}

if (false) {
  logger.silent = true
}

export default logger
