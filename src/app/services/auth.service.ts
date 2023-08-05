import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  
  // Método para iniciar sesión con Google

  
  async googleAuth() {
    const auth = getAuth(); // Obtener la referencia al objeto Auth
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Método para cerrar sesión
  async logOut() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }

  // Método para obtener el estado de autenticación del usuario
  getStateUser() {
    return this.afAuth.authState;
  }
}
