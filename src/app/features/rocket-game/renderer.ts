import { Bullet, GameState, Particle, Rocket } from './entities';

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  now: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawRocket(ctx, state.rocket);
  for (const bullet of state.bullets) {
    drawBullet(ctx, bullet);
  }
  for (const particle of state.particles) {
    drawParticle(ctx, particle, now);
  }
}

export function drawRocket(ctx: CanvasRenderingContext2D, rocket: Rocket): void {
  ctx.save();
  ctx.translate(rocket.x, rocket.y);
  ctx.rotate(rocket.angle);

  // --- Body (rounded fuselage) ---
  ctx.beginPath();
  ctx.moveTo(0, -20);           // nose tip
  ctx.bezierCurveTo(8, -14, 10, -4, 10, 6);   // right side curve
  ctx.lineTo(10, 12);
  ctx.lineTo(-10, 12);
  ctx.lineTo(-10, 6);
  ctx.bezierCurveTo(-10, -4, -8, -14, 0, -20); // left side curve
  ctx.closePath();
  ctx.fillStyle = '#e2e8f0';    // light silver body
  ctx.fill();

  // --- Nose cone gradient ---
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.bezierCurveTo(6, -14, 8, -6, 8, 0);
  ctx.lineTo(-8, 0);
  ctx.bezierCurveTo(-8, -6, -6, -14, 0, -20);
  ctx.closePath();
  ctx.fillStyle = '#6366f1';    // indigo nose
  ctx.fill();

  // --- Window ---
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#7dd3fc';    // sky blue porthole
  ctx.fill();
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- Left fin ---
  ctx.beginPath();
  ctx.moveTo(-10, 6);
  ctx.lineTo(-18, 16);
  ctx.lineTo(-10, 12);
  ctx.closePath();
  ctx.fillStyle = '#6366f1';
  ctx.fill();

  // --- Right fin ---
  ctx.beginPath();
  ctx.moveTo(10, 6);
  ctx.lineTo(18, 16);
  ctx.lineTo(10, 12);
  ctx.closePath();
  ctx.fillStyle = '#6366f1';
  ctx.fill();

  // --- Engine nozzle ---
  ctx.beginPath();
  ctx.moveTo(-6, 12);
  ctx.lineTo(-7, 18);
  ctx.lineTo(7, 18);
  ctx.lineTo(6, 12);
  ctx.closePath();
  ctx.fillStyle = '#94a3b8';
  ctx.fill();

  // --- Exhaust flame (animated flicker using time) ---
  const flicker = 0.8 + 0.2 * Math.sin(Date.now() / 40);
  const grad = ctx.createLinearGradient(0, 18, 0, 18 + 18 * flicker);
  grad.addColorStop(0, 'rgba(251,191,36,0.95)');   // amber core
  grad.addColorStop(0.4, 'rgba(249,115,22,0.85)'); // orange mid
  grad.addColorStop(1, 'rgba(239,68,68,0)');        // red fade out
  ctx.beginPath();
  ctx.moveTo(-5, 18);
  ctx.quadraticCurveTo(0, 18 + 22 * flicker, 5, 18);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(Math.atan2(bullet.vx, -bullet.vy));

  // Glowing laser bolt
  const grad = ctx.createLinearGradient(0, -8, 0, 8);
  grad.addColorStop(0, 'rgba(165,243,252,0)');
  grad.addColorStop(0.3, '#22d3ee');
  grad.addColorStop(0.7, '#22d3ee');
  grad.addColorStop(1, 'rgba(165,243,252,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(-2, -8, 4, 16);

  // Bright core
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1, -5, 2, 10);

  ctx.restore();
}

export function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  now: number
): void {
  ctx.save();
  const elapsed = now - particle.born;
  const opacity = Math.max(0, 1 - elapsed / particle.lifespan);
  ctx.globalAlpha = opacity;

  // Cycle through warm explosion colors based on particle position (deterministic)
  const hue = ((particle.vx + particle.vy) * 0.5 + 30) % 60 + 10; // 10–70 range (red→yellow)
  ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;

  ctx.beginPath();
  ctx.arc(particle.x, particle.y, 3 * opacity + 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
