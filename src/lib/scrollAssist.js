export const BAR_WIDTH = 12;
const MIN_THUMB = 24;

const STYLE_ID = 'scroll-assist-style';
const STYLE = `
.scroll-assist { scrollbar-width: none; }
.scroll-assist::-webkit-scrollbar { display: none; }
.scroll-assist-bar { position: absolute; width: ${BAR_WIDTH}px; z-index: 1; touch-action: none; }
.scroll-assist-bar[hidden] { display: none; }
.scroll-assist-track { position: absolute; inset: 0; background: var(--scroll-track-color); border-radius: 10px; }
.scroll-assist-thumb { position: absolute; left: 0; right: 0; box-sizing: border-box; background: var(--scroll-thumb-color); border: var(--scroll-thumb-border); border-radius: 10px; }
.scroll-assist-bar:hover .scroll-assist-thumb, .scroll-assist-bar.dragging .scroll-assist-thumb { background: var(--scroll-thumb-hover-color); }
`;

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = STYLE;
  document.head.appendChild(style);
}

export function scrollAssist(node) {
  ensureStyle();
  node.classList.add('scroll-assist');
  const bar = document.createElement('div');
  bar.className = 'scroll-assist-bar';
  bar.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'scroll-assist-track';
  const thumb = document.createElement('div');
  thumb.className = 'scroll-assist-thumb';
  track.append(thumb);
  bar.append(track);
  const parent = node.parentElement;
  let madeRelative = false;
  if (parent && getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
    madeRelative = true;
  }
  parent?.append(bar);
  let thumbTop = 0;
  let thumbHeight = 0;
  function update() {
    const view = node.clientHeight;
    const content = node.scrollHeight;
    const scrollable = content > view + 1;
    bar.hidden = !scrollable;
    if (!scrollable) return;
    bar.style.top = `${node.offsetTop + node.clientTop}px`;
    bar.style.left = `${node.offsetLeft + node.clientLeft}px`;
    bar.style.height = `${view}px`;
    thumbHeight = Math.min(view, Math.max(MIN_THUMB, (view * view) / content));
    const max = content - view;
    thumbTop = (Math.min(max, Math.max(0, node.scrollTop)) / max) * (view - thumbHeight);
    thumb.style.top = `${thumbTop}px`;
    thumb.style.height = `${thumbHeight}px`;
  }
  let drag = null;
  const barY = (e) => e.clientY - bar.getBoundingClientRect().top;
  function scrollToThumb(y) {
    const view = node.clientHeight;
    const range = view - thumbHeight;
    if (!drag || range <= 0) return;
    const top = Math.min(range, Math.max(0, y - drag.offset));
    node.scrollTop = (top / range) * (node.scrollHeight - view);
  }
  const onBarDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const y = barY(e);
    const onThumb = y >= thumbTop && y < thumbTop + thumbHeight;
    drag = { offset: onThumb ? y - thumbTop : thumbHeight / 2 };
    bar.classList.add('dragging');
    bar.setPointerCapture(e.pointerId);
    scrollToThumb(y);
  };
  const onBarMove = (e) => {
    if (drag) scrollToThumb(barY(e));
  };
  const endDrag = () => {
    drag = null;
    bar.classList.remove('dragging');
  };
  const onBarWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? node.clientHeight : 1;
    node.scrollTop += e.deltaY * scale;
  };
  const onBarMouseDown = (e) => e.preventDefault();
  bar.addEventListener('pointerdown', onBarDown);
  bar.addEventListener('pointermove', onBarMove);
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('lostpointercapture', endDrag);
  bar.addEventListener('wheel', onBarWheel, { passive: false });
  bar.addEventListener('mousedown', onBarMouseDown);
  node.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(node);
  const mutationObserver = new MutationObserver(() => requestAnimationFrame(update));
  mutationObserver.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  update();
  return {
    destroy() {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', update);
      node.removeEventListener('scroll', update);
      node.classList.remove('scroll-assist');
      bar.remove();
      if (madeRelative && parent) parent.style.position = '';
    },
  };
}
