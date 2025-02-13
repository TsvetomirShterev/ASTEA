import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.isLoading = true;

    this.authService.login(username, password).subscribe({
      next: (user) => {
        this.authService.setUserData(user);
        this.router.navigate(['/user']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}
