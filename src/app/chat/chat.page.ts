import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  newMessage: string;

  listaMensajes = [];
  listaUsuarios = [];

  userID: string;

  constructor(private database: DatabaseService) { }

  ngOnInit() {
    this.loadChatMessages();
    this.userID = this.database.getLoggedInUserId();

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

  async loadChatMessages() {
     this.database.getChatMessages().then((firebaseResponse) => {
      firebaseResponse.subscribe((listaMensajesRef) => {
        this.listaMensajes = listaMensajesRef.map((mensajeRef) => {
          let mensaje = mensajeRef.payload.doc.data();
          mensaje['id'] = mensajeRef.payload.doc.id;
          return mensaje;
        });
      });
    });
  }

  async sendMessage() {
    if (this.newMessage && this.newMessage.trim() !== '') {
      const message = {
        text: this.newMessage,
        timestamp: Date.now(),
        userId: this.userID
      };
      await this.database.createMessage(message);
      this.newMessage = '';
    }
  }

  getNombreUsuario(idUsuario: string): string {
    const usuario = this.listaUsuarios.find((usuario) => usuario.id === idUsuario);    
    return usuario ? usuario.name : 'Nombre no encontrado';
  }
}
