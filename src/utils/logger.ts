const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
        format: winston.format.simple(),
      })
    ]
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.File({ filename: 'logger/combined.log' }));
  logger.add(new winston.transports.File({ filename: 'logger/error.log', level: 'error' }));
}

export default logger