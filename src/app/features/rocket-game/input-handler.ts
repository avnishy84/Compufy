import { InputState } from './entities';

export class InputHandler {
  private readonly state: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
  };

  private readonly onKeyDown = (e: Event): void => {
    this.setKey((e as KeyboardEvent).code, true);
  };

  private readonly onKeyUp = (e: Event): void => {
    this.setKey((e as KeyboardEvent).code, false);
  };

  private target: EventTarget | null = null;

  attach(target: EventTarget): void {
    this.detach();
    this.target = target;
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
  }

  detach(): void {
    if (this.target) {
      this.target.removeEventListener('keydown', this.onKeyDown);
      this.target.removeEventListener('keyup', this.onKeyUp);
      this.target = null;
    }
    // Reset state on detach so stale keys don't persist
    this.state.up = false;
    this.state.down = false;
    this.state.left = false;
    this.state.right = false;
    this.state.fire = false;
  }

  getState(): InputState {
    return { ...this.state };
  }

  /** Directly set touch-driven input state (used by mobile virtual controls). */
  setTouch(partial: Partial<InputState>): void {
    if (partial.up    !== undefined) this.state.up    = partial.up;
    if (partial.down  !== undefined) this.state.down  = partial.down;
    if (partial.left  !== undefined) this.state.left  = partial.left;
    if (partial.right !== undefined) this.state.right = partial.right;
    if (partial.fire  !== undefined) this.state.fire  = partial.fire;
  }

  private setKey(code: string, pressed: boolean): void {
    switch (code) {
      case 'ArrowUp':
      case 'KeyW':
        this.state.up = pressed;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.state.down = pressed;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = pressed;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = pressed;
        break;
      case 'Space':
        this.state.fire = pressed;
        break;
      default:
        break;
    }
  }
}
