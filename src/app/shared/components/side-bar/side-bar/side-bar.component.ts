import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from '../../../models/interfaces/responses/menu-item';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, Subject, takeUntil } from 'rxjs';
import { ToolbarMenuComponent } from '../../toolbar-menu/toolbar-menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ImageControlComponent } from '../../image-control/image-control.component';
import { CookieService } from 'ngx-cookie-service';
import { menuItems } from '../../../models/interfaces/responses/menu';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../../../directives/custom-mat-paginator-init';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterOutlet,
    ToolbarMenuComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    RouterModule,
    MatListModule,
    ImageControlComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    { provide: DateAdapter, useClass: NativeDateAdapter },
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public expandedIndex: number | null = null;
  public isSmallScreen = false;
  public popText = false;
  public items_menu: MenuItem[] = menuItems;
  private cookie = inject(CookieService);
  public menuName: string = '';
  public imageUrl: string = "";
  public isRounded: boolean = false;
  public isLoginRoute = false;
  public USUARIO_INFO= this.cookie.get('USUARIO_INFORMACOES');
  public USUARIO_LOGADO = this.cookie.get('USUARIO_NOME');

  constructor(private route: Router, private activeRoute: ActivatedRoute, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.initializeFromLocalStorage();

    this.route.events.pipe(takeUntil(this.destroy$), filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.menuName = this.activeRoute.firstChild?.snapshot.routeConfig?.path ?? '';
      this.menuName = this.menuName.replace(/-/g, ' ');
      this.isLoginRoute = this.menuName === 'login';
    });
  }

  initializeFromLocalStorage(): void {
    const savedImage = localStorage.getItem('imageUrl');
    const savedIsRounded = localStorage.getItem('isRounded');

    if (savedImage) {
      this.imageUrl = savedImage;
    }

    if (savedIsRounded !== null) {
      this.isRounded = JSON.parse(savedIsRounded);
    }
  }

  toggleImageShape(): void {
    this.isRounded = !this.isRounded;
    localStorage.setItem('isRounded', JSON.stringify(this.isRounded));
  }

  ngAfterContentInit(): void {
    this.breakpointObserver
        .observe(['(max-width: 800px)'])
        .subscribe((res) => this.isSmallScreen = res.matches);
  }

  get sidenavMode() {
    return this.isSmallScreen ? 'over' : 'side';
  }

  toggleSubMenu(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
