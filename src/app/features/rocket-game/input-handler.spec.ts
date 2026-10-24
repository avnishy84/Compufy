import { InputHandler } from './input-handler';

describe('InputHandler', () => {
  let handler: InputHandler;
  let target: EventTarget;

  function fireKey(type: 'keydown' | 'keyup', code: string): void {
    target.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true }));
  }

  beforeEach(() => {
    handler = new InputHandler();
    target = new EventTarget();
    handler.attach(target);
  });

  afterEach(() => {
    handler.detach();
  });

  describe('initial state', () => {
    it('should have all keys false before any input', () => {
      expect(handler.getState()).toEqual({
        up: false, down: false, left: false, right: false, fire: false,
      });
    });
  });

  describe('up key mapping', () => {
    it('should set up=true on ArrowUp keydown', () => {
      fireKey('keydown', 'ArrowUp');
      expect(handler.getState().up).toBeTrue();
    });

    it('should set up=true on KeyW keydown', () => {
      fireKey('keydown', 'KeyW');
      expect(handler.getState().up).toBeTrue();
    });

    it('should clear up on ArrowUp keyup', () => {
      fireKey('keydown', 'ArrowUp');
      fireKey('keyup', 'ArrowUp');
      expect(handler.getState().up).toBeFalse();
    });
  });

  describe('down key mapping', () => {
    it('should set down=true on ArrowDown keydown', () => {
      fireKey('keydown', 'ArrowDown');
      expect(handler.getState().down).toBeTrue();
    });

    it('should set down=true on KeyS keydown', () => {
      fireKey('keydown', 'KeyS');
      expect(handler.getState().down).toBeTrue();
    });

    it('should clear down on ArrowDown keyup', () => {
      fireKey('keydown', 'ArrowDown');
      fireKey('keyup', 'ArrowDown');
      expect(handler.getState().down).toBeFalse();
    });
  });

  describe('left key mapping', () => {
    it('should set left=true on ArrowLeft keydown', () => {
      fireKey('keydown', 'ArrowLeft');
      expect(handler.getState().left).toBeTrue();
    });

    it('should set left=true on KeyA keydown', () => {
      fireKey('keydown', 'KeyA');
      expect(handler.getState().left).toBeTrue();
    });

    it('should clear left on ArrowLeft keyup', () => {
      fireKey('keydown', 'ArrowLeft');
      fireKey('keyup', 'ArrowLeft');
      expect(handler.getState().left).toBeFalse();
    });
  });

  describe('right key mapping', () => {
    it('should set right=true on ArrowRight keydown', () => {
      fireKey('keydown', 'ArrowRight');
      expect(handler.getState().right).toBeTrue();
    });

    it('should set right=true on KeyD keydown', () => {
      fireKey('keydown', 'KeyD');
      expect(handler.getState().right).toBeTrue();
    });

    it('should clear right on ArrowRight keyup', () => {
      fireKey('keydown', 'ArrowRight');
      fireKey('keyup', 'ArrowRight');
      expect(handler.getState().right).toBeFalse();
    });
  });

  describe('fire key mapping', () => {
    it('should set fire=true on Space keydown', () => {
      fireKey('keydown', 'Space');
      expect(handler.getState().fire).toBeTrue();
    });

    it('should clear fire on Space keyup', () => {
      fireKey('keydown', 'Space');
      fireKey('keyup', 'Space');
      expect(handler.getState().fire).toBeFalse();
    });
  });

  describe('unrelated keys', () => {
    it('should not affect state for unrecognised key codes', () => {
      fireKey('keydown', 'KeyZ');
      expect(handler.getState()).toEqual({
        up: false, down: false, left: false, right: false, fire: false,
      });
    });
  });

  describe('getState snapshot', () => {
    it('should return a copy so mutations do not affect internal state', () => {
      fireKey('keydown', 'ArrowUp');
      const snapshot = handler.getState();
      snapshot.up = false;
      expect(handler.getState().up).toBeTrue();
    });
  });

  describe('detach', () => {
    it('should stop responding to events after detach', () => {
      handler.detach();
      fireKey('keydown', 'ArrowUp');
      expect(handler.getState().up).toBeFalse();
    });

    it('should reset all state on detach', () => {
      fireKey('keydown', 'ArrowUp');
      fireKey('keydown', 'Space');
      handler.detach();
      expect(handler.getState()).toEqual({
        up: false, down: false, left: false, right: false, fire: false,
      });
    });

    it('should be safe to call detach multiple times', () => {
      expect(() => {
        handler.detach();
        handler.detach();
      }).not.toThrow();
    });
  });

  describe('attach re-attach', () => {
    it('should remove old listeners when attaching to a new target', () => {
      const newTarget = new EventTarget();
      handler.attach(newTarget);

      // Old target should no longer trigger state changes
      fireKey('keydown', 'ArrowUp'); // fires on old `target`
      expect(handler.getState().up).toBeFalse();

      // New target should work
      newTarget.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
      expect(handler.getState().up).toBeTrue();
    });
  });
});
