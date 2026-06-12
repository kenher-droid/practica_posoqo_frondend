import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Solo actúa si es 401, estamos en el admin, y NO es una llamada de login/registro
        const esRutaAuth = req.url.includes('/auth/login') || req.url.includes('/auth/registro');
        if (error.status === 401 && !esRutaAuth && this.router.url.startsWith('/admin')) {
          localStorage.removeItem('posoqo_token');
          void this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
