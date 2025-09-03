import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toolbar-menu',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatMenuModule,
    ReactiveFormsModule
  ],
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.scss'
})
export class ToolbarMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public isLoginPage: boolean = false;
  toogleControl = new FormControl(false);
  @HostBinding('class') className = '';
  darkClassName = 'theme-dark';
  lightClassName = 'theme-light';

  constructor(private cookie: CookieService, private router: Router, private overlay: OverlayContainer) {}

  ngOnInit() {
    this.isLoginPage = this.router.url.includes('/login');

    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url.includes('/login');
      }
    });

    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.toogleControl.setValue(storedDarkMode, { emitEvent: false });
    this.applyTheme(storedDarkMode);
    this.toogleControl.valueChanges.subscribe((darkMode) => {
      this.applyTheme(darkMode ?? false);
    });
  }

  private applyTheme(darkMode: boolean) {
    const overlayContainer = this.overlay.getContainerElement();
    const overlayContainerClasses = overlayContainer.classList;
    const body = document.body.classList;

    if (darkMode) {
      this.className = this.darkClassName;
      overlayContainerClasses.add(this.darkClassName);
      overlayContainerClasses.remove(this.lightClassName);

      body.add(this.darkClassName);
      body.remove(this.lightClassName);
    } else {
      this.className = this.lightClassName;
      overlayContainerClasses.add(this.lightClassName);
      overlayContainerClasses.remove(this.darkClassName);

      body.add(this.lightClassName);
      body.remove(this.darkClassName);
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }

  handleLogout(): void {
    this.cookie.delete('USUARIO_NOME', '/');
    this.cookie.delete('USUARIO_INFORMACOES', '/');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
