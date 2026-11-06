import assert from 'node:assert/strict';
import { launchBrowserWithStartupRetry, stopBrowser } from './visual-browser-startup.mjs';

const site = new URL(process.env.MEMORA_LIVE_ORIGIN ?? 'https://memoraevents.de/');
assert.equal(site.protocol, 'https:', 'only HTTPS public sites may be tested');
assert.equal(site.pathname, '/');
assert.ok(!site.username && !site.password && !site.search && !site.hash);
const executable = process.env.BROWSER_EXECUTABLE;
assert.ok(executable, 'BROWSER_EXECUTABLE must name a local Chrome/Chromium');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let counter = 0;
  const pending = new Map();
  const nonReadRequests = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.method === 'Network.requestWillBeSent') {
      const request = message.params?.request;
      if (request && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
        nonReadRequests.push(request.method + ' ' + request.url);
      }
    }
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    clearTimeout(waiter.timer);
    if (message.error) waiter.reject(new Error(waiter.method + ': ' + message.error.message));
    else waiter.resolve(message.result ?? {});
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++counter;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error('CDP timeout: ' + method));
    }, 15000);
    pending.set(id, { timer, method, resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  return { socket, send, nonReadRequests };
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true,
  }, sessionId);
  if (result.exceptionDetails) throw new Error('Browser JavaScript error: ' + result.exceptionDetails.text);
  return result.result?.value;
}

async function waitFor(cdp, sessionId, expression, label) {
  for (let n = 0; n < 140; n += 1) {
    if (await evaluate(cdp, sessionId, expression)) return;
    await sleep(80);
  }
  throw new Error('Timed out waiting for ' + label);
}

async function navigate(cdp, sessionId, path) {
  await cdp.send('Page.navigate', { url: site.origin + path }, sessionId);
  const route = JSON.stringify(new URL(path, site).pathname);
  await waitFor(cdp, sessionId, 'document.readyState==="complete" && location.pathname===' + route, path);
}

function stageOneSafe(state, path, width) {
  assert.equal(state.robots, 'noindex,nofollow', path + ' must not be indexed');
  assert.ok(state.csp?.includes("form-action 'none'"), path + ' must forbid form posting');
  assert.ok(state.width <= state.client + 1, path + ' horizontally overflows at ' + width + 'px');
  assert.equal(state.enabledSubmit, false, path + ' has an enabled submit');
  assert.equal(state.forms, 0, path + ' stage-one preview must not expose any contact form');
}

const domState = '(() => ({robots:document.querySelector("meta[name=robots]")?.content,'
  + 'csp:document.querySelector("meta[http-equiv=Content-Security-Policy]")?.content,'
  + 'width:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,'
  + 'forms:document.querySelectorAll("form").length,'
  + 'enabledSubmit:[...document.querySelectorAll("button[type=submit]")].some(b=>!b.disabled)}))()';

