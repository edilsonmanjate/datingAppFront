import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {

  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {}
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');

  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());

  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    
    if (elem) elem.blur(); // Remove focus from the dropdown

  }



  login() {
    console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success("Login successfuly ")
      },
      error: (error: any) => {
        console.error(error)
        //alert('Login failed: ' + error.error);

        this.toast.error(error.error);
      },
      complete: () => {
        console.log('Login request completed');
        this.creds = {};
      }
    });
  }

  logout() {
    this.accountService.logout();
    console.log('User logged out');
    this.router.navigateByUrl('/');

  }

}
