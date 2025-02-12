import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  // Method that implements the route protection logic
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expectedRole = route.data['expectedRole'];
    const currentRole = this.loginService.getRole();

    if (!this.loginService.isLoggedIn() || currentRole !== expectedRole) {
      this.router.navigate(['/error-admin']);
      return false
    }
    return true;
  }
}