async function run() {
  const root = await fetch(site.origin + '/', { redirect: 'manual' });
  assert.equal(root.status, 302, 'Stage-1 root redirect changed');
  assert.equal(root.headers.get('location'), '/demo/');
  let browser;
  let cdp;
  const checks = [];
  try {
    browser = await launchBrowserWithStartupRetry(executable);
    cdp = await connect(browser.websocketUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Network.enable', {}, sessionId);
    // Fail before any write-capable browser API can transmit customer information.
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: [
      '(() => {',
      'const originalFetch=window.fetch;',
      'window.fetch=(input,init={})=>{const method=String(init.method||input?.method||"GET").toUpperCase();',
      'if(!["GET","HEAD"].includes(method))throw new Error("Stage-1 smoke: fetch blocked");return originalFetch(input,init);};',
      'const originalOpen=XMLHttpRequest.prototype.open;',
      'XMLHttpRequest.prototype.open=function(method,...args){if(!["GET","HEAD"].includes(String(method).toUpperCase()))',
      'throw new Error("Stage-1 smoke: XHR blocked");return originalOpen.call(this,method,...args);};',
      'navigator.sendBeacon=()=>false;',
      'HTMLFormElement.prototype.submit=()=>{throw new Error("Stage-1 smoke: submit blocked");};',
      'HTMLFormElement.prototype.requestSubmit=()=>{throw new Error("Stage-1 smoke: requestSubmit blocked");};',
      '})();',
    ].join('\n') }, sessionId);

    for (const width of [1440, 1024, 834, 390]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width, height: width === 390 ? 844 : 1000, deviceScaleFactor: 1, mobile: false,
      }, sessionId);
      for (const path of ['/demo/', '/demo/konfigurator/', '/anfrage/']) {
        await navigate(cdp, sessionId, path);
        const state = await evaluate(cdp, sessionId, domState);
        stageOneSafe(state, path, width);
        checks.push(width + ' ' + path + ' sendefrei');
      }
      for (const offer of ['fotobox', 'fotospiegel', 'magazinbox']) {
        await navigate(cdp, sessionId, '/demo/');
        const clicked = await evaluate(cdp, sessionId, '(() => {'
          + 'const a=document.querySelector("#angebot-' + offer + ' .hom-product-actions a");'
          + 'if(!a)return false;a.click();return true;})()');
        assert.equal(clicked, true, 'homepage product CTA missing: ' + offer);
        await waitFor(cdp, sessionId,
          'location.pathname==="/demo/konfigurator/" && document.querySelector("input[name=wizardOffer]:checked")?.value==="' + offer + '"',
          offer + ' clicked homepage CTA and preselected wizard');
        stageOneSafe(await evaluate(cdp, sessionId, domState), '/demo/konfigurator/', width);
        checks.push(width + ' homepage ' + offer + ' CTA');
      }
      for (const offer of ['fotobox', 'fotospiegel', 'magazinbox']) {
        const path = '/produkte/' + offer + '/';
        await navigate(cdp, sessionId, path);
        const activated = await evaluate(cdp, sessionId, '(() => {'
          + 'const link=[...document.querySelectorAll("a[href*=konfigurator]")]'
          + '.find(a=>a.href.includes("produkt=' + offer + '"));'
          + 'if(!link)return false;link.click();return true;})()');
        assert.equal(activated, true, 'missing product hero CTA for ' + offer);
        await waitFor(cdp, sessionId,
          'location.pathname==="/demo/konfigurator/" && document.querySelector("[data-configurator-preview]")?.dataset.activeStep==="0"',
          offer + ' wizard navigation');
        assert.equal(await evaluate(cdp, sessionId,
          'document.querySelector("input[name=wizardOffer]:checked")?.value'), offer,
        offer + ' must be preselected');
        stageOneSafe(await evaluate(cdp, sessionId, domState), '/demo/konfigurator/', width);
        checks.push(width + ' ' + offer + ' clicked and preselected');
      }
      await navigate(cdp, sessionId, '/preise/');
      const linkCount = await evaluate(cdp, sessionId,
        '[...document.querySelectorAll("a[href*=konfigurator]")].filter(a=>a.href.includes("paket=")).length');
      assert.equal(linkCount, 12, 'all twelve confirmed package links must exist');
      const clicked = await evaluate(cdp, sessionId, '(() => {'
        + 'const a=[...document.querySelectorAll("a[href*=konfigurator]")]'
        + '.find(a=>a.href.includes("paket=fotobox-classic"));'
        + 'if(!a)return false;a.click();return true;})()');
      assert.equal(clicked, true, 'missing Classic price CTA');
      await waitFor(cdp, sessionId,
        'location.pathname==="/demo/konfigurator/" && document.querySelector("input[value=fotobox-classic]")?.checked===true',
        'Classic package preselection');
      const selection = await evaluate(cdp, sessionId,
        '({price:document.querySelector("[data-wizard-price]")?.textContent,'
        + 'step:document.querySelector("[data-configurator-preview]")?.dataset.activeStep})');
      assert.ok(selection.price?.includes('349'), 'Classic price disappeared');
      assert.equal(selection.step, '0');
      const result = await evaluate(cdp, sessionId, '(() => {'
        + 'const root=document.querySelector("[data-configurator-preview]");'
        + 'const next=root.querySelector("[data-wizard-next]"), back=root.querySelector("[data-wizard-back]");'
        + 'next.click();next.click();'
        + 'const invalid={step:root.dataset.activeStep,text:root.querySelector("[data-wizard-error]")?.textContent,'
        + 'focused:document.activeElement===root.querySelector("[data-wizard-error]")};'
        + 'root.querySelector("[name=wizardEvent]").value="Hochzeit";'
        + 'const date=new Date();date.setFullYear(date.getFullYear()+1);'
        + 'root.querySelector("[name=wizardDate]").value=[date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),'
        + 'String(date.getDate()).padStart(2,"0")].join("-");'
        + 'root.querySelector("[name=wizardLocation]").value="Lübeck";'
        + 'next.click();const packageStep=root.dataset.activeStep;'
        + 'next.click();const reviewStep=root.dataset.activeStep;'
        + 'const before=root.querySelector("[data-review-price]")?.textContent;'
        + 'back.click();const party=root.querySelector("input[value=fotobox-party]");'
        + 'party.checked=true;party.dispatchEvent(new Event("change",{bubbles:true}));'
        + 'next.click();const after=root.querySelector("[data-review-price]")?.textContent;'
        + 'return {invalid,packageStep,reviewStep,finalStep:root.dataset.activeStep,before,after,'
        + 'forms:document.querySelectorAll("form").length};})()');
      assert.equal(result.invalid.step, '1', 'invalid event details were accepted');
      assert.ok(result.invalid.text?.includes('Datum'), 'missing event validation message');
      assert.equal(result.invalid.focused, true, 'error message should receive keyboard focus');
      assert.equal(result.packageStep, '2');
      assert.equal(result.reviewStep, '3');
      assert.equal(result.finalStep, '3');
      assert.ok(result.before?.includes('349') && result.after?.includes('449'),
        'price must follow package changes on back/forward');
      assert.equal(result.forms, 0, 'wizard became submit-capable');
      checks.push(width + ' 12 package links, invalid event, 4 steps, back/edit, 349->449');
      const copyResult = await evaluate(cdp, sessionId, '(async()=>{'
        + 'Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.__memoraCopied=text;}}});'
        + 'document.querySelector("[data-wizard-copy]").click();'
        + 'await new Promise(resolve=>setTimeout(resolve,0));'
        + 'return {value:window.__memoraCopied,status:document.querySelector("[data-wizard-copy-status]")?.textContent,'
        + 'forms:document.querySelectorAll("form").length};})()');
      assert.ok(copyResult.value?.includes('Fotobox') && copyResult.value.includes('Hochzeit')
        && copyResult.value.includes('Lübeck') && copyResult.value.includes('449')
        && copyResult.value.includes('Keine Buchung'), 'preview selection cannot be copied at ' + width + 'px');
      assert.ok(copyResult.status?.includes('nicht versendet') && copyResult.forms === 0, 'copy is not send-free at ' + width + 'px');
      const copyFallback = await evaluate(cdp, sessionId, '(async()=>{'
        + 'Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("permission denied");}}});'
        + 'document.querySelector("[data-wizard-copy]").click();'
        + 'await new Promise(resolve=>setTimeout(resolve,0));'
        + 'const area=document.querySelector("[data-wizard-copy-text]");'
        + 'return {hidden:document.querySelector("[data-wizard-copy-fallback]")?.hidden,'
        + 'value:area?.value,focus:document.activeElement===area,'
        + 'selection:area?.selectionStart===0&&area?.selectionEnd===area?.value.length};})()');
      assert.ok(!copyFallback.hidden && copyFallback.value?.includes('449') && copyFallback.focus
        && copyFallback.selection, 'clipboard-denied fallback not usable at ' + width + 'px');
      stageOneSafe(await evaluate(cdp, sessionId, domState), '/demo/konfigurator/', width);
      checks.push(width + ' selection copy, denied-permission fallback, 0 network writes');

      for (const path of ['/impressum/', '/datenschutz/']) {
        await navigate(cdp, sessionId, path);
        assert.equal(await evaluate(cdp, sessionId,
          'document.querySelector("meta[name=robots]")?.content'), 'noindex,nofollow');
      }
      checks.push(width + ' legal drafts remain unindexed');
    }
    assert.deepEqual(cdp.nonReadRequests, [], 'browser attempted a network write');
    console.log(JSON.stringify({ status: 'PASS', origin: site.origin, checks,
      networkWrites: 0, customerSubmission: false, responsiveWidths: [1440,1024,834,390] }, null, 2));
    await cdp.send('Target.closeTarget', { targetId });
  } finally {
    cdp?.socket?.close();
    if (browser) await stopBrowser(browser);
  }
}

run().catch((error) => {
  console.error('smoke-live-stage-one FAIL: ' + (error.stack || error.message));
  process.exitCode = 1;
});
