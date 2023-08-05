import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  private loggedInUserId: string;


  getLoggedInUserId(): string {
    return this.loggedInUserId;
  }

  setLoggedInUserId(userId: string): void {
    this.loggedInUserId = userId;
  }

  async createMessage(message){
    try {
      return await this.firestore.collection('chat-messages').add(message);
    } catch (error) {
      console.error('Error al crear el mensaje:', error);
      return Promise.reject(error);
    }
  }

  async getChatMessages() {
    try{
      return await this.firestore.collection('chat-messages', ref => ref.orderBy('timestamp')).snapshotChanges();
    }catch (error){
      console.log("Error en getAll: ", error);
      return Promise.reject(error);
    } 
  }  

  async validar(collection, email){
    try {
      return await this.firestore.collection(collection, ref => ref.where('email', '==', email)).get().toPromise();
    } catch (error) {
      console.error('Error al validar las credenciales:', error);
      return Promise.reject(error);
    }
  }

  async create(collection, dato){
    try{
      return await this.firestore.collection(collection).add(dato);
    }catch (error){
      console.log("Error en create: ", error);
      return Promise.reject(error);
    }
  }

  async getAll(collection){
    try{
      return await this.firestore.collection(collection).snapshotChanges();
    }catch (error){
      console.log("Error en getAll: ", error);
      return Promise.reject(error);
    } 
  }

  async getById(collection, id){
    try{
      return await this.firestore.collection(collection).doc(id).get();
    }catch (error){
      console.log("Error en getById: ", error);
      return Promise.reject(error);
    } 
  }

  async delete(collection, id){
    try{
      return await this.firestore.collection(collection).doc(id).delete();
    }catch (error){
      console.log("Error en delete: ", error);
      return Promise.reject(error);
    } 
  }

  async update(collection, id, dato){
    try{
      return await this.firestore.collection(collection).doc(id).set(dato);
    }catch (error){
      console.log("Error en update: ", error);
      return Promise.reject(error);
    } 
  }
}
