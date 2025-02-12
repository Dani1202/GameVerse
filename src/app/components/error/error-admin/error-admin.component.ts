import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-error-admin',
  templateUrl: './error-admin.component.html',
  styleUrls: ['./error-admin.component.scss'],
})
export class ErrorAdminComponent {
  constructor(private loginService: LoginService) {}

  openLoginModal() {
    this.loginService.openLoginModal();
  }
}
