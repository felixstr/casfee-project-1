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
/*
app.use(function (req, res, next) {
    setTimeout(next, 1000);
});
*/
app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: '/public/' });
});

app.use('/api', apiRoutes);
app.use(notFound);

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${hostname}:${port}/`);
});
