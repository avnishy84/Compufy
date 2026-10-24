import { buildCache, refreshRects } from './target-cache';
import { TargetEntry } from './entities';

describe('TargetCache', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function addTarget(id?: string): HTMLElement {
    const el = document.createElement('div');
    el.className = 'target';
    if (id) el.id = id;
    container.appendChild(el);
    return el;
  }

  // ── buildCache ────────────────────────────────────────────────────────────

  describe('buildCache()', () => {
    it('should return an empty array when no .target elements exist', () => {
      expect(buildCache()).toEqual([]);
    });

    it('should return one entry per .target element', () => {
      addTarget('a');
      addTarget('b');
      addTarget('c');
      expect(buildCache().length).toBe(3);
    });

    it('should set destroyed=false on every entry', () => {
      addTarget();
      addTarget();
      const cache = buildCache();
      expect(cache.every((e) => e.destroyed === false)).toBeTrue();
    });

    it('should store the element reference', () => {
      const el = addTarget('ref-test');
      const cache = buildCache();
      expect(cache.some((e) => e.element === el)).toBeTrue();
    });

    it('should store a DOMRect for each entry', () => {
      addTarget();
      const cache = buildCache();
      expect(cache[0].rect).toBeDefined();
      expect(typeof cache[0].rect.width).toBe('number');
    });

    it('should not include elements without the target class', () => {
      const plain = document.createElement('div');
      plain.className = 'not-a-target';
      container.appendChild(plain);
      expect(buildCache().length).toBe(0);
    });
  });

  // ── refreshRects ─────────────────────────────────────────────────────────

  describe('refreshRects()', () => {
    it('should update rect for non-destroyed entries', () => {
      const el = addTarget();
      const cache = buildCache();
      const originalRect = cache[0].rect;

      // Spy on getBoundingClientRect to return a new object
      const newRect = { x: 99, y: 99, width: 50, height: 50 } as DOMRect;
      spyOn(el, 'getBoundingClientRect').and.returnValue(newRect);

      refreshRects(cache);

      expect(cache[0].rect).toBe(newRect);
      expect(cache[0].rect).not.toBe(originalRect);
    });

    it('should skip destroyed entries', () => {
      const el = addTarget();
      const cache = buildCache();
      cache[0].destroyed = true;

      const spy = spyOn(el, 'getBoundingClientRect');
      refreshRects(cache);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should handle an empty cache without throwing', () => {
      expect(() => refreshRects([])).not.toThrow();
    });

    it('should only refresh non-destroyed entries in a mixed cache', () => {
      addTarget('live');
      addTarget('dead');
      const cache = buildCache();

      // Mark second entry as destroyed
      cache[1].destroyed = true;

      const liveSpy = spyOn(cache[0].element, 'getBoundingClientRect').and.returnValue(
        { x: 1, y: 1, width: 10, height: 10 } as DOMRect
      );
      const deadSpy = spyOn(cache[1].element, 'getBoundingClientRect');

      refreshRects(cache);

      expect(liveSpy).toHaveBeenCalledTimes(1);
      expect(deadSpy).not.toHaveBeenCalled();
    });

    it('should update all entries when none are destroyed', () => {
      addTarget();
      addTarget();
      const cache = buildCache();

      const spies = cache.map((entry) =>
        spyOn(entry.element, 'getBoundingClientRect').and.returnValue(
          { x: 0, y: 0, width: 20, height: 20 } as DOMRect
        )
      );

      refreshRects(cache);

      spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
    });
  });

  // ── integration ──────────────────────────────────────────────────────────

  describe('integration', () => {
    it('should build then refresh without errors', () => {
      addTarget();
      const cache = buildCache();
      expect(() => refreshRects(cache)).not.toThrow();
    });

    it('destroyed entries from buildCache should be skippable on refresh', () => {
      addTarget();
      const cache = buildCache();
      cache[0].destroyed = true;

      const spy = spyOn(cache[0].element, 'getBoundingClientRect');
      refreshRects(cache);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
