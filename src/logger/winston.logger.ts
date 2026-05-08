import winston, { Logger, format, transports } from "winston";

// Define your severity levels.
const levels: Record<string, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = (): string => {
    const env: string = process.env.NODE_ENV || "development";
    const isDevelopment: boolean = env === "development";
    return isDevelopment ? "debug" : "warn";
};

const colors: Record<string, string> = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const logFormat = format.combine(
    // Add the message timestamp with the preferred format
    format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
    // Tell Winston that the logs must be colored
    format.colorize({ all: true }),
    // Define the format of the message showing the timestamp, the level and the message
    format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const isProduction: boolean = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

const loggerTransports: transports.StreamTransportInstance[] | transports.FileTransportInstance[] = [
    // Allow the use the console to print the messages
    new transports.Console(),
];

if (!isProduction) {
    loggerTransports.push(
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/info.log", level: "info" }),
        new transports.File({ filename: "logs/http.log", level: "http" }),
    );
}

// Create the logger instance that has to be exported
// and used to log messages.
const logger: Logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports: loggerTransports,
});

export default logger;