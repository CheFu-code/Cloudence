const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { createRequire } = require('node:module');
const os = require('node:os');
const { test } = require('node:test');
const webRoot = path.resolve(__dirname, '..');
// Use the workspace's existing browser tooling; standalone checkouts can set PUPPETEER_MODULE.
const puppeteer = process.env.PUPPETEER_MODULE ? require(process.env.PUPPETEER_MODULE) : createRequire(path.resolve(webRoot, '../chefu-inc-backend/package.json'))('puppeteer');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cloudence-folder-test-'));
const mockPath = path.join(temp, 'mock-api.cjs');
fs.writeFileSync(mockPath, `
const originalFetch = global.fetch;
const folders = [];
const file = {id:'file-1',name:'report.pdf',type:'document',extension:'pdf',url:'https://api.chefu.co.za/cloudence/files/file-1/content',size:123,owner:{id:'test-user',email:'test@example.com',fullName:'Test User'},users:[],isOwner:true,createdAt:'2026-10-14T00:00:00Z',updatedAt:'2026-10-14T00:00:00Z',folderId:null};
const files = [file, {...file, id:'file-2', name:'notes.pdf'}];
global.fetch = async (input, init = {}) => {
 const url = new URL(typeof input === 'string' ? input : input.url || String(input));
 if (['127.0.0.1','localhost'].includes(url.hostname)) return originalFetch(input, init);
 const method = init.method || 'GET';
 const body = init.body ? JSON.parse(init.body) : {};
 let data;
 if (url.pathname === '/auth/me') data = { user: {uid:'test-user',email:'test@example.com',displayName:'Test User'} };
 else if (url.pathname === '/cloudence/files' && method === 'GET') data = {total:2,documents:files.filter(file=>!url.searchParams.get('folder') || url.searchParams.get('folder')===file.folderId),folders:folders.filter(f=>f.section===url.searchParams.get('section'))};
 else if (url.pathname === '/cloudence/files/folders' && method === 'POST') { folders.push({id:'folder-'+(folders.length+1),name:body.name,section:body.section,createdAt:new Date().toISOString()}); data={status:'success'}; }
 else if (url.pathname === '/cloudence/files/file-1/folder' && method === 'PATCH') { file.folderId = body.folderId; data={status:'success'}; }
 else if (url.pathname === '/cloudence/files/folders/move' && method === 'POST') {files.filter(file=>body.fileIds.includes(file.id)).forEach(file=>file.folderId=body.folderId);data={status:'success',moved:body.fileIds.length};}
 else if (url.pathname === '/cloudence/files/folders/cleanup' && method === 'POST') data={status:'success',cleaned:0,checked:0,remaining:0};
 else if (url.pathname === '/cloudence/files/folders/folder-1' && method === 'DELETE') {folders.splice(folders.findIndex(f=>f.id==='folder-1'),1);files.forEach(file=>{if(file.folderId==='folder-1')file.folderId=null;});data={status:'success'};}
 else if (url.pathname === '/cloudence/files/folders/folder-1' && method === 'PATCH') {folders[0].name=body.name;data={status:'success'};}
 else throw new Error('Unexpected mock API request '+method+' '+url.pathname);
 return new Response(JSON.stringify(data), {status:200, headers:{'Content-Type':'application/json'}});
};
`);

