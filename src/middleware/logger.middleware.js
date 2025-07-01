import winston from "winston";
// Custom log format
const customFormat = winston.format.printf(({ message}) => {
  return `${new Date().toISOString()}
  req URL: ${message.url} 
  reqBody: ${message.body}
  reqQuery: ${message.query}
  appError:${message.appError ||"NO Error"}
   serverError:${message.serverError ||"No Error"}
  `
})


// Single logger with multiple transports
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.json(),
    customFormat
  ),
  transports: [
    // Regular logs go to log.txt
    new winston.transports.File({ 
      filename: "log.txt",
      level: "info"
    }),
    // Error logs go to serverError.txt
    new winston.transports.File({ 
      filename: "serverError.txt",
      level: "error"
    })
  ],
});

export const loggerMiddleware = async (req, res, next) => {
  let logData ;
  if (!req.url.includes("signIn")) {
    logData = {
      url: req.url,
      body: JSON.stringify(req.body),
      query: JSON.stringify(req.query),
    };

    logger.info({ message: logData });
  }
 next();
};

