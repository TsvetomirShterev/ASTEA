import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: any;
  passwordForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    const newPassword = this.passwordForm.value.newPassword;

    if (this.user) {
      this.authService.updatePassword(this.user.id, newPassword).subscribe({
        next: () => alert('Password updated successfully!'),
        error: (error) => console.error(error)
      });
    }
  }
}
