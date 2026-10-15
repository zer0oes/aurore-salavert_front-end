// Keep native scrolling and draw only the handle above the content.
export function installOverlayScrollbars(): () => void {
  const handles = new Map<HTMLElement, HTMLElement>();
  let frame = 0;
  let drag: { element: HTMLElement; pointer: number; start: number; scroll: number; ratio: number } | undefined;
  const selector = 'body, .project, .project__gallery, .menu, .projects-list__filters';

  const update = () => {
    frame = 0;
    const candidates = new Set(Array.from(document.querySelectorAll<HTMLElement>(selector)));
    for (const [element, handle] of handles) {
      if (!candidates.has(element)) {
        handle.remove();
        handles.delete(element);
      }
    }
    for (const element of candidates) {
      const style = getComputedStyle(element);
      const horizontal = element.classList.contains('projects-list__filters');
      const overflow = horizontal ? style.overflowX : style.overflowY;
      const viewport = horizontal ? element.clientWidth : element.clientHeight;
      const content = horizontal ? element.scrollWidth : element.scrollHeight;
      let handle = handles.get(element);
      if (!/auto|scroll/.test(overflow) || content <= viewport + 1 || !viewport || style.visibility === 'hidden' || (element.classList.contains('menu') && style.pointerEvents === 'none')) {
        if (handle) handle.hidden = true;
        continue;
      }
      if (!handle) {
        handle = document.createElement('div');
        handle.className = 'overlay-scrollbar';
        handle.setAttribute('aria-hidden', 'true');
        document.body.appendChild(handle);
        handles.set(element, handle);
        handle.addEventListener('pointerdown', event => {
          if (event.button !== 0) return;
          event.preventDefault();
          const size = horizontal ? element.clientWidth : element.clientHeight;
          const total = horizontal ? element.scrollWidth : element.scrollHeight;
          const length = Math.min(size, Math.max(24, size * size / total));
          drag = { element, pointer: event.pointerId, start: horizontal ? event.clientX : event.clientY,
            scroll: horizontal ? element.scrollLeft : element.scrollTop,
            ratio: (total - size) / Math.max(1, size - length) };
          handle!.setPointerCapture(event.pointerId);
        });
        handle.addEventListener('pointermove', event => {
          if (!drag || drag.element !== element || drag.pointer !== event.pointerId) return;
          const value = drag.scroll + ((horizontal ? event.clientX : event.clientY) - drag.start) * drag.ratio;
          // Assignment keeps dragging immediate despite smooth anchor scrolling.
          const previous = element.style.scrollBehavior;
          element.style.scrollBehavior = 'auto';
          if (horizontal) element.scrollLeft = value;
          else element.scrollTop = value;
          element.style.scrollBehavior = previous;
          schedule();
        });
        const stop = () => { drag = undefined; };
        handle.addEventListener('pointerup', stop);
        handle.addEventListener('pointercancel', stop);
        handle.addEventListener('lostpointercapture', stop);
      }
      const rect = element.getBoundingClientRect();
      const length = Math.min(viewport, Math.max(24, viewport * viewport / content));
      const offset = (horizontal ? element.scrollLeft : element.scrollTop) / (content - viewport) * (viewport - length);
      const left = horizontal ? rect.left + offset : rect.left + element.clientWidth - 5;
      const top = horizontal ? rect.top + element.clientHeight - 5 : rect.top + offset;
      const css = 'position:fixed;left:' + left + 'px;top:' + top + 'px;width:' + (horizontal ? length : 5) + 'px;height:' + (horizontal ? 5 : length) + 'px;';
      if (handle.style.cssText !== css) handle.style.cssText = css;
      handle.hidden = false;
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const observer = new MutationObserver(records => {
    if (records.some(record => !(record.target instanceof Element && record.target.classList.contains('overlay-scrollbar')))) schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
  document.addEventListener('scroll', schedule, true);
  document.addEventListener('load', schedule, true);
  window.addEventListener('resize', schedule);
  schedule();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.removeEventListener('scroll', schedule, true);
    document.removeEventListener('load', schedule, true);
    window.removeEventListener('resize', schedule);
    handles.forEach(handle => handle.remove());
  };
}
