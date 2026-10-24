import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GameEngine } from './game-engine';
import { InputHandler } from './input-handler';
import { buildCache, refreshRects } from './target-cache';
import { TargetEntry } from './entities';
import { GameStateService } from './game-state.service';

@Component({
  selector: 'app-rocket-game-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #gameCanvas
      class="fixed top-0 left-0 w-screen h-screen"
      style="z-index: 9999; pointer-events: none;"
      [width]="canvasWidth()"
      [height]="canvasHeight()"
    ></canvas>

    @if (active()) {
      <!-- Mobile virtual controls -->
      <div class="fixed bottom-8 left-0 right-0 z-[10000] flex items-end justify-between px-8 pointer-events-none select-none sm:hidden">

        <!-- Joystick pad -->
        <div class="pointer-events-auto relative grid grid-cols-3 gap-1">
          <!-- Up -->
          <div></div>
          <button
            type="button"
            class="touch-btn"
            (touchstart)="touchDir('up', true, $event)"
            (touchend)="touchDir('up', false, $event)"
            (touchcancel)="touchDir('up', false, $event)"
            aria-label="Move up"
          >▲</button>
          <div></div>
          <!-- Left / Down / Right -->
          <button
            type="button"
            class="touch-btn"
            (touchstart)="touchDir('left', true, $event)"
            (touchend)="touchDir('left', false, $event)"
            (touchcancel)="touchDir('left', false, $event)"
            aria-label="Move left"
          >◀</button>
          <button
            type="button"
            class="touch-btn"
            (touchstart)="touchDir('down', true, $event)"
            (touchend)="touchDir('down', false, $event)"
            (touchcancel)="touchDir('down', false, $event)"
            aria-label="Move down"
          >▼</button>
          <button
            type="button"
            class="touch-btn"
            (touchstart)="touchDir('right', true, $event)"
            (touchend)="touchDir('right', false, $event)"
            (touchcancel)="touchDir('right', false, $event)"
            aria-label="Move right"
          >▶</button>
        </div>

        <!-- Fire button -->
        <button
          type="button"
          class="pointer-events-auto touch-fire"
          (touchstart)="touchFire(true, $event)"
          (touchend)="touchFire(false, $event)"
          (touchcancel)="touchFire(false, $event)"
          aria-label="Fire"
        >🚀</button>
      </div>
    }
  `,
  styles: [`
    .touch-btn {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: rgba(99,102,241,0.25);
      border: 1.5px solid rgba(99,102,241,0.5);
      color: white;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }
    .touch-btn:active {
      background: rgba(99,102,241,0.55);
    }
    .touch-fire {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(239,68,68,0.25);
      border: 2px solid rgba(239,68,68,0.6);
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }
    .touch-fire:active {
      background: rgba(239,68,68,0.55);
    }
  `],
})
export class RocketGameOverlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly gameState = inject(GameStateService);
  readonly active = this.gameState.active;
  readonly canvasWidth = signal<number>(0);
  readonly canvasHeight = signal<number>(0);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly engine = new GameEngine();
  private readonly inputHandler = new InputHandler();
  private targetCache: TargetEntry[] = [];
  private resizeRafId: number | null = null;

  // ── Touch control handlers ──────────────────────────────────────────────

  touchDir(dir: 'up' | 'down' | 'left' | 'right', pressed: boolean, e: Event): void {
    e.preventDefault();
    this.inputHandler.setTouch({ [dir]: pressed });
  }

  touchFire(pressed: boolean, e: Event): void {
    e.preventDefault();
    this.inputHandler.setTouch({ fire: pressed });
  }

  // ── Keyboard / click handlers ───────────────────────────────────────────

  private readonly onTriggerClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (!target.closest('#game-trigger')) return;
    if (this.active()) {
      this.deactivate();
    } else {
      const me = e as MouseEvent;
      this.activate(me.clientX, me.clientY);
    }
  };

  private static readonly GAME_KEYS = new Set([
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'KeyW', 'KeyA', 'KeyS', 'KeyD',
    'Space',
  ]);

  private readonly onKeyDown = (e: Event): void => {
    const ke = e as KeyboardEvent;
    if (this.active() && RocketGameOverlayComponent.GAME_KEYS.has(ke.code)) {
      e.preventDefault();
    }
    if (ke.code === 'Escape' && this.active()) {
      this.deactivate();
    }
  };

  private readonly onResize = (): void => {
    if (this.resizeRafId !== null) return;
    this.resizeRafId = requestAnimationFrame(() => {
      this.resizeRafId = null;
      this.canvasWidth.set(window.innerWidth);
      this.canvasHeight.set(window.innerHeight);
      refreshRects(this.targetCache);
    });
  };

  // ── Lifecycle ───────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.inputHandler.attach(window);
    this.targetCache = buildCache();

    document.addEventListener('click', this.onTriggerClick);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.engine.stop();
    this.inputHandler.detach();

    if (this.resizeRafId !== null) {
      cancelAnimationFrame(this.resizeRafId);
      this.resizeRafId = null;
    }

    document.removeEventListener('click', this.onTriggerClick);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('resize', this.onResize);

    for (const entry of this.targetCache) {
      const el = entry.element as HTMLElement;
      el.classList.remove('target-breaking');
      el.style.visibility = '';
    }
  }

  private activate(spawnX: number, spawnY: number): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('[RocketGameOverlay] Canvas 2D context unavailable');
      return;
    }

    this.canvasWidth.set(window.innerWidth);
    this.canvasHeight.set(window.innerHeight);
    this.targetCache = buildCache();

    this.engine.spawnAt(spawnX, spawnY);
    this.engine.start(ctx, canvas, this.inputHandler, this.targetCache);
    this.active.set(true);
  }

  private deactivate(): void {
    this.engine.stop();
    this.active.set(false);

    // Reset any held touch inputs
    this.inputHandler.setTouch({ up: false, down: false, left: false, right: false, fire: false });

    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
