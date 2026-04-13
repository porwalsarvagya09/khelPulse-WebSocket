import express from 'express'
import http from 'http';
import { matchRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';
import { logger } from "./middleware/logger.js";
import 'dotenv/config';

import helmet from 'helmet';
import cors from 'cors';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from "./middleware/errorHandler.js";

import { authRouter } from "./routes/auth.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const PORT = Number.parseInt(process.env.PORT ?? '8000', 10);
   if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
        throw new Error(`Invalid PORT: ${process.env.PORT}`);
    }
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(globalLimiter);
app.use(express.json({ limit: "20kb" }));

app.get('/', (req, res) => {
    res.send('Hello from express server');
});

app.use(logger);
app.use("/auth", authRouter);
app.use('/matches', matchRouter)
app.use(errorHandler);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);

});
