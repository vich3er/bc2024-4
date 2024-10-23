const http = require('http');
const { Command } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const program = new Command();

program
    .requiredOption('-h, --host <host>', 'Host address')
    .requiredOption('-p, --port <port>', 'Port number')
    .requiredOption('-c, --cache <cache>', 'Cache directory');

program.parse(process.argv);
const options = program.opts();
const host = options.host;
const port = options.port;
const cache = options.cache;

const getCachedImagePath = (statusCode) => path.join(cache, `${statusCode}.jpg`);

const server = http.createServer(async (req, res) => {
    const statusCode = req.url.slice(1);
    const cachedImagePath = getCachedImagePath(statusCode);

    if (req.method === 'GET') {
        try {

            const data = await fs.readFile(cachedImagePath);
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        } catch (err) {

            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        }
    }



});

server.listen(port, host, () => {
    console.log(`Сервер запущено на http://${host}:${port}/`);
});
