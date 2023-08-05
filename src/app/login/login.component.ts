import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { IonAlert } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('incorrectAlert') incorrectAlert: IonAlert;
  @ViewChild('userEmptyAlert') userEmptyAlert: IonAlert;
  @ViewChild('userRegisterAlert') userRegisterAlert: IonAlert;

  usuario = {
    email: '',
    password: '',
  };

  listaUsuarios = [];

  public alertButtons = ['OK'];

  constructor(private database: DatabaseService, private router: Router, private authService: AuthService) {}

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

  async signInWithGoogle() {
     this.authService.googleAuth();
  }

  registrarUsuario() {
    this.database
      .create('usuarios', this.usuario)
      .then((res) => {
        console.log(res);
        this.userRegisterAlert.present();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  validarUsuario() {
    interface UserData {
      email: string;
      password: string;
    }

    this.database
      .validar('usuarios', this.usuario.email)
      .then((firebaseResponse) => {
        if (!firebaseResponse.empty) {
          const userRef = firebaseResponse.docs[0].data() as UserData;
          if (userRef.password === this.usuario.password) {

            let userId = firebaseResponse.docs[0].id;
            this.database.setLoggedInUserId(userId);

            this.router.navigate(['/inventario/home']);
          } else {
            this.incorrectAlert.present();
          }
        } else {
          console.log('Usuario no encontrado');
          this.userEmptyAlert.present();
        }
      })
      .catch((err) => {
        console.log('Error al validar: ', err);
      });
  }

  eliminar(id) {
    this.database
      .delete('usuarios', id)
      .then((res) => {
        console.log('Se elimino con exito', res);
      })
      .catch((err) => {
        console.log('Error al eliminar:', err);
      });
  }
}
