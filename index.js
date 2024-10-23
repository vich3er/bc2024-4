const http = require('http');
const { Command } =  require('commander');
const fs =  require('fs').promises;
const program = new Command();

program
    .requiredOption('-h, --host <host>', 'Host address')
    .requiredOption('-p, --port <port>', 'Port number')
    .requiredOption('-c, --cache <cache>', 'cache directory');

program.parse(process.argv);
const options =  program.opts();
const host = options.host;
const port =  options.port;
const cache =  options.cache;

const server =  http.createServer(async(req, res) => {
    res.end('Server is running;)')
});

server.listen(port, host, () => {
    console.log(`Сервер запущено на http://${host}:${port}/`)
});
