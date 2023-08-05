import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.page.html',
  styleUrls: ['./sale.page.scss'],
})
export class SalePage implements OnInit {
  isModalOpen = false;

  // Crear el formularioVenta usando FormBuilder
  formularioVenta: FormGroup;

  venta = {
    document: '',
    idClient: '',
    idUser: '',
    idProduct: '',
    dateSale: '',
    serie: '',
    number: '',
    total: ''  
  };


  listaVentas = [];
  listaClientes = [];
  listaUsuarios = [];
  listaProductos = [];

  constructor(private database: DatabaseService, private formBuilder: FormBuilder) {
    this.formularioVenta = this.formBuilder.group({
      document: ['', Validators.required],
      idClient: ['', Validators.required],
      idUser: ['', Validators.required],
      idProduct: ['', Validators.required],
      dateSale: ['', Validators.required],
      serie: ['', Validators.required],
      number: ['', Validators.required],
      total: ['', Validators.required]
    });
  }
  

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openModalAdd(isOpen: boolean){
    this.venta = {
      document: '',
      idClient: '',
      idUser: '',
      idProduct: '',
      dateSale: '',
      serie: '',
      number: '',
      total: ''  
    };
  
    this.isModalOpen = isOpen;
  }

  ngOnInit() {

    this.database.getAll('ventas').then((firebaseResponse) => {
      firebaseResponse.subscribe((listaVentasRef) => {
        this.listaVentas = listaVentasRef.map((ventaRef) => {
          let venta = ventaRef.payload.doc.data();
          venta['id'] = ventaRef.payload.doc.id;
          return venta;
        });
      });
    });

    this.database.getAll('clientes').then((firebaseResponse) => {
      firebaseResponse.subscribe((listaClientesRef) => {
        this.listaClientes = listaClientesRef.map((clienteRef) => {
          let cliente = clienteRef.payload.doc.data();
          cliente['id'] = clienteRef.payload.doc.id;
          return cliente;
        });
      });
    });

    this.database.getAll('usuarios').then((firebaseResponse) => {
      firebaseResponse.subscribe((listaUsuariosRef) => {
        this.listaUsuarios = listaUsuariosRef.map((usuarioRef) => {
          let usuario = usuarioRef.payload.doc.data();
          usuario['id'] = usuarioRef.payload.doc.id;
          return usuario;
        });
      });
    });

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

  getNombreCliente(idCliente: string): string {
    const cliente = this.listaClientes.find((cliente) => cliente.id === idCliente);    
    return cliente ? cliente.name : 'Nombre no encontrado';
  }
  
  getNombreUsuario(idUsuario: string): string {
    const usuario = this.listaUsuarios.find((usuario) => usuario.id === idUsuario);
    return usuario ? usuario.name : 'Nombre no encontrado';
  }

  getDescripcionProducto(idProducto: string): string {
    const producto = this.listaProductos.find((producto) => producto.id === idProducto);
    return producto ? producto.description : 'Producto no encontrado';
  }
  

  registrarVenta() {
    if (this.venta['id']) {
      this.database.update('ventas', this.venta['id'], this.venta).then((res) => {
        console.log("Venta actualizado con exito");
        this.setOpen(false);
      }).catch((err) => {
        console.log("Error al actualizar venta: ", err);
        
      })
    }else{
      this.database
      .create('ventas', this.venta)
      .then((res) => {
        console.log(res);
        // this.userRegisterAlert.present();
        console.log("Venta agregado con exito");
        this.setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  editar(id) {
    this.database.getById('ventas', id).then((firebaseResponse) => {
      firebaseResponse.subscribe((ventasRef) => {
      // Obtener los datos del venta y su ID
      let venta = ventasRef.data();
      let ventaId = ventasRef.id;
      
      //Asignar los datos al objeto venta
      this.venta.document = venta['document'] || '';
      this.venta.idClient = venta['idClient'] || '';
      this.venta.idUser = venta['idUser'] || '';
      this.venta.idProduct = venta['idProduct'] || '';
      this.venta.dateSale = venta['dateSale'] || '';
      this.venta.serie = venta['serie'] || '';
      this.venta.number = venta['number'] || '';
      this.venta.total = venta['total'] || '';

      this.venta['id'] = ventaId
      
      this.setOpen(true);
      })
    })
  }
  
  
  eliminar(id) {
    this.database
      .delete('ventas', id)
      .then((res) => {
        console.log('Se elimino con exito');
      })
      .catch((err) => {
        console.log('Error al eliminar:', err);
      });
  }

}
