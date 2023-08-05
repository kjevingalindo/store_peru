import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  isModalOpen = false;

  // Crear el formularioProducto usando FormBuilder
  formularioProducto: FormGroup;

  producto = {
    description: '',
    price: '',
    stock: '',
    category: ''
  };

  listaProductos = [];

  constructor(private database: DatabaseService, private formBuilder: FormBuilder) {
    this.formularioProducto = this.formBuilder.group({
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      category: ['', Validators.required]
    });
  }
  

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openModalAdd(isOpen: boolean){
    this.producto = {
      description: '',
      price: '',
      stock: '',
      category: ''
    };

    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.database.getAll('productos').then((firebaseResponse) => {
      firebaseResponse.subscribe((listaProductosRef) => {
        this.listaProductos = listaProductosRef.map((productoRef) => {
          let producto = productoRef.payload.doc.data();
          producto['id'] = productoRef.payload.doc.id;
          return producto;
        });
      });
    });
  }

  registrarProducto() {
    if (this.producto['id']) {
      this.database.update('productos', this.producto['id'], this.producto).then((res) => {
        console.log("Producto actualizado con exito");
        this.setOpen(false);
      }).catch((err) => {
        console.log("Error al actualizar producto: ", err);
        
      })
    }else{
      this.database
      .create('productos', this.producto)
      .then((res) => {
        console.log(res);
        // this.userRegisterAlert.present();
        console.log("Producto agregado con exito");
        this.setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  editar(id) {
    this.database.getById('productos', id).then((firebaseResponse) => {
      firebaseResponse.subscribe((productosRef) => {
      // Obtener los datos del producto y su ID
      let producto = productosRef.data();
      let productoId = productosRef.id;

      //Asignar los datos al objeto producto
      this.producto.description = producto['description'] || '';
      this.producto.price = producto['price'] || '';
      this.producto.stock = producto['stock'] || '';
      this.producto.category = producto['category'] || '';



      this.producto['id'] = productoId
      
      this.setOpen(true);
      })
    })
  }
  
  
  eliminar(id) {
    this.database
      .delete('productos', id)
      .then((res) => {
        console.log('Se elimino con exito');
      })
      .catch((err) => {
        console.log('Error al eliminar:', err);
      });
  }

}
