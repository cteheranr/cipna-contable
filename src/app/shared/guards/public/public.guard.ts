import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take, tap } from 'rxjs';

export const publicGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(u => !u), // Si NO hay usuario, devuelve true (deja pasar al login)
    tap(isGuest => {
      if (!isGuest) {
        // Si ya está logueado, redirigir al Dashboard
        router.navigate(['/dashboard']);
      }
    })
  );
};