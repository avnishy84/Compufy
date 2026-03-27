import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  /** True while the rocket game is running. */
  readonly active = signal<boolean>(false);
}
