import express from 'express'
import http from 'http';
import { matchRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';


const PORT = Number.parseInt(process.env.PORT ?? '8000', 10);
   if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
        throw new Error(`Invalid PORT: ${process.env.PORT}`);
    }
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from express server');
});

app.use('/matches', matchRouter)

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);

});
