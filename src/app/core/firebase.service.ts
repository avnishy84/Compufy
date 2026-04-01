import { Injectable, isDevMode, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly app: FirebaseApp = initializeApp(environment.firebase);
  analytics: Analytics | null = null;

  constructor() {
    // Analytics only runs in the browser and in production
    if (isPlatformBrowser(this.platformId) && !isDevMode()) {
      isSupported().then(supported => {
        if (supported) {
          this.analytics = getAnalytics(this.app);
        }
      });
    }
  }
}
