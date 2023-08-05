import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent  implements OnInit {
  pageTitle: string = 'Inicio';

  constructor(private menuCtrl: MenuController, private router: Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });
  }

  ngOnInit() {}

  closeMenuAndNavigate(route: string) {
    this.menuCtrl.close();
    this.router.navigateByUrl(route);
  }

  private updatePageTitle() {
    const currentRoute = this.router.url;

    switch (currentRoute) {
      case '/user':
        this.pageTitle = 'Usuarios';
        break;
      case '/client':
        this.pageTitle = 'Clientes';
        break;
      case '/product':
        this.pageTitle = 'Productos';
        break;
      case '/sale':
        this.pageTitle = 'Ventas';
        break;
      case '/about':
        this.pageTitle = 'Acerca de';
        break;
      default:
        this.pageTitle = 'Inicio';
    }
  }
}
