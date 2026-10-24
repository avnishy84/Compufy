import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';
import { first, filter } from 'rxjs';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef: ApplicationRef) => {
    // Fire GTM only after Angular is fully stable (all async tasks settled)
    appRef.isStable.pipe(
      filter(stable => stable),
      first()
    ).subscribe(() => {
      (function(w: any, d: Document, s: string, l: string, i: string) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s) as HTMLScriptElement;
        const dl = l !== 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode!.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', 'GTM-5KNS5N63');
    });
  })
  .catch((err) => console.error(err));
