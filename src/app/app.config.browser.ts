import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app.config';

const browserConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideClientHydration(withEventReplay()),
  ]
};

export const config = mergeApplicationConfig(appConfig, browserConfig);
