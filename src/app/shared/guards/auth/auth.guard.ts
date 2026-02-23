import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Observamos el estado del usuario
  return user(auth).pipe(
    take(1), // Tomamos la primera emisión y cerramos la suscripción
    map(u => !!u), // Convertimos el objeto usuario en un booleano (true si existe)
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    })
  );
};