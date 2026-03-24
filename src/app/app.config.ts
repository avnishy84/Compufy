import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection, inject, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AppErrorHandler } from './core/app-error-handler';
import { httpErrorInterceptor } from './core/http-error.interceptor';
import { FirebaseService } from './core/firebase.service';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  Cloud, TrendingUp, Lightbulb, ArrowRight,
  Code2, LayoutDashboard, Smartphone, Globe,
  Search, BarChart, Settings, Shield, Users,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideAnimations(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Cloud, TrendingUp, Lightbulb, ArrowRight,
        Code2, LayoutDashboard, Smartphone, Globe,
        Search, BarChart, Settings, Shield, Users,
      }),
    },
    // Eagerly initialize Firebase on app start
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const firebase = inject(FirebaseService);
        return () => firebase; // service constructor handles init
      },
      multi: true,
    },
  ]
};
