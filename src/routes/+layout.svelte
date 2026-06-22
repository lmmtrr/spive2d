<script>
  import '../global.css';
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';

  let { children } = $props();

  const originalLog = console.log;

  function fmt(args) {
    return args.map(a => {
      if (a instanceof Error) return `${a.message}\n${a.stack}`;
      if (typeof a === 'object') {
        try { return JSON.stringify(a); } catch { return String(a); }
      }
      return a;
    }).join(' ');
  }

  function sendToRustLog(type, msg) {
    if (window.__TAURI_INTERNALS__) {
      invoke('log_frontend_error', { msg: `[${type}] ${msg}` })
        .catch(e => originalLog('invoke failed', e));
    }
  }

  onMount(async () => {
    let debugMode = false;
    try {
      debugMode = await invoke('is_debug');
    } catch {}

    const levels = debugMode
      ? { log: 'LOG', info: 'INFO', warn: 'WARN', error: 'ERROR', debug: 'DEBUG' }
      : { error: 'ERROR' };

    for (const [method, tag] of Object.entries(levels)) {
      const original = console[method].bind(console);
      console[method] = (...args) => {
        original(...args);
        try { sendToRustLog(tag, fmt(args)); } catch (e) { original('fwd fail', e); }
      };
    }

    window.onerror = (msg, url, line, col) => {
      try { sendToRustLog('CRASH', `${msg} (${url}:${line}:${col})`); } catch (e) {}
      return false;
    };

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      try {
        sendToRustLog('PROMISE_CRASH', reason instanceof Error ? `${reason.message}\n${reason.stack}` : String(reason));
      } catch (e) {}
    });
    // console.error(`running`);
  });
</script>

{@render children()}
