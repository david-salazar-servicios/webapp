const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS for origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add other methods as per your requirement
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Include other headers your application may use
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
