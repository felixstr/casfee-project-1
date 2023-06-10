// load app with current config
const app = (await import('./app.js')).app;

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