async function main() {
  const probe = net.createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const server = spawn(process.execPath, ['--require', mockPath, path.join(webRoot, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], {cwd:webRoot,stdio:['ignore','pipe','pipe']});
  let browser;
  let page;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Next server timed out')), 30000);
      const read = chunk => {if(String(chunk).includes('Ready in')) {clearTimeout(timer);resolve();}};
      server.stdout.on('data',read); server.stderr.on('data',read);
      server.once('exit',code=>{clearTimeout(timer);reject(new Error('Next exited '+code));});
    });
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe'].find(file=>fs.existsSync(file)) || puppeteer.executablePath();
    browser = await puppeteer.launch({executablePath,headless:true});
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);
    await page.setRequestInterception(true);
    page.on('request', request => {
      if(request.url().startsWith('http://127.0.0.1:'+port) || request.url().startsWith('data:')) request.continue();
      else request.abort();
    });
    const base = 'http://127.0.0.1:'+port;
    await page.setCookie({name:'__session',value:'mock-session',url:base});
    await page.goto(base+'/documents?sort=name-asc',{waitUntil:'domcontentloaded'});
    const clickText = async text => {
      await page.waitForFunction(text=>Array.from(document.querySelectorAll('button,a')).some(e=>e.textContent.trim()===text),{},text);
      await page.evaluate(text=>Array.from(document.querySelectorAll('button,a')).find(e=>e.textContent.trim()===text).click(),text);
    };
    await clickText('New folder');
    await page.waitForSelector('input[placeholder="e.g. Invoices"]');
    if (process.env.FOLDER_SCREENSHOT) await page.screenshot({ path: process.env.FOLDER_SCREENSHOT });
    await page.type('input[placeholder="e.g. Invoices"]','Invoices');
    await clickText('Create folder');
    await page.waitForSelector('a[aria-label="Open folder Invoices"]');
    await clickText('New folder');
    await page.waitForSelector('input[placeholder="e.g. Invoices"]');
    await page.type('input[placeholder="e.g. Invoices"]','Archive');
    await clickText('Create folder');
    await page.waitForSelector('a[aria-label="Open folder Archive"]');
    await page.type('input[aria-label="Search folders"]','Invoice');
    await page.waitForFunction(()=>!document.querySelector('a[href*="folder=folder-2"]'));
    await page.click('input[aria-label="Search folders"]',{clickCount:3});
    await page.keyboard.press('Backspace');
    await page.select('select[aria-label="Sort folders"]','name-desc');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('a[href*="folder="]'))[0]?.getAttribute('aria-label')==='Open folder Invoices');
    await page.click('button[aria-label="Actions for report.pdf"]');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('[role="menuitem"]')).some(e=>e.textContent.includes('Move to folder')));
    await page.evaluate(()=>Array.from(document.querySelectorAll('[role="menuitem"]')).find(e=>e.textContent.includes('Move to folder')).click());
    await page.waitForSelector('[role="dialog"] select');
    await page.select('[role="dialog"] select','folder-1');
    await clickText('move');
    await page.waitForFunction(()=>!document.querySelector('input[aria-label="Select report.pdf"]'));
    await page.waitForFunction(()=>getComputedStyle(document.body).pointerEvents!=='none' && document.querySelectorAll('[role="dialog"],[role="menu"]').length===0);
    assert.ok(await page.$('input[aria-label="Select notes.pdf"]'));
    await page.click('a[aria-label="Open folder Invoices"]');
    await page.waitForSelector('input[aria-label="Select report.pdf"]');
    await page.click('button[aria-label="Actions for report.pdf"]');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('[role="menuitem"]')).some(e=>e.textContent.includes('Move to folder')));
    await page.evaluate(()=>Array.from(document.querySelectorAll('[role="menuitem"]')).find(e=>e.textContent.includes('Move to folder')).click());
    await page.waitForSelector('[role="dialog"] select');
    assert.equal(await page.$eval('[role="dialog"] select', element=>element.value), 'folder-1');
    await clickText('Cancel');
    await page.waitForFunction(()=>getComputedStyle(document.body).pointerEvents!=='none' && document.querySelectorAll('[role="dialog"],[role="menu"]').length===0);
    await page.click('nav[aria-label="Folder breadcrumb"] a');
    await page.waitForFunction(()=>!document.querySelector('input[aria-label="Select report.pdf"]') && document.querySelector('input[aria-label="Select notes.pdf"]'));
    await page.click('input[aria-label="Select notes.pdf"]');
    await page.select('select[aria-label="Bulk move destination"]','folder-1');
    await clickText('Move selected');
    await page.waitForFunction(()=>!document.querySelector('input[aria-label="Select notes.pdf"]'));
    await page.click('a[aria-label="Open folder Invoices"]');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('p')).filter(p=>p.textContent==='Folder: Invoices').length===2);
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('folder')==='folder-1' && document.body.innerText.includes('report.pdf'));
    assert.equal(await page.evaluate(()=>new URL(location.href).searchParams.get('sort')), 'name-asc');
    await page.click('button[aria-label="Rename Invoices"]');
    try { await page.waitForSelector('input[placeholder="e.g. Invoices"]', {timeout:5000}); }
    catch (error) {
      console.log(await page.evaluate(()=>({text:document.body.innerText, pointerEvents:getComputedStyle(document.body).pointerEvents,menus:document.querySelectorAll('[role="menu"]').length,dialogs:document.querySelectorAll('[role="dialog"]').length,rename:document.querySelector('button[aria-label="Rename Invoices"]')?.outerHTML})));
      await page.screenshot({path:path.join(temp,'failure.png'),fullPage:true});
      throw error;
    }
    await page.$eval('input[placeholder="e.g. Invoices"]',e=>{e.value='';e.dispatchEvent(new Event('input',{bubbles:true}));});
    await page.click('input[placeholder="e.g. Invoices"]',{clickCount:3});
    await page.type('input[placeholder="e.g. Invoices"]','Work');
    await clickText('Save changes');
    await page.waitForSelector('button[aria-label="Delete Work"]');
    await page.click('button[aria-label="Delete Work"]');
    await clickText('Delete folder');
    await page.waitForFunction(()=>location.pathname==='/documents' && !new URL(location.href).searchParams.has('folder') && document.body.innerText.includes('report.pdf'));
    assert.equal(await page.$('button[aria-label="Delete Work"]'),null);
    await page.waitForFunction(()=>getComputedStyle(document.body).pointerEvents!=='none');
    await clickText('Clean up folders');
    await page.waitForFunction(()=>document.body.innerText.includes('Folder cleanup complete'));
    console.log('Browser flow passed: folder search/sort, single and bulk moves, Unfiled, focus restoration, rename, delete, and cleanup.');
  } catch (error) {
    if (page) console.log(await page.evaluate(()=>({url:location.href, text:document.body.innerText, inputs:Array.from(document.querySelectorAll('input[type="checkbox"]')).map(input=>input.getAttribute('aria-label')),pointerEvents:getComputedStyle(document.body).pointerEvents})));
    throw error;
  } finally {
    if(browser) await browser.close();
    if(server.exitCode===null) {const exited=new Promise(resolve=>server.once('exit',resolve));server.kill();await exited;}
    fs.unlinkSync(mockPath);
    if (fs.readdirSync(temp).length === 0) fs.rmdirSync(temp);
  }
}
test('folder organization works in the production browser without leaving the page locked', { timeout: 90000 }, main);
