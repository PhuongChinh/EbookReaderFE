import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserSessionService } from './service'

@Injectable({
  providedIn: 'root'
})
export class AppAuthorizationGuard implements CanActivate {
  constructor(private session: UserSessionService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.session.isAuthenticated;
    console.log('AuthGuard: isAuthenticated? ', (isAuthenticated ? 'Yes' : 'No'))

    if (!isAuthenticated) {
      this.session.clearSession();
      this.router.navigate(['/ui/login']);
    }

    return isAuthenticated;
  }

}