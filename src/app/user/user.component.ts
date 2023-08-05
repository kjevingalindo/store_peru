import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {
  isModalOpen = false;

  // Crear el formulario usando FormBuilder
  formulario: FormGroup;

  usuario = {
    name: '',
    email: '',
    password: '',
  };

  listaUsuarios = [];

  constructor(private database: DatabaseService, private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      // Validador personalizado para comparar las contraseñas
      validator: this.passwordMatchValidator
    });
   }

  // Validador personalizado para comparar las contraseñas
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (password === confirmPassword) {
      formGroup.get('confirmPassword').setErrors(null);
    } else {
      formGroup.get('confirmPassword').setErrors({ mismatch: true });
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openModalAdd(isOpen: boolean){
    this.usuario = {
      name: '',
      email: '',
      password: '',
    };

    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.database.getAll('usuarios').then((firebaseResponse) => {
      firebaseResponse.subscribe((listaUsuariosRef) => {
        this.listaUsuarios = listaUsuariosRef.map((usuarioRef) => {
          let usuario = usuarioRef.payload.doc.data();
          usuario['id'] = usuarioRef.payload.doc.id;
          return usuario;
        });
      });
    });
  }

  registrarUsuario() {
    if (this.usuario['id']) {
      this.database.update('usuarios', this.usuario['id'], this.usuario).then((res) => {
        console.log("Usuario actualizado con exito");
        this.setOpen(false);
      }).catch((err) => {
        console.log("Error al actualizar usuario: ", err);
        
      })
    }else{
      this.database
      .create('usuarios', this.usuario)
      .then((res) => {
        console.log(res);
        // this.userRegisterAlert.present();
        console.log("Usuario agregado con exito");
        this.setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  editar(id) {
    this.database.getById('usuarios', id).then((firebaseResponse) => {
      firebaseResponse.subscribe((usuariosRef) => {
      // Obtener los datos del usuario y su ID
      let usuario = usuariosRef.data();
      let usuarioId = usuariosRef.id;
      
      //Asignar los datos al objeto usuario
      this.usuario.name = usuario['name'] || '';
      this.usuario.email = usuario['email'] || '';
      this.usuario.password = usuario['password'] || '';

      this.usuario['id'] = usuarioId
      
      this.setOpen(true);
      })
    })
  }
  
  
  eliminar(id) {
    this.database
      .delete('usuarios', id)
      .then((res) => {
        console.log('Se elimino con exito');
      })
      .catch((err) => {
        console.log('Error al eliminar:', err);
      });
  }

}
