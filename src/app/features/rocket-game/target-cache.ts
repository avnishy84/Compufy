import { TargetEntry } from './entities';

/** Elements that should never be treated as targets (game UI itself). */
const EXCLUDED_SELECTORS = [
  'app-rocket-game-overlay',
  'app-rocket-game-overlay *',
  '#game-trigger',
  '#game-trigger *',
];

/**
 * Selects all meaningful visible page elements as targets.
 * Falls back to `.target` class if explicitly set, but also auto-discovers
 * headings, paragraphs, buttons, links, cards, images, and section blocks.
 */
export function buildCache(): TargetEntry[] {
  const AUTO_SELECTORS = [
    'h1', 'h2', 'h3', 'h4',
    'p',
    'button:not([id="game-trigger"])',
    'a[routerlink], a[href]',
    'img',
    '[class*="card"]',
    '[class*="service"]',
    '[class*="stat"]',
    '[class*="feature"]',
    '[class*="tech-cube"]',
    '.target',
  ].join(', ');

  const excluded = new Set<Element>(
    EXCLUDED_SELECTORS.flatMap((sel) => Array.from(document.querySelectorAll(sel)))
  );

  const cache: TargetEntry[] = [];
  const seen = new Set<Element>();

  document.querySelectorAll(AUTO_SELECTORS).forEach((element) => {
    if (seen.has(element) || excluded.has(element)) return;

    // Skip elements with zero size or not visible in the viewport
    const rect = element.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;

    seen.add(element);
    cache.push({ element, rect, destroyed: false });
  });

  return cache;
}

export function refreshRects(cache: TargetEntry[]): void {
  for (const entry of cache) {
    if (!entry.destroyed) {
      entry.rect = entry.element.getBoundingClientRect();
    }
  }
}
