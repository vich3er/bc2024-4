const http = require('http');
const { Command } = require('commander');
const fs = require('fs');

// Створюємо екземпляр програми Commander.js
const program = new Command();

// Налаштування командних аргументів
program
    .option('-h, --host <host>', 'адреса сервера')
    .option('-p, --port <port>', 'порт сервера')
    .option('-c, --cache <cachePath>', 'шлях до директорії кешу');

// Парсимо аргументи командного рядка
program.parse(process.argv);

// Отримуємо значення аргументів
const { host, port, cache } = program.opts();

// Перевірка наявності обов'язкових параметрів
let missingParams = [];

// Перевіряємо наявність хосту
if (!host) missingParams.push('host (-h)');

// Перевіряємо наявність порту та правильність його значення
if (!port || isNaN(Number(port))) {
    missingParams.push('port (-p)');
}

// Перевіряємо наявність значення для кешу
if (!cache || typeof cache !== 'string') {
    missingParams.push('cache (-c)');
}

// Якщо є відсутні параметри, виводимо повідомлення про помилку
if (missingParams.length > 0) {
    console.error(`Помилка: Відсутні обов'язкові параметри: ${missingParams.join(', ')}`);
    process.exit(1);
}

// Перевіряємо, чи існує кеш-директорія
if (!fs.existsSync(cache)) {
    console.error(`Помилка: Директорія ${cache} не існує.`);
    process.exit(1);
}

// Створюємо HTTP-сервер
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Сервер працює!\n');
});

// Запускаємо сервер
server.listen(port, host, () => {
    console.log(`Сервер запущено на http://${host}:${port}`);
});
