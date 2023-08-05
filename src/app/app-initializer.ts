import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AppInitializer {
  constructor(private afAuth: AngularFireAuth) {}

  initializeApp(): Promise<void> {
    const auth = getAuth(); // Obtener la referencia al objeto Auth
    return new Promise<void>((resolve) => {
      this.afAuth.onAuthStateChanged((user) => {
        resolve(); // Resuelve la promesa cuando la inicialización está completa
      });
    });
  }
}
