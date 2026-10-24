export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
}

export interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // radians, 0 = pointing up
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;     // timestamp ms
  lifespan: number; // ms (400)
}

export interface TargetEntry {
  element: Element;
  rect: DOMRect;
  destroyed: boolean;
}

export interface GameState {
  rocket: Rocket;
  bullets: Bullet[];
  particles: Particle[];
}
