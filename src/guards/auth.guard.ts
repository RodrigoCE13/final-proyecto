// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>(observer => {
      // Inicializa la aplicación Firebase con la configuración de environment
      firebase.initializeApp(environment.firebaseConfig);

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // Usuario autenticado
          observer.next(true);
        } else {
          // Usuario no autenticado, redirigir a la página de inicio de sesión
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
