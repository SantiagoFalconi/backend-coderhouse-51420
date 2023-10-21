import winston from "winston";


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
     }
};

winston.addColors(customLevelsOptions.colors);

const developmentLogger = winston.createLogger({
    levels : customLevelsOptions.levels,
    level: 'debug',
    transports: [
        new winston.transports.Console(),
    ],
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
    ),
});

const productionLogger = winston.createLogger({
    levels : customLevelsOptions.levels,
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'production.log' }), 
    ],
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.json(),
    ),
});

const getLogger = () => {
    if (process.env.NODE_ENV === 'production') {
        return productionLogger;
    }
    return developmentLogger;
};

const logger = getLogger();

export default logger;