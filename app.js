import express from 'express';
import bodyParser from 'body-parser';
import { apiRoutes } from './routes/api-routes.js';

export const app = express();

// middlewares
function notFound(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(404, '404 - Page not found!');
}

app.use(express.static('source/public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: /*__dirname +*/ '/public/' });
});

app.use('/api', apiRoutes);
app.use(notFound);
