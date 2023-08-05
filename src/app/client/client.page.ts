import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {
  isModalOpen = false;

  // Crear el formularioCliente usando FormBuilder
  formularioCliente: FormGroup;

  cliente = {
    name: '',
    document: '',
    address: '',
    phone: ''
  };

  listaClientes = [];

  constructor(private database: DatabaseService, private formBuilder: FormBuilder) {
    this.formularioCliente = this.formBuilder.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
   }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openModalAdd(isOpen: boolean){
    this.cliente = {
      name: '',
      document: '',
      address: '',
      phone: ''
    };

    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.database.getAll('clientes').then((firebaseResponse) => {
      firebaseResponse.subscribe((listaClientesRef) => {
        this.listaClientes = listaClientesRef.map((clienteRef) => {
          let cliente = clienteRef.payload.doc.data();
          cliente['id'] = clienteRef.payload.doc.id;
          return cliente;
        });
      });
    });
  }

  registrarCliente() {
    if (this.cliente['id']) {
      this.database.update('clientes', this.cliente['id'], this.cliente).then((res) => {
        console.log("Cliente actualizado con exito");
        this.setOpen(false);
      }).catch((err) => {
        console.log("Error al actualizar cliente: ", err);
        
      })
    }else{
      this.database
      .create('clientes', this.cliente)
      .then((res) => {
        console.log(res);
        // this.userRegisterAlert.present();
        console.log("Cliente agregado con exito");
        this.setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  editar(id) {
    this.database.getById('clientes', id).then((firebaseResponse) => {
      firebaseResponse.subscribe((clientesRef) => {
      // Obtener los datos del cliente y su ID
      let cliente = clientesRef.data();
      let clienteId = clientesRef.id;
      
      //Asignar los datos al objeto cliente
      this.cliente.name = cliente['name'] || '';
      this.cliente.document = cliente['document'] || '';
      this.cliente.address = cliente['address'] || '';
      this.cliente.phone = cliente['phone'] || '';

      this.cliente['id'] = clienteId
      
      this.setOpen(true);
      })
    })
  }
  
  
  eliminar(id) {
    this.database
      .delete('clientes', id)
      .then((res) => {
        console.log('Se elimino con exito');
      })
      .catch((err) => {
        console.log('Error al eliminar:', err);
      });
  }

}
