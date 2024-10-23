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
    else if (req.method === 'PUT') {

        let imageData = [];
        req.on('data', chunk => {
            imageData.push(chunk);
        }).on('end', async () => {
            try {
                await fs.writeFile(cachedImagePath, Buffer.concat(imageData));
                res.writeHead(201, { 'Content-Type': 'text/plain' });
                res.end('Created');
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        });
    }
    else if (req.method === 'DELETE') {

        try {
            await fs.unlink(cachedImagePath);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Deleted');
        } catch (err) {

            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        }
    } else {

        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
    }


});

server.listen(port, host, () => {
    console.log(`Сервер запущено на http://${host}:${port}/`);
});
