import express from 'express';
import bodyParser from 'body-parser';
import { apiRoutes } from './source/server/routes/api-routes.js';

const app = express();

app.use(express.static('source/client'));
app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(404).send('404 - Page not found!!');
});

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${hostname}:${port}/`);
});
