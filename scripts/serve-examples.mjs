import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, resolve, sep } from 'node:path';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const argument = process.argv[2];
const port = argument === undefined ? 3210 : Number(argument);
if (process.argv.length > 3 || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Usage: node scripts/serve-examples.mjs [port: 1..65535]');
}
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.md': 'text/plain' };
const docs = new Set(['/README.md', '/README.en.md', '/docs/algorithms.md',
  '/docs/algorithms.en.md', '/docs/bigint-field-arithmetic.md', '/docs/bigint-field-arithmetic.en.md']);

const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'");
  function reply(status, message) {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  }
  if (request.headers.host !== '127.0.0.1:' + port && request.headers.host !== 'localhost:' + port) {
    reply(403, 'Local examples only');
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    reply(405, 'Method not allowed');
    return;
  }
  try {
    const url = new URL(request.url, 'http://127.0.0.1:' + port);
    const pathname = decodeURIComponent(url.pathname);
    const path = pathname === '/' ? '/examples/browser/index.html' : pathname;
    const extension = extname(path);
    const allowed = (path.startsWith('/examples/') && ['.html', '.css', '.js', '.mjs'].includes(extension)) ||
      (path.startsWith('/src/') && extension === '.js') || docs.has(path);
    if (!allowed || path.split('/').some(part => part.startsWith('.')) || path.includes('\\')) {
      reply(404, 'Not found');
      return;
    }
    const filename = await realpath(resolve(root, '.' + path));
    if (!filename.startsWith(root + sep)) {
      reply(404, 'Not found');
      return;
    }
    const content = await readFile(filename);
    response.writeHead(200, {
      'Content-Type': (url.searchParams.has('source') ? 'text/plain' : types[extension]) + '; charset=utf-8',
      'Content-Length': content.length,
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    if (error instanceof URIError) reply(400, 'Malformed URL');
    else if (['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) reply(404, 'Not found');
    else {
      console.error(error);
      reply(500, 'Unable to serve example');
    }
  }
});
server.on('error', error => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log('cryptos-js examples: http://127.0.0.1:' + port + '/');
  console.log('Local reference examples. Stop with Ctrl+C.');
});
