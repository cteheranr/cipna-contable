import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { routes } from './app.routes';
import { environment } from './shared/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // PRIMERO Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // DESPUÉS los servicios que lo usan
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
};