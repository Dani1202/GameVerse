import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});
  recoveryForm: FormGroup = new FormGroup({});

  activeModal: 'login' | 'register' | 'recovery' | null = null;

  loginError: boolean = false;
  registrationError: boolean = false;
  registrationSuccess: boolean = false;
  recoveryError: boolean = false;
  recoverySuccess: boolean = false;

  currentUser: any = null;
  isLoggedIn: boolean = false;

  // References to modal elements in the DOM
  @ViewChild('loginModal') loginModal?: ElementRef;
  @ViewChild('recoveryModal') recoveryModal?: ElementRef;
  @ViewChild('registerModal') registerModal?: ElementRef;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    // Initialize the login form with validation
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    // Initialize the registration form with validation
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      username: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')])
    });

    // Initialize the password recovery form with validation
    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    // Listen for login modal open event from the login service
    this.loginService.openLogin.subscribe(open => {
      if (open) {
        this.toggleModal('login');
      }
    });
  }

  // Opens or closes a specific modal
  toggleModal(modal: 'login' | 'register' | 'recovery' | null) {
    this.activeModal = modal;
  }

  login() {
    const { email, password } = this.loginForm.value;

    if (this.loginService.login(email, password)) {
      this.toggleModal(null);
      this.isLoggedIn = true;
      this.currentUser = this.loginService.getCurrentUser();
      this.router.navigate(['/']);
    } else {
      this.loginError = true;
    }
  }

  register() {
    const { email, password, confirmPassword, username } = this.registerForm.value;
    this.registrationError = false;
    this.registrationSuccess = false;

    if (
      this.registerForm.invalid ||
      this.loginService.isEmailTaken(email) ||
      this.loginService.isUsernameTaken(username) ||
      password !== confirmPassword
    ) {
      this.registrationError = true;
      return;
    }
    this.registrationSuccess = true;
  }

  recoverPassword() {
    const email = this.recoveryForm.value.email;
    const isEmailTaken = this.loginService.isEmailTaken(email);
    this.recoverySuccess = isEmailTaken;
    this.recoveryError = !isEmailTaken;
  }

  logout() {
    this.router.navigate(['/']);
    this.loginService.logout();
    this.isLoggedIn = false;
  }

  // Closes the modal when clicking outside of it
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('overlay') &&
      ![this.loginModal, this.registerModal, this.recoveryModal]
        .some(modal => modal?.nativeElement.contains(target))) {
      this.toggleModal(null);
    }
  }
}