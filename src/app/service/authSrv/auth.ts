import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  user$ = user(this.auth);

  constructor() {}

  async login(email: string, pass: string) {
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, pass);
      if (res) {
        const user = this.auth.currentUser;
        if (user?.email) localStorage.setItem('currentUser', user?.email);
      }
      return res;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
