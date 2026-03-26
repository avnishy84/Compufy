import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface NNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
}

interface Connection {
  from: number;
  to: number;
  signal: number;
  active: boolean;
  speed: number;
}

@Component({
  selector: 'app-neural-network-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas style="position:absolute;inset:0;width:100%;height:100%;opacity:0.5;" aria-hidden="true"></canvas>`,
})
export class NeuralNetworkCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private nodes: NNode[] = [];
  private connections: Connection[] = [];
  private frame = 0;
  private ro?: ResizeObserver;

  private readonly NODE_COUNT = 40;
  private readonly MAX_DIST = 150;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Use ResizeObserver so we get real dimensions after layout
    this.ro = new ResizeObserver(() => {
      const parent = canvas.parentElement!;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      this.initNodes();
      this.buildConnections();
    });
    this.ro.observe(canvas.parentElement!);

    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    this.ro?.disconnect();
  }

  private initNodes(): void {
    const { width, height } = this.canvasRef.nativeElement;
    if (!width || !height) return;
    this.nodes = Array.from({ length: this.NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 2 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }));
  }

  private buildConnections(): void {
    this.connections = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        if (Math.hypot(dx, dy) < this.MAX_DIST) {
          this.connections.push({
            from: i, to: j,
            signal: -1, active: false,
            speed: 0.006 + Math.random() * 0.01,
          });
        }
      }
    }
  }

  private readonly animate = (): void => {
    this.animId = requestAnimationFrame(this.animate);
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas;
    if (!width || !height || !this.nodes.length) return;

    this.frame++;
    this.ctx.clearRect(0, 0, width, height);

    // Move nodes
    for (const n of this.nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width)  n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
      n.pulse += n.pulseSpeed;
    }

    // Rebuild connections every 2 seconds
    if (this.frame % 120 === 0) this.buildConnections();

    // Fire a new signal every ~1.5 seconds
    if (this.frame % 90 === 0 && this.connections.length) {
      const c = this.connections[Math.floor(Math.random() * this.connections.length)];
      c.signal = 0;
      c.active = true;
    }

    // Draw edges
    for (const c of this.connections) {
      const a = this.nodes[c.from];
      const b = this.nodes[c.to];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const alpha = (1 - dist / this.MAX_DIST) * 0.25;

      this.ctx.beginPath();
      this.ctx.moveTo(a.x, a.y);
      this.ctx.lineTo(b.x, b.y);
      this.ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      // Travelling signal
      if (c.active && c.signal >= 0) {
        c.signal += c.speed;
        const sx = a.x + (b.x - a.x) * c.signal;
        const sy = a.y + (b.y - a.y) * c.signal;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(99,102,241,${alpha * 4})`;
        this.ctx.fill();
        if (c.signal >= 1) { c.active = false; c.signal = -1; }
      }
    }

    // Draw nodes
    for (const n of this.nodes) {
      const glow = 0.6 + 0.4 * Math.sin(n.pulse);
      const r = n.radius * glow;

      // Glow halo
      const grad = this.ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
      grad.addColorStop(0, `rgba(34,211,238,${0.4 * glow})`);
      grad.addColorStop(1, 'rgba(34,211,238,0)');
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Core dot
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(34,211,238,${0.9 * glow})`;
      this.ctx.fill();
    }
  };
}
