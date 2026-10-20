// Keep native scrolling and draw only the handle above the content.
export function scrollbarGeometry(start: number, end: number, viewport: number, content: number, scroll: number) {
  const track = Math.max(0, end - start);
  const visible = Math.min(viewport, track);
  const length = Math.min(track, Math.max(24, track * visible / Math.max(1, content)));
  const travel = track - length;
  const range = Math.max(0, content - viewport);
  const progress = range ? Math.max(0, Math.min(1, scroll / range)) : 0;
  return { start: start + progress * travel, length, ratio: range / Math.max(1, travel), track };
}

export function installOverlayScrollbars(): () => void {
  const handles = new Map<HTMLElement, HTMLElement>();
  const idleTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  let frame = 0;
  let drag: { element: HTMLElement; pointer: number; start: number; scroll: number; ratio: number } | undefined;
  const selector = 'body, .project, .project__gallery, .menu, .projects-list__filters';

  const measure = (element: HTMLElement, horizontal: boolean) => {
    const rect = element.getBoundingClientRect();
    const visual = window.visualViewport;
    const viewportTop = visual?.offsetTop || 0;
    const viewportLeft = visual?.offsetLeft || 0;
    const viewportBottom = viewportTop + (visual?.height || window.innerHeight);
    const viewportRight = viewportLeft + (visual?.width || window.innerWidth);
    const footer = document.querySelector('footer')?.getBoundingClientRect();
    const bottom = footer && footer.height > 0 ? Math.min(viewportBottom, footer.top) : viewportBottom;
    let start = Math.max(horizontal ? rect.left : rect.top, horizontal ? viewportLeft : viewportTop);
    let end = Math.min(horizontal ? rect.left + element.clientWidth : rect.top + element.clientHeight, horizontal ? viewportRight : bottom);
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      if (/auto|scroll|hidden|clip/.test(horizontal ? style.overflowX : style.overflowY)) {
        const bounds = parent.getBoundingClientRect();
        start = Math.max(start, horizontal ? bounds.left : bounds.top);
        end = Math.min(end, horizontal ? bounds.left + parent.clientWidth : bounds.top + parent.clientHeight);
      }
    }
    if (rect.bottom <= viewportTop || rect.top >= bottom || rect.right <= viewportLeft || rect.left >= viewportRight) end = start;
    return {
      ...scrollbarGeometry(start, end, horizontal ? element.clientWidth : element.clientHeight,
        horizontal ? element.scrollWidth : element.scrollHeight, horizontal ? element.scrollLeft : element.scrollTop),
      cross: horizontal ? Math.min(rect.top + element.clientHeight, bottom) - 5 : Math.min(rect.left + element.clientWidth, viewportRight) - 5,
    };
  };

  const update = () => {
    frame = 0;
    const candidates = new Set(Array.from(document.querySelectorAll<HTMLElement>(selector)));
    for (const [element, handle] of handles) {
      if (!candidates.has(element)) {
        handle.remove();
        handles.delete(element);
        clearTimeout(idleTimers.get(element));
        idleTimers.delete(element);
      }
    }
    for (const element of candidates) {
      const style = getComputedStyle(element);
      const horizontal = element.classList.contains('projects-list__filters');
      const overflow = horizontal ? style.overflowX : style.overflowY;
      const viewport = horizontal ? element.clientWidth : element.clientHeight;
      const content = horizontal ? element.scrollWidth : element.scrollHeight;
      const geometry = measure(element, horizontal);
      let handle = handles.get(element);
      if (!/auto|scroll/.test(overflow) || content <= viewport + 1 || !viewport || geometry.track < 1 || style.visibility === 'hidden' || (element.classList.contains('menu') && style.pointerEvents === 'none')) {
        if (handle) handle.hidden = true;
        continue;
      }
      if (!handle) {
        handle = document.createElement('div');
        handle.className = 'overlay-scrollbar' + (horizontal ? ' overlay-scrollbar--auto-hide' : '');
        handle.setAttribute('aria-hidden', 'true');
        document.body.appendChild(handle);
        handles.set(element, handle);
        handle.addEventListener('pointerdown', event => {
          if (event.button !== 0) return;
          event.preventDefault();
          const geometry = measure(element, horizontal);
          drag = { element, pointer: event.pointerId, start: horizontal ? event.clientX : event.clientY,
            scroll: horizontal ? element.scrollLeft : element.scrollTop,
            ratio: geometry.ratio };
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
      const length = geometry.length;
      const left = horizontal ? geometry.start : geometry.cross;
      const top = horizontal ? geometry.cross : geometry.start;
      const css = 'position:fixed;left:' + left + 'px;top:' + top + 'px;width:' + (horizontal ? length : 5) + 'px;height:' + (horizontal ? 5 : length) + 'px;';
      if (handle.style.cssText !== css) handle.style.cssText = css;
      handle.hidden = false;
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const onScroll = (event: Event) => {
    const element = event.target;
    if (element instanceof HTMLElement && element.classList.contains('projects-list__filters')) {
      handles.get(element)?.classList.add('is-scrolling');
      clearTimeout(idleTimers.get(element));
      idleTimers.set(element, setTimeout(() => {
        handles.get(element)?.classList.remove('is-scrolling');
        idleTimers.delete(element);
      }, 800));
    }
    schedule();
  };
  const observer = new MutationObserver(records => {
    if (records.some(record => !(record.target instanceof Element && record.target.classList.contains('overlay-scrollbar')))) schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
  document.addEventListener('scroll', onScroll, true);
  document.addEventListener('load', schedule, true);
  window.addEventListener('resize', schedule);
  window.visualViewport?.addEventListener('resize', schedule);
  window.visualViewport?.addEventListener('scroll', schedule);
  schedule();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.removeEventListener('scroll', onScroll, true);
    idleTimers.forEach(timer => clearTimeout(timer));
    document.removeEventListener('load', schedule, true);
    window.removeEventListener('resize', schedule);
    window.visualViewport?.removeEventListener('resize', schedule);
    window.visualViewport?.removeEventListener('scroll', schedule);
    handles.forEach(handle => handle.remove());
  };
}
