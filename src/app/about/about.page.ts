import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  services = [
    {
      title: 'Delivery',
      icon: 'bicycle',
      description: 'Entrega rápida y segura a domicilio.',
    },
    {
      title: 'Atención al Cliente',
      icon: 'people',
      description: 'Atención amable y personalizada para resolver tus dudas.',
    },
    {
      title: 'Variedad de Productos',
      icon: 'basket',
      description: 'Amplia selección de productos de alta calidad.',
    },
    {
      title: 'Ofertas Especiales',
      icon: 'pricetag',
      description: 'Descubre nuestras increíbles ofertas y promociones.',
    },
  ];

  constructor() {}

  ngOnInit() {
  }

}
