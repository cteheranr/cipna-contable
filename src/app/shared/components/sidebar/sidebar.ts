import { NgClass, NgFor } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { navbarData } from './nav-data';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/authSrv/auth';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(
    private renderer: Renderer2,
    private loginService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  isClosed: boolean = true;
  actClass: boolean = false;
  navbarData = navbarData;

  activarClase() {
    if (!this.actClass) {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }

    this.actClass = !this.actClass;
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  logout() {
    this.loginService.logout().then((res) => {
      this.router.navigate(['../../login'], {
        relativeTo: this.activatedRoute,
      });
    });
  }
}
