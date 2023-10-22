/*
    Starting point for the app
*/

import { createServer } from 'http';
import app from './app';

const port = process.env.PORT || 3000;
const server = createServer(app);

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});
