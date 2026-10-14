const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const ts = require('typescript');

// Load TypeScript with request/framework adapters, without running a Next server.
function load(relative, mocks = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const module = { exports: {} };
  const localRequire = createRequire(filename);
  vm.runInThisContext(`(function(require,module,exports){${outputText}\n})`, { filename })(
    (name) => Object.hasOwn(mocks, name) ? mocks[name] : localRequire(name), module, module.exports,
  );
  return module.exports;
}

const input = load('lib/file-input.ts');
const files = load('lib/cloudence-file.ts');
const queue = load('lib/upload-queue.ts');
const validation = load('lib/upload-validation.ts', { '@/constants': { BLOCKED_EXTENSIONS: new Set(['exe', 'js']), MAX_FILE_SIZE: 50 * 1024 * 1024 } });
const { UploadError } = load('lib/client-api.ts', { '@/lib/cloudence-file': files });
const example = { isOwner: true, id: 'file-1', name: 'report.pdf', extension: 'pdf', users: ['alice@example.com', 'bob@example.com'] };

function actionHarness(overrides = {}) {
  let slots = [];
  let cursor = 0;
  const updates = [];
  const toasts = [];
  const element = (type, props, key) => ({ type, props, key });
  const ui = (names) => Object.fromEntries(names.map((name) => [name, name]));
  const adapters = {
    'react': { useState: (initial) => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], (value) => { slots[index] = value; }];
    } },
    'react/jsx-runtime': { jsx: element, jsxs: element },
    'next/image': 'Image',
    'next/navigation': { usePathname: () => '/dashboard' },
    '@/constants': { actionsDropdownItems: ['share', 'rename', 'delete', 'details', 'download'].map((value) => ({ value, label: value })) },
    '@/components/ui/dialog': ui(['Dialog', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogTitle']),
    '@/components/ui/dropdown-menu': ui(['DropdownMenu', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuLabel', 'DropdownMenuSeparator', 'DropdownMenuTrigger']),
    '@/components/ui/input': ui(['Input']),
    '@/components/ui/button': ui(['Button']),
    '@/components/ActionsModalContent': ui(['FileDetails', 'ShareInput']),
    '@/hooks/use-toast': { useToast: () => ({ toast: (value) => toasts.push(value) }) },
    '@/lib/file-input': input,
    '@/lib/actions/file.actions': { updateFileUsers: async (value) => { updates.push(value); return files.normalizeFile(example); } },
  };
  adapters["@/hooks/use-file-actions"] = load("hooks/use-file-actions.ts", adapters);
  const { default: Dropdown } = load("components/ActionDropdown.tsx", adapters);
  const file = files.normalizeFile({ ...example, ...overrides });
  const render = () => { cursor = 0; return Dropdown({ file }); };
  function find(node, predicate) {
    if (!node || typeof node !== 'object') return undefined;
    if (Array.isArray(node)) return node.map((child) => find(child, predicate)).find(Boolean);
    if (predicate(node)) return node;
    return find(node.props?.children, predicate);
  }
  const shareItem = find(render(), (node) => node.type === 'DropdownMenuItem' && node.key === 'share');
  if (shareItem) shareItem.props.onClick();
  return { render, find, updates, toasts };
}

test('Share adds normalized recipients while keeping existing access', async () => {
  const h = actionHarness();
  h.find(h.render(), (node) => node.type === 'ShareInput').props.onInputChange([' Carol@Example.com ', 'ALICE@example.com', '']);
  await h.find(h.render(), (node) => node.props?.className === 'modal-submit-button').props.onClick();
  assert.deepEqual(h.updates[0].addEmails, ['carol@example.com', 'alice@example.com']);
  assert.equal(h.updates[0].emails, undefined);
  assert.equal(h.updates[0].shareExpiresAt, undefined);
});

test('removing one recipient preserves everyone else even with an empty input', async () => {
  const h = actionHarness();
  await h.find(h.render(), (node) => node.type === 'ShareInput').props.onRemove('alice@example.com');
  assert.deepEqual(h.updates[0].removeEmails, ['alice@example.com']);
  assert.equal(h.updates[0].emails, undefined);
  assert.equal(h.toasts[0].title, 'Share settings updated');
});

test('empty Share input disables submission', () => {
  const h = actionHarness();
  assert.equal(h.find(h.render(), (node) => node.props?.className === 'modal-submit-button').props.disabled, true);
});

test('non-owners see only Details and Download', () => {
  const h = actionHarness({ isOwner: false });
  for (const key of ['share', 'rename', 'delete']) {
    assert.equal(h.find(h.render(), (node) => node.type === 'DropdownMenuItem' && node.key === key), undefined);
  }
  for (const key of ['details', 'download']) assert.ok(h.find(h.render(), (node) => node.key === key));
});

test('invalid emails are explained inline and prevent the Share action', async () => {
  const h = actionHarness();
  h.find(h.render(), (node) => node.type === 'ShareInput').props.onInputChange(['bad-address']);
  assert.match(h.find(h.render(), (node) => node.type === 'ShareInput').props.emailError, /bad-address/);
  const button = h.find(h.render(), (node) => node.props?.className === 'modal-submit-button');
  assert.equal(button.props.disabled, true);
  await button.props.onClick();
  assert.deepEqual(h.updates, []);
});

test('expiration can be saved without new recipients, cleared, and rejects past dates', async () => {
  const h = actionHarness();
  const future = input.localDateTime(new Date(Date.now() + 86_400_000).toISOString());
  h.find(h.render(), (node) => node.type === 'ShareInput').props.onExpiryChange(future);
  const button = h.find(h.render(), (node) => node.props?.className === 'modal-submit-button');
  assert.equal(button.props.disabled, false);
  await button.props.onClick();
  assert.equal(h.updates[0].shareExpiresAt, new Date(future).toISOString());
  assert.equal(h.updates[0].emails, undefined);
  assert.equal(h.updates[0].addEmails, undefined);
  const old = actionHarness({ shareExpiresAt: new Date(future).toISOString() });
  old.find(old.render(), (node) => node.type === 'ShareInput').props.onExpiryChange('');
  await old.find(old.render(), (node) => node.props?.className === 'modal-submit-button').props.onClick();
  assert.equal(old.updates[0].shareExpiresAt, '');
  const past = actionHarness();
  past.find(past.render(), (node) => node.type === 'ShareInput').props.onExpiryChange('2000-01-01T00:00');
  assert.match(past.find(past.render(), (node) => node.type === 'ShareInput').props.expiryError, /future/);
  assert.equal(past.find(past.render(), (node) => node.props?.className === 'modal-submit-button').props.disabled, true);
});

test('rename action preserves a single extension and rejects blank names', async (t) => {
  const sent = [];
  const revalidated = [];
  t.mock.method(global, 'fetch', async (_url, init) => {
    sent.push(JSON.parse(init.body));
    return { ok: true, json: async () => example };
  });
  const actions = load('lib/actions/file.actions.ts', {
    'next/cache': { revalidatePath: (value) => revalidated.push(value) },
    '@/lib/session-headers': { sessionHeaders: async () => ({ Cookie: '__session=test', origin: 'https://cloudence.chefu.co.za' }) },
    '@/lib/cloudence-file': files,
    '@/lib/file-input': input,
  });
  for (const [name, extension, expected] of [
    ['report.pdf', 'pdf', 'report.pdf'], ['report', 'pdf', 'report.pdf'],
    ['  report.PDF  ', 'pdf', 'report.PDF'], ['annual.report.pdf', 'pdf', 'annual.report.pdf'],
    ['README', '', 'README'],
  ]) {
    await actions.renameFile({ fileId: 'file-1', name, extension, path: '/dashboard' });
    assert.equal(sent.at(-1).name, expected);
  }
  const rejected = await actions.renameFile({ fileId: 'file-1', name: ' ', extension: 'pdf', path: '/dashboard' });
  assert.equal(rejected.error, 'A file name is required.');
  assert.equal(sent.length, 5);
  assert.equal(revalidated.length, 5);
});

test('sharing sends recipient deltas and expiry-only requests never replace the recipient list', async (t) => {
  const sent = [];
  t.mock.method(global, 'fetch', async (_url, init) => {
    sent.push(JSON.parse(init.body));
    return { ok: true, json: async () => example };
  });
  const actions = load('lib/actions/file.actions.ts', {
    'next/cache': { revalidatePath() {} },
    '@/lib/session-headers': { sessionHeaders: async () => ({ Cookie: '__session=test', origin: 'https://cloudence.chefu.co.za' }) },
    '@/lib/cloudence-file': files,
    '@/lib/file-input': input,
  });
  await actions.updateFileUsers({ fileId: 'file-1', addEmails: [' New@Example.com '], path: '/dashboard' });
  await actions.updateFileUsers({ fileId: 'file-1', removeEmails: ['ALICE@example.com'], path: '/dashboard' });
  await actions.updateFileUsers({ fileId: 'file-1', shareExpiresAt: '', path: '/dashboard' });
  assert.deepEqual(sent, [{ addUsers: ['new@example.com'] }, { removeUsers: ['alice@example.com'] }, { shareExpiresAt: '' }]);
});

function installXHR(t, send) {
  const original = global.XMLHttpRequest;
  const requests = [];
  global.XMLHttpRequest = class {
    constructor() { this.upload = {}; this.headers = {}; requests.push(this); }
    open(method, url) { this.method = method; this.url = url; }
    setRequestHeader(name, value) { this.headers[name] = value; }
    send(body) {
      this.body = body;
      Promise.resolve().then(() => send(this)).then(async (response) => {
        if (this.aborted) return;
        this.status = response.status;
        this.responseText = await response.text();
        this.onload();
      }).catch(() => { if (!this.aborted) this.onerror(); });
    }
    abort() { this.aborted = true; this.onabort?.(); }
  };
  t.after(() => {
    if (original === undefined) delete global.XMLHttpRequest;
    else global.XMLHttpRequest = original;
  });
  return requests;
}

test('uploads larger than the action limit go straight to the API as credentialed multipart', async (t) => {
  let receivedBytes = 0;
  let contentType;
  const server = http.createServer(async (request, response) => {
    contentType = request.headers['content-type'];
    for await (const chunk of request) receivedBytes += chunk.length;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ ...example, sha256: 'private', ownerId: 'private' }));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const nativeFetch = global.fetch;
  const requests = installXHR(t, (xhr) => nativeFetch(`http://127.0.0.1:${server.address().port}/cloudence/files`, {
    method: xhr.method, headers: xhr.headers, body: xhr.body,
  }));
  const client = load('lib/client-api.ts', { '@/lib/cloudence-file': files });
  const file = new File([new Uint8Array(6 * 1024 * 1024)], 'large.mp4', { type: 'video/mp4' });
  const result = await client.uploadFile(file);
  const xhr = requests[0];
  assert.match(xhr.url, /\/cloudence\/files$/);
  assert.equal(xhr.withCredentials, true);
  assert.equal(xhr.method, 'POST');
  assert.equal(xhr.body.get('file').size, file.size);
  assert.equal(xhr.body.get('name'), file.name);
  assert.ok(receivedBytes > file.size);
  assert.match(contentType, /^multipart\/form-data; boundary=/);
  assert.equal(new Headers(xhr.headers).has('content-type'), false);
  assert.equal(xhr.headers['x-chefu-app'], 'cloudence');
  assert.equal(result.$id, 'file-1');
  assert.equal('sha256' in result, false);
});

test('upload and sign-out failures expose API and network errors', async (t) => {
  const client = load('lib/client-api.ts', { '@/lib/cloudence-file': files });
  let networkError = false;
  installXHR(t, async () => {
    if (networkError) throw new Error('Network unavailable');
    return new Response(JSON.stringify({ message: 'API unavailable' }), { status: 503 });
  });
  t.mock.method(global, 'fetch', async () => ({ ok: false, json: async () => ({ message: 'API unavailable' }) }));
  await assert.rejects(client.uploadFile(new File(['x'], 'test.txt')), /API unavailable/);
  await assert.rejects(client.signOutUser(), /API unavailable/);
  networkError = true;
  await assert.rejects(client.uploadFile(new File(['x'], 'test.txt')), /connection/);
  global.fetch = async () => { throw new Error('Network unavailable'); };
  await assert.rejects(client.signOutUser(), /Network unavailable/);
});

test('upload progress reaches the caller and cancellation aborts the request', async (t) => {
  const requests = installXHR(t, () => new Promise(() => {}));
  const client = load('lib/client-api.ts', { '@/lib/cloudence-file': files });
  const progress = [];
  const controller = new AbortController();
  const upload = client.uploadFile(new File(['x'], 'test.txt'), { signal: controller.signal, onProgress: (value) => progress.push(value) });
  requests[0].upload.onprogress({ lengthComputable: true, loaded: 50, total: 100 });
  assert.deepEqual(progress, [50]);
  controller.abort();
  await assert.rejects(upload, (error) => error.name === 'AbortError');
  assert.equal(requests[0].aborted, true);
  const early = new AbortController();
  early.abort();
  await assert.rejects(client.uploadFile(new File(['x'], 'test.txt'), { signal: early.signal }), (error) => error.name === 'AbortError');
  assert.equal(requests.length, 1);
});

function uploaderHarness(t) {
  const slots = [];
  let cursor = 0;
  let drop;
  let cleanup;
  const uploads = [];
  const revoked = [];
  let urls = 0;
  let refreshes = 0;
  const toasts = [];
  let dropOptions;
  t.mock.method(URL, 'createObjectURL', () => `blob:preview-${urls++}`);
  t.mock.method(URL, 'revokeObjectURL', (url) => revoked.push(url));
  const slot = (initial) => {
    const index = cursor++;
    if (!(index in slots)) slots[index] = initial;
    return index;
  };
  const adapters = {
    'react': {
      useState: (initial) => {
        const index = slot(initial);
        return [slots[index], (value) => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
      },
      useRef: (initial) => slots[slot({ current: initial })],
      useCallback: (callback) => callback,
      useEffect: (callback) => { if (!cleanup) cleanup = callback(); },
    },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'react-dropzone': { useDropzone: (options) => { drop = options.onDrop; dropOptions = options; return { getRootProps: () => ({}), getInputProps: () => ({}) }; } },
    'next/image': 'Image',
    'next/navigation': { useRouter: () => ({ refresh: () => refreshes++ }) },
    '@/components/ui/button': { Button: 'Button' },
    '@/components/Thumbnail': 'Thumbnail',
    '@/constants': { MAX_FILE_SIZE: 50 * 1024 * 1024 },
    '@/lib/utils': { cn: (...values) => values.join(' '), getFileType: () => ({ type: 'document', extension: 'txt' }) },
    '@/hooks/use-toast': { useToast: () => ({ toast: (value) => toasts.push(value) }) },
    '@/lib/upload-queue': queue,
    '@/lib/upload-validation': validation,
    '@/lib/client-api': { UploadError, uploadFile: (file, options) => new Promise((resolve, reject) => {
      uploads.push({ file, options, resolve, reject });
      options.signal.addEventListener('abort', () => reject(new DOMException('Canceled', 'AbortError')), { once: true });
    }) },
  };
  adapters["@/hooks/use-file-uploader"] = load("hooks/use-file-uploader.ts", adapters);
  const { default: Uploader } = load("components/FileUploader.tsx", adapters);
  const render = () => { cursor = 0; return Uploader({}); };
  const nodes = (node) => {
    if (!node || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap(nodes);
    return [node, ...nodes(node.props?.children)];
  };
  render();
  return { render, nodes, uploads, revoked, toasts, drop: (files) => drop(files), getDropOptions: () => dropOptions, refreshes: () => refreshes, cleanup: () => cleanup() };
}

test('canceling a preview aborts only that file and releases every preview URL', async (t) => {
  const h = uploaderHarness(t);
  const { render, nodes, uploads, revoked, drop, cleanup } = h;
  const batch = drop([new File(['one'], 'same.txt'), new File(['two'], 'same.txt')]);
  assert.equal(uploads.length, 2);
  uploads[0].options.onProgress(50);
  assert.equal(nodes(render()).filter((node) => node.type === 'progress')[0].props.value, 50);
  const cancel = nodes(render()).filter((node) => node.type === 'button')[0];
  cancel.props.onClick({ stopPropagation() {} });
  assert.equal(uploads[0].options.signal.aborted, true);
  assert.equal(uploads[1].options.signal.aborted, false);
  uploads[1].resolve(example);
  await batch;
  assert.deepEqual(revoked.sort(), ['blob:preview-0', 'blob:preview-1']);
  assert.equal(h.refreshes(), 1);
  assert.equal(nodes(render()).filter((node) => node.type === 'progress').length, 0);
  cleanup();
});

test('logout navigates only after success and shows a red error toast on failure', async () => {
  const toasts = [];
  const navigations = [];
  let fail = true;
  let pending = false;
  const adapters = {
    'react': { useState: () => [pending, (value) => { pending = value; }] },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'next/image': 'Image',
    '@/components/ui/button': { Button: 'Button' },
    '@/hooks/use-toast': { useToast: () => ({ toast: (value) => toasts.push(value) }) },
    '@/lib/client-api': { signOutUser: async () => { if (fail) throw new Error('Sign-out unavailable'); } },
  };
  adapters["@/hooks/use-logout"] = load("hooks/use-logout.ts", adapters);
  const { LogoutButton } = load("components/LogoutButton.tsx", adapters);
  const previous = global.window;
  global.window = { location: { assign: (url) => navigations.push(url) } };
  try {
    await LogoutButton({}).props.onClick();
    assert.deepEqual(navigations, []);
    assert.equal(toasts[0].className, 'error-toast');
    assert.equal(toasts[0].description, 'Sign-out unavailable');
    assert.equal(pending, false);
    fail = false;
    await LogoutButton({ mobile: true }).props.onClick();
    assert.deepEqual(navigations, ['/sign-in']);
  } finally {
    if (previous === undefined) delete global.window;
    else global.window = previous;
  }
});

test('a thousand-file selection creates no previews or network requests', async (t) => {
  const h = uploaderHarness(t);
  await h.drop(Array(1000).fill(new File(['x'], 'test.txt')));
  assert.equal(h.uploads.length, 0);
  assert.equal(h.revoked.length, 0);
  assert.equal(h.toasts.length, 1);
  assert.match(h.toasts[0].description, /15/);
  assert.equal(h.getDropOptions().maxFiles, 15);
  h.cleanup();
});

test('batch uploads run at most three at a time and produce one summary', async (t) => {
  const h = uploaderHarness(t);
  const batch = h.drop(Array.from({ length: 8 }, (_, index) => new File(['x'], `${index}.txt`)));
  assert.equal(h.uploads.length, 3);
  h.uploads.slice(0, 3).forEach((upload) => upload.resolve(example));
  await new Promise(setImmediate);
  assert.equal(h.uploads.length, 6);
  h.uploads.slice(3, 6).forEach((upload) => upload.resolve(example));
  await new Promise(setImmediate);
  assert.equal(h.uploads.length, 8);
  h.uploads.slice(6).forEach((upload) => upload.resolve(example));
  await batch;
  assert.equal(h.toasts.length, 1);
  assert.match(h.toasts[0].description, /8 uploaded/);
  assert.equal(h.revoked.length, 8);
  h.cleanup();
});

test('a queued cancellation makes no request and a rate limit stops further uploads', async (t) => {
  const h = uploaderHarness(t);
  const batch = h.drop(Array.from({ length: 8 }, (_, index) => new File(['x'], `${index}.txt`)));
  const cancel = h.nodes(h.render()).filter((node) => node.type === 'button')[3];
  cancel.props.onClick({ stopPropagation() {} });
  h.uploads[0].reject(new UploadError('Please wait before uploading more files.', 429));
  h.uploads[1].resolve(example);
  h.uploads[2].resolve(example);
  await batch;
  assert.equal(h.uploads.length, 3);
  assert.equal(h.toasts.length, 1);
  assert.match(h.toasts[0].description, /2 uploaded, 1 failed, 1 canceled, 4 skipped/);
  assert.equal(h.toasts[0].className, 'error-toast');
  assert.equal(h.revoked.length, 8);
  h.cleanup();
});

test('extracted upload validation preserves per-type size limits and blocked extensions', () => {
  for (const [name, megabytes] of [['image.png', 20], ['notes.txt', 10], ['document.pdf', 25], ['vector.svg', 5], ['video.mp4', 50]]) {
    assert.equal(validation.validateUploadFile({ name, size: megabytes * 1024 * 1024 }), null);
    assert.match(validation.validateUploadFile({ name, size: megabytes * 1024 * 1024 + 1 }), /exceeds/);
  }
  assert.match(validation.validateUploadFile({ name: 'blocked.exe', size: 1 }), /blocked/);
});

test('file sorting stays local, handles numbered names, and preserves the input array', () => {
  const { sortFiles } = load('lib/file-sort.ts');
  const source = [{ name: 'file10.pdf', size: 10 }, { name: 'file2.pdf', size: 2 }];
  assert.deepEqual(sortFiles(source, 'name-asc').map((file) => file.name), ['file2.pdf', 'file10.pdf']);
  assert.deepEqual(sortFiles(source, 'size-desc').map((file) => file.size), [10, 2]);
  assert.equal(source[0].name, 'file10.pdf');
});

test('search initializes from the URL without clearing an existing filter', async () => {
  const queries = [];
  const navigations = [];
  const { useFileSearch } = load('hooks/use-file-search.ts', {
    'react': { useState: (initial) => [initial, () => {}], useEffect: (callback) => callback() },
    'next/navigation': { useSearchParams: () => new URLSearchParams('query=report'), usePathname: () => '/documents', useRouter: () => ({ push: (url) => navigations.push(url) }) },
    'use-debounce': { useDebounce: (query) => [query] },
    '@/lib/actions/file.actions': { getFiles: async (args) => { queries.push(args); return { documents: [] }; } },
  });
  assert.equal(useFileSearch().query, 'report');
  assert.deepEqual(navigations, []);
  assert.equal(queries[0].searchText, 'report');
});
