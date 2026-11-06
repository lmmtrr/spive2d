function checkboxAt(target, root) {
  if (!(target instanceof Element) || !root.contains(target)) return null;
  if (target instanceof HTMLInputElement && target.type === 'checkbox') return target;
  const label = target.closest('label');
  if (!label || !root.contains(label)) return null;
  const input = label.control ?? label.querySelector('input[type="checkbox"]');
  return input instanceof HTMLInputElement && input.type === 'checkbox' ? input : null;
}

function apply(input, value) {
  if (input.disabled || input.checked === value) return;
  input.checked = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

export function checkboxDrag(root) {
  let value = null;
  let suppressClick = false;
  function onMouseDown(e) {
    suppressClick = false;
    if (e.button !== 0) return;
    const input = checkboxAt(e.target, root);
    if (!input || input.disabled) return;
    e.preventDefault();
    value = !input.checked;
    suppressClick = true;
    apply(input, value);
  }
  function onMouseMove(e) {
    if (value === null) return;
    if (!(e.buttons & 1)) {
      value = null;
      return;
    }
    const input = checkboxAt(document.elementFromPoint(e.clientX, e.clientY), root);
    if (input) apply(input, value);
  }
  function onMouseUp() {
    value = null;
  }
  function onClick(e) {
    if (!suppressClick) return;
    suppressClick = false;
    if (checkboxAt(e.target, root)) e.preventDefault();
  }
  root.addEventListener('mousedown', onMouseDown);
  root.addEventListener('click', onClick, true);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  return {
    destroy() {
      root.removeEventListener('mousedown', onMouseDown);
      root.removeEventListener('click', onClick, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    },
  };
}
