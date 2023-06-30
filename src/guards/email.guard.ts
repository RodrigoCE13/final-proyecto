// email.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class EmailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const email = 'rodrigo.ce.1091@gmail.com'; // Correo electrónico permitido

    return new Observable<boolean>(observer => {
      firebase.auth().onAuthStateChanged(user => {
        if (user && user.email === email) {
          // Usuario autenticado y con el correo correcto
          observer.next(true);
        } else {
          // Usuario no autenticado o correo incorrecto, redirigir a la página de inicio de sesión
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
