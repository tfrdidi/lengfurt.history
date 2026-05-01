const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 8000;
const host = '127.0.0.1';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp'
};

const send = (response, statusCode, body, contentType = 'text/plain; charset=utf-8') => {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end(body);
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    send(response, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(response, 404, 'Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    send(response, 200, data, contentTypes[extension] || 'application/octet-stream');
  });
});

server.listen(port, host, () => {
  console.log(`Lokaler Server laeuft auf http://${host}:${port}/`);
  console.log('Zum Beenden Strg+C druecken.');
});
