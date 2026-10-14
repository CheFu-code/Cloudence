const assert = require('node:assert/strict');
const { before, after, test } = require('node:test');
const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

let server;
let baseUrl;
before(async () => {
  const probe = net.createServer();
  await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, [path.resolve(__dirname, '../node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: path.resolve(__dirname, '..'), stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error(`Production server did not start: ${output}`)), 30_000);
    const read = (chunk) => { output += chunk.toString(); if (output.includes('Ready in')) { clearTimeout(timeout); resolve(); } };
    server.stdout.on('data', read);
    server.stderr.on('data', read);
    server.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Server exited (${code}): ${output}`)); });
  });
});
after(async () => {
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once('exit', resolve));
    server.kill();
    await exited;
  }
});

test('homepage delivers headings, navigation, canonical, and consistent FAQ schema in its HTML', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1[^>]*>/);
  assert.match(html, /Explore the Cloudence workspace/);
  assert.match(html, /aria-label="Main navigation"/);
  assert.match(html, /<title>Cloudence \| Focused Cloud Workspace for Your Files<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/cloudence.chefu.co.za\/?"/);
  assert.doesNotMatch(html, /"@type":"SearchAction"/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const faq = schemas.find((value) => value['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 6);
  for (const entry of faq.mainEntity) {
    assert.ok(html.includes(entry.name));
    assert.ok(html.includes(entry.acceptedAnswer.text.replaceAll('&', '&amp;')));
  }
});

test('private routes and account redirects send noindex headers', async () => {
  for (const route of ['/dashboard', '/documents', '/images', '/media', '/others', '/sign-in', '/sign-up']) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow', route);
  }
});

test('public legal pages have their own canonical and sitemap excludes private routes', async () => {
  for (const route of ['/privacy', '/terms']) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.ok(html.includes(`rel="canonical" href="https://cloudence.chefu.co.za${route}"`));
    assert.equal(response.headers.get('x-robots-tag'), null);
  }
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  assert.match(sitemap, /cloudence.chefu.co.za\/privacy/);
  assert.doesNotMatch(sitemap, /dashboard|documents|sign-in/);
});

test('social preview images render successfully without authentication', async () => {
  for (const route of ['/opengraph-image', '/twitter-image']) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /image\/png/);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.deepEqual([...bytes.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    const view = new DataView(bytes.buffer);
    assert.equal(view.getUint32(16), 1200);
    assert.equal(view.getUint32(20), 630);
  }
});
