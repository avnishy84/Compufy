import { drawBullet, drawParticle, drawRocket, renderFrame } from './renderer';
import { Bullet, GameState, Particle, Rocket } from './entities';

function makeMockCtx(): jasmine.SpyObj<CanvasRenderingContext2D> & { canvas: HTMLCanvasElement } {
  const canvas = { width: 800, height: 600 } as HTMLCanvasElement;
  const ctx = jasmine.createSpyObj<CanvasRenderingContext2D>('ctx', [
    'clearRect',
    'save',
    'restore',
    'translate',
    'rotate',
    'beginPath',
    'moveTo',
    'lineTo',
    'closePath',
    'fill',
    'fillRect',
    'arc',
  ]);
  (ctx as unknown as { canvas: HTMLCanvasElement }).canvas = canvas;
  ctx.fillStyle = '';
  ctx.globalAlpha = 1;
  return ctx as jasmine.SpyObj<CanvasRenderingContext2D> & { canvas: HTMLCanvasElement };
}

const rocket: Rocket = { x: 100, y: 100, vx: 0, vy: 0, angle: 0 };
const bullet: Bullet = { x: 50, y: 50, vx: 0, vy: -600 };
const particle: Particle = { x: 200, y: 200, vx: 10, vy: -10, born: 1000, lifespan: 400 };

describe('drawRocket', () => {
  it('calls save() and restore() symmetrically', () => {
    const ctx = makeMockCtx();
    drawRocket(ctx, rocket);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('translates to rocket position and rotates by rocket angle', () => {
    const ctx = makeMockCtx();
    drawRocket(ctx, { ...rocket, x: 42, y: 77, angle: 1.5 });
    expect(ctx.translate).toHaveBeenCalledWith(42, 77);
    expect(ctx.rotate).toHaveBeenCalledWith(1.5);
  });
});

describe('drawBullet', () => {
  it('calls save() and restore() symmetrically', () => {
    const ctx = makeMockCtx();
    drawBullet(ctx, bullet);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('translates to bullet position', () => {
    const ctx = makeMockCtx();
    drawBullet(ctx, { ...bullet, x: 10, y: 20 });
    expect(ctx.translate).toHaveBeenCalledWith(10, 20);
  });

  it('draws a 4x12 rectangle centered at origin', () => {
    const ctx = makeMockCtx();
    drawBullet(ctx, bullet);
    expect(ctx.fillRect).toHaveBeenCalledWith(-2, -6, 4, 12);
  });

  it('rotates to align with travel direction', () => {
    const ctx = makeMockCtx();
    const b: Bullet = { x: 0, y: 0, vx: 100, vy: -100 };
    drawBullet(ctx, b);
    expect(ctx.rotate).toHaveBeenCalledWith(Math.atan2(b.vx, -b.vy));
  });
});

describe('drawParticle', () => {
  it('calls save() and restore() symmetrically', () => {
    const ctx = makeMockCtx();
    drawParticle(ctx, particle, 1200);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('draws a circle at particle position with radius 3', () => {
    const ctx = makeMockCtx();
    drawParticle(ctx, particle, 1000);
    expect(ctx.arc).toHaveBeenCalledWith(particle.x, particle.y, 3, 0, Math.PI * 2);
  });

  it('sets globalAlpha proportional to remaining lifespan', () => {
    const ctx = makeMockCtx();
    // elapsed = 200ms out of 400ms → opacity = 0.5
    drawParticle(ctx, particle, 1200);
    expect(ctx.globalAlpha).toBe(0.5);
  });

  it('clamps opacity to 0 when particle has expired', () => {
    const ctx = makeMockCtx();
    // elapsed = 500ms, lifespan = 400ms → opacity = max(0, 1 - 500/400) = 0
    drawParticle(ctx, particle, 1500);
    expect(ctx.globalAlpha).toBe(0);
  });
});

describe('renderFrame', () => {
  it('calls clearRect before any draw calls', () => {
    const ctx = makeMockCtx();
    const callOrder: string[] = [];
    ctx.clearRect.and.callFake(() => callOrder.push('clearRect'));
    ctx.save.and.callFake(() => callOrder.push('save'));
    const state: GameState = { rocket, bullets: [bullet], particles: [particle] };
    renderFrame(ctx, state, 1200);

    const clearIdx = callOrder.indexOf('clearRect');
    const firstSaveIdx = callOrder.indexOf('save');
    expect(clearIdx).toBeGreaterThanOrEqual(0);
    expect(clearIdx).toBeLessThan(firstSaveIdx);
  });

  it('clears the full canvas', () => {
    const ctx = makeMockCtx();
    const state: GameState = { rocket, bullets: [], particles: [] };
    renderFrame(ctx, state, 0);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  it('draws rocket, then bullets, then particles in order', () => {
    const ctx = makeMockCtx();
    const translateArgs: Array<[number, number]> = [];
    ctx.translate.and.callFake((x: number, y: number) => translateArgs.push([x, y]));

    const b: Bullet = { x: 55, y: 66, vx: 0, vy: -600 };
    const p: Particle = { x: 77, y: 88, vx: 0, vy: 0, born: 1000, lifespan: 400 };
    const r: Rocket = { x: 11, y: 22, vx: 0, vy: 0, angle: 0 };
    const state: GameState = { rocket: r, bullets: [b], particles: [p] };
    renderFrame(ctx, state, 1200);

    // translate is called for rocket, bullet (not particle — arc uses absolute coords)
    expect(translateArgs[0]).toEqual([11, 22]); // rocket first
    expect(translateArgs[1]).toEqual([55, 66]); // bullet second
  });

  it('save() and restore() are called the same number of times', () => {
    const ctx = makeMockCtx();
    const state: GameState = {
      rocket,
      bullets: [bullet, { ...bullet, x: 60 }],
      particles: [particle, { ...particle, x: 210 }],
    };
    renderFrame(ctx, state, 1200);
    expect(ctx.save.calls.count()).toBe(ctx.restore.calls.count());
  });
});
