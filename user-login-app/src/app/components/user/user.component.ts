import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectUser } from 'src/app/store/auth/auth.selectors';
import { clearUser } from 'src/app/store/actions/auth.actions';
import { updatePassword } from 'src/app/store/actions/auth.actions'; // Ensure you have this action to update password in your store

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: any;
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user) => {
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
      this.store.dispatch(updatePassword({ userId: this.user.id, newPassword }));
      alert('Password updated successfully!');
    }
  }

  logout() {
    this.store.dispatch(clearUser());
    this.router.navigate(['/login']);
  }
}
