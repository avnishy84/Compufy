import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AppErrorHandler } from './core/app-error-handler';
import { httpErrorInterceptor } from './core/http-error.interceptor';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  Cloud, TrendingUp, Lightbulb, ArrowRight, ArrowLeft,
  Code2, LayoutDashboard, Smartphone, Globe,
  Search, BarChart, Settings, Shield, ShieldCheck, Users,
  Monitor, AppWindow, CheckCircle2, SearchX, Zap, Gamepad2, X, Eye,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideAnimations(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Cloud, TrendingUp, Lightbulb, ArrowRight, ArrowLeft,
        Code2, LayoutDashboard, Smartphone, Globe,
        Search, BarChart, Settings, Shield, ShieldCheck, Users,
        Monitor, AppWindow, CheckCircle2, SearchX, Zap, Gamepad2, X, Eye,
      }),
    },
    // Firebase initializes lazily on first injection — not blocking bootstrap
  ]
};
