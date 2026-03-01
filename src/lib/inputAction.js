import { getRenderer } from '$lib/rendererStore.js';

export function createTransformAction() {
  let isMove = false;
  let startX = 0;
  let startY = 0;
  let mouseDown = false;
  const SIDEBAR_WIDTH = 250;
  const CONTROLLER_HEIGHT = 80;

  return function transformAction(node, { appState, sidebar, animController, dialogOpen }) {

    function handleMouseDown(e) {
      if (dialogOpen || !appState.initialized || appState.processing || e.button === 2) return;
      startX = e.clientX;
      startY = e.clientY;
      mouseDown = true;
      isMove = e.clientX < window.innerWidth - SIDEBAR_WIDTH &&
        e.clientX > SIDEBAR_WIDTH &&
        (window.innerHeight - e.clientY > CONTROLLER_HEIGHT);
    }

    function handleMouseMove(e) {
      sidebar?.setSidebarVisible?.(e.clientX <= SIDEBAR_WIDTH);
      animController?.showOnHover?.(e.clientY);
      document.body.style.cursor = 'default';
      if (e.clientX >= window.innerWidth - SIDEBAR_WIDTH) {
        document.body.style.cursor = `url("cursors/rotate_right.svg"), auto`;
      }
      if (!mouseDown) return;
      const { transform } = appState;
      const renderer = getRenderer();
      if (isMove) {
        appState.transform = {
          ...transform,
          moveX: transform.moveX + (e.clientX - startX),
          moveY: transform.moveY + (e.clientY - startY),
        };
        renderer?.applyTransform(
          appState.transform.scale,
          appState.transform.moveX,
          appState.transform.moveY,
          appState.transform.rotate
        );
      } else if (e.clientX >= window.innerWidth - SIDEBAR_WIDTH && (window.innerHeight - e.clientY > CONTROLLER_HEIGHT)) {
        const delta = ((e.clientY - startY) / window.innerHeight) * 2.0;
        appState.transform = { ...transform, rotate: transform.rotate + delta };
        renderer?.applyTransform(
          appState.transform.scale,
          appState.transform.moveX,
          appState.transform.moveY,
          appState.transform.rotate
        );
      }
      startX = e.clientX;
      startY = e.clientY;
    }

    function handleMouseUp() {
      mouseDown = false;
      isMove = false;
    }

    function handleWheel(e) {
      if (!appState.initialized) return;
      if (e.clientX < SIDEBAR_WIDTH || (window.innerHeight - e.clientY <= CONTROLLER_HEIGHT)) return;
      const { transform } = appState;
      const baseScaleStep = 0.1;
      const scaleFactor = 0.1;
      const scaleStep = baseScaleStep + Math.abs(transform.scale - 1) * scaleFactor;
      const newScale = Math.min(
        appState.SCALE_MAX,
        Math.max(appState.SCALE_MIN, transform.scale - Math.sign(e.deltaY) * scaleStep)
      );
      appState.transform = { ...transform, scale: newScale };
      getRenderer()?.applyTransform(newScale, transform.moveX, transform.moveY, transform.rotate);
    }

    function handleContextMenu(e) {
      e.preventDefault();
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseout', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('contextmenu', handleContextMenu);

    return {
      update(newParams) {
        appState = newParams.appState;
        sidebar = newParams.sidebar;
        animController = newParams.animController;
        dialogOpen = newParams.dialogOpen;
      },
      destroy() {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseout', handleMouseUp);
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  };
}
