import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { RocketGameOverlayComponent } from './rocket-game-overlay.component';
import { GameEngine } from './game-engine';
import { InputHandler } from './input-handler';

describe('RocketGameOverlayComponent', () => {
  let fixture: ComponentFixture<RocketGameOverlayComponent>;
  let component: RocketGameOverlayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RocketGameOverlayComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    fixture = TestBed.createComponent(RocketGameOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create successfully', () => {
    expect(component).toBeTruthy();
  });

  it('active signal starts as false', () => {
    expect(component.active()).toBeFalse();
  });

  it('canvasWidth signal starts as 0', () => {
    expect(component.canvasWidth()).toBe(0);
  });

  it('canvasHeight signal starts as 0', () => {
    expect(component.canvasHeight()).toBe(0);
  });

  it('ngOnDestroy calls engine.stop()', () => {
    // Access private engine via type cast
    const eng = (component as unknown as { engine: GameEngine }).engine;
    const stopSpy = spyOn(eng, 'stop');
    component.ngOnDestroy();
    expect(stopSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy calls inputHandler.detach()', () => {
    const handler = (component as unknown as { inputHandler: InputHandler }).inputHandler;
    const detachSpy = spyOn(handler, 'detach');
    component.ngOnDestroy();
    expect(detachSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy restores target element styles', () => {
    // Set up a fake target element in the cache
    const el = document.createElement('div');
    el.classList.add('target-breaking');
    el.style.visibility = 'hidden';

    const cache = (component as unknown as { targetCache: unknown[] }).targetCache;
    cache.push({ element: el, rect: {} as DOMRect, destroyed: false });

    component.ngOnDestroy();

    expect(el.classList.contains('target-breaking')).toBeFalse();
    expect(el.style.visibility).toBe('');
  });

  it('canvas has pointer-events: none when inactive', () => {
    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLElement;
    expect(canvas.style.pointerEvents).toBe('none');
  });

  it('canvas has pointer-events: auto when active', () => {
    component.active.set(true);
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLElement;
    expect(canvas.style.pointerEvents).toBe('auto');
  });
});

describe('RocketGameOverlayComponent (SSR guard)', () => {
  let fixture: ComponentFixture<RocketGameOverlayComponent>;
  let component: RocketGameOverlayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RocketGameOverlayComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    fixture = TestBed.createComponent(RocketGameOverlayComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create without errors on server platform', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component).toBeTruthy();
  });

  it('ngOnDestroy does not throw on server platform', () => {
    fixture.detectChanges();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
