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
import { GameEngine, GameCallbacks } from './game-engine';
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
      [style.pointer-events]="active() ? 'auto' : 'none'"
      style="z-index: 9999;"
      [width]="canvasWidth()"
      [height]="canvasHeight()"
    ></canvas>

    @if (active()) {
      <!-- ── Start Screen (Task 5) ─────────────────────────────────────────── -->
      @if (showStartScreen()) {
        <div
          class="fixed inset-0 z-[10002] flex items-center justify-center sm:hidden"
          style="background:rgba(15,15,30,0.85);backdrop-filter:blur(12px);"
          aria-live="polite"
        >
          <div class="flex flex-col items-center gap-6 px-8 py-10 rounded-2xl text-white text-center"
               style="background:rgba(99,102,241,0.12);border:1.5px solid rgba(99,102,241,0.35);max-width:320px;width:90%;">
            <h2 class="text-2xl font-bold">Rocket Game</h2>
            <p class="text-slate-300 text-sm">Destroy all targets to win!</p>
            <!-- Controls legend -->
            <div class="flex flex-col gap-3 w-full text-sm">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🕹️</span>
                <span class="text-slate-300">D-pad — steer the rocket</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🚀</span>
                <span class="text-slate-300">Fire button — shoot bullets</span>
              </div>
            </div>
            <!-- Actions -->
            <div class="flex gap-3 w-full">
              <button
                type="button"
                class="flex-1 py-3 rounded-xl font-semibold text-white"
                style="background:rgba(99,102,241,0.6);border:1.5px solid rgba(99,102,241,0.8);min-height:44px;"
                aria-label="Start game"
                (click)="onStartPlay()"
              >Play</button>
              <button
                type="button"
                class="flex-1 py-3 rounded-xl font-semibold text-slate-300"
                style="background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);min-height:44px;"
                aria-label="Cancel and exit"
                (click)="deactivate()"
              >Exit</button>
            </div>
          </div>
        </div>
      }

      <!-- ── End Screen (Task 6) ──────────────────────────────────────────── -->
      @if (showEndScreen()) {
        <div
          class="fixed inset-0 z-[10002] flex items-center justify-center sm:hidden"
          style="background:rgba(15,15,30,0.85);backdrop-filter:blur(12px);"
          aria-live="polite"
        >
          <div class="flex flex-col items-center gap-6 px-8 py-10 rounded-2xl text-white text-center"
               style="background:rgba(99,102,241,0.12);border:1.5px solid rgba(99,102,241,0.35);max-width:320px;width:90%;">
            <h2 class="text-2xl font-bold">You Win! 🎉</h2>
            <p class="text-slate-300 text-sm">All targets destroyed</p>
            <div class="flex flex-col items-center gap-1">
              <span class="text-slate-400 text-xs uppercase tracking-widest">Final Score</span>
              <span class="text-5xl font-bold text-white">{{ score() }}</span>
            </div>
            <div class="flex gap-3 w-full">
              <button
                type="button"
                class="flex-1 py-3 rounded-xl font-semibold text-white"
                style="background:rgba(99,102,241,0.6);border:1.5px solid rgba(99,102,241,0.8);min-height:44px;"
                aria-label="Play again"
                (click)="playAgain()"
              >Play Again</button>
              <button
                type="button"
                class="flex-1 py-3 rounded-xl font-semibold text-slate-300"
                style="background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);min-height:44px;"
                aria-label="Exit game"
                (click)="deactivate()"
              >Exit</button>
            </div>
          </div>
        </div>
      }

      <!-- ── HUD — score display (Task 7) ─────────────────────────────────── -->
      @if (!showStartScreen() && !showEndScreen()) {
        <div
          class="fixed top-4 left-4 z-[10001] sm:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-semibold"
          style="background:rgba(99,102,241,0.25);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(8px);"
        >
          🎯 {{ score() }}
        </div>
      }

      <!-- ── Exit Button (Task 8) ──────────────────────────────────────────── -->
      <button
        type="button"
        class="fixed top-4 right-4 z-[10001] sm:hidden flex items-center justify-center rounded-xl text-white"
        style="min-width:44px;min-height:44px;background:rgba(99,102,241,0.25);border:1.5px solid rgba(99,102,241,0.5);backdrop-filter:blur(8px);"
        aria-label="Exit game"
        (touchstart)="onExitTouch($event)"
        (click)="deactivate()"
      >✕</button>

      <!-- ── Mobile virtual controls (Tasks 9) ─────────────────────────────── -->
      @if (!showStartScreen() && !showEndScreen()) {
        <div
          class="fixed left-0 right-0 z-[10000] flex items-end justify-between px-8 pointer-events-none select-none sm:hidden"
          [class.bottom-8]="!isLandscape()"
          [class.bottom-4]="isLandscape()"
        >
          <!-- D-pad -->
          <div class="pointer-events-auto relative grid grid-cols-3"
               [class.gap-1]="!isLandscape()"
               [style.gap]="isLandscape() ? '2px' : null">
            <!-- Up -->
            <div></div>
            <button
              type="button"
              class="touch-btn"
              [class.touch-btn-portrait]="!isLandscape()"
              [class.touch-btn-landscape]="isLandscape()"
              style="touch-action:none;"
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
              [class.touch-btn-portrait]="!isLandscape()"
              [class.touch-btn-landscape]="isLandscape()"
              style="touch-action:none;"
              (touchstart)="touchDir('left', true, $event)"
              (touchend)="touchDir('left', false, $event)"
              (touchcancel)="touchDir('left', false, $event)"
              aria-label="Move left"
            >◀</button>
            <button
              type="button"
              class="touch-btn"
              [class.touch-btn-portrait]="!isLandscape()"
              [class.touch-btn-landscape]="isLandscape()"
              style="touch-action:none;"
              (touchstart)="touchDir('down', true, $event)"
              (touchend)="touchDir('down', false, $event)"
              (touchcancel)="touchDir('down', false, $event)"
              aria-label="Move down"
            >▼</button>
            <button
              type="button"
              class="touch-btn"
              [class.touch-btn-portrait]="!isLandscape()"
              [class.touch-btn-landscape]="isLandscape()"
              style="touch-action:none;"
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
            [class.touch-fire-portrait]="!isLandscape()"
            [class.touch-fire-landscape]="isLandscape()"
            style="touch-action:none;"
            (touchstart)="touchFire(true, $event)"
            (touchend)="touchFire(false, $event)"
            (touchcancel)="touchFire(false, $event)"
            aria-label="Fire"
          >🚀</button>
        </div>
      }
    }
  `,
  styles: [`
    .touch-btn {
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
      transition: background 60ms, transform 120ms;
    }
    .touch-btn-portrait {
      width: 52px;
      height: 52px;
    }
    .touch-btn-landscape {
      width: 44px;
      height: 44px;
    }
    .touch-btn:active {
      background: rgba(99,102,241,0.65);
      transform: scale(0.92);
    }
    .touch-fire {
      border-radius: 50%;
      background: rgba(239,68,68,0.25);
      border: 2px solid rgba(239,68,68,0.6);
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
      transition: background 60ms, transform 120ms;
    }
    .touch-fire-portrait {
      width: 72px;
      height: 72px;
    }
    .touch-fire-landscape {
      width: 60px;
      height: 60px;
    }
    .touch-fire:active {
      background: rgba(239,68,68,0.65);
      transform: scale(0.92);
    }
  `],
})
export class RocketGameOverlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly gameState = inject(GameStateService);
  readonly active = this.gameState.active;
  readonly canvasWidth = signal<number>(0);
  readonly canvasHeight = signal<number>(0);

  // ── New signals (Tasks 4.1–4.4) ────────────────────────────────────────
  readonly score           = signal<number>(0);
  readonly showStartScreen = this.gameState.showStartScreen;
  readonly showEndScreen   = signal<boolean>(false);
  readonly isLandscape     = signal<boolean>(false);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly engine = new GameEngine();
  private readonly inputHandler = new InputHandler();
  private targetCache: TargetEntry[] = [];
  private resizeRafId: number | null = null;

  // ── Callback arrow methods (Tasks 11.1–11.2) ───────────────────────────

  private readonly onTargetDestroyedCb = (count: number): void => {
    this.score.set(count);
  };

  private readonly onAllDestroyedCb = (): void => {
    this.showEndScreen.set(true);
  };

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
      this.isLandscape.set(window.innerWidth > window.innerHeight); // Task 4.5
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

    this.canvasWidth.set(window.innerWidth);
    this.canvasHeight.set(window.innerHeight);
    this.isLandscape.set(window.innerWidth > window.innerHeight); // Task 4.6
    this.targetCache = buildCache();

    this.engine.spawnAt(spawnX, spawnY);
    this.startEngine(); // Task 5.6 — use startEngine() instead of direct engine.start()
    this.active.set(true);
  }

  deactivate(): void {
    this.engine.stop();

    // Task 10.1 — reset all new signals before clearing active
    this.score.set(0);
    this.gameState.showStartScreen.set(false);
    this.showEndScreen.set(false);

    this.active.set(false);

    // Reset any held touch inputs
    this.inputHandler.setTouch({ up: false, down: false, left: false, right: false, fire: false });

    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ── Private engine helpers ──────────────────────────────────────────────

  /** Encapsulates engine.start() with callbacks wired up (Task 5.6, 11.3). */
  private startEngine(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const callbacks: GameCallbacks = {
      onTargetDestroyed: this.onTargetDestroyedCb,
      onAllDestroyed: this.onAllDestroyedCb,
    };
    this.engine.start(ctx, canvas, this.inputHandler, this.targetCache, callbacks);
  }

  // ── Public action methods ───────────────────────────────────────────────

  onStartPlay(): void {
    this.gameState.showStartScreen.set(false);
    this.startEngine();
  }

  onExitTouch(e: Event): void {
    e.preventDefault();
    this.deactivate();
  }

  /** Task 6.6 — reset state and restart the engine for a new session. */
  playAgain(): void {
    this.showEndScreen.set(false);
    this.score.set(0);
    for (const entry of this.targetCache) {
      const el = entry.element as HTMLElement;
      el.style.visibility = '';
      el.classList.remove('target-breaking');
      entry.destroyed = false;
    }
    this.targetCache = buildCache();
    this.startEngine();
  }
}